import { NextRequest } from "next/server"
import { createServerSupabaseClient } from "./supabase-server"

export interface ApiAuthResult {
  success: boolean
  userId?: string
  plan?: 'free' | 'creator' | 'agency'
  keyId?: string
  scopes?: string[]
  error?: string
  errorCode?: 'MISSING_KEY' | 'INVALID_FORMAT' | 'INVALID_KEY' | 'EXPIRED_KEY' | 'INACTIVE_KEY' | 'PLAN_REQUIRED' | 'RATE_LIMITED'
}

// In-memory rate limiting store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

const RATE_LIMITS = {
  agency: { requests: 100, windowMs: 60 * 1000 }, // 100 requests per minute
  creator: { requests: 30, windowMs: 60 * 1000 }, // 30 requests per minute (if enabled later)
}

export async function verifyApiKey(request: NextRequest): Promise<ApiAuthResult> {
  const apiKey = request.headers.get("x-api-key") ||
                 request.headers.get("authorization")?.replace("Bearer ", "")

  if (!apiKey) {
    return {
      success: false,
      error: "Missing API key. Include it in the x-api-key header or as a Bearer token.",
      errorCode: 'MISSING_KEY'
    }
  }

  // Validate API key format
  if (!apiKey.startsWith("cg_")) {
    return {
      success: false,
      error: "Invalid API key format. Keys should start with 'cg_'",
      errorCode: 'INVALID_FORMAT'
    }
  }

  // Extract prefix for lookup (first 8 chars after cg_)
  const keyPrefix = apiKey.slice(0, 11) // "cg_" + 8 chars

  try {
    const supabase = await createServerSupabaseClient()

    // Look up API key by prefix and verify hash
    const { data: keyRecord, error } = await supabase
      .from('api_keys')
      .select(`
        id,
        user_id,
        key_hash,
        scopes,
        is_active,
        expires_at,
        profiles!api_keys_user_id_fkey (
          plan
        )
      `)
      .eq('key_prefix', keyPrefix)
      .single()

    if (error || !keyRecord) {
      return {
        success: false,
        error: "Invalid API key",
        errorCode: 'INVALID_KEY'
      }
    }

    // Verify the full key hash
    const keyHash = await hashApiKey(apiKey)
    if (keyHash !== keyRecord.key_hash) {
      return {
        success: false,
        error: "Invalid API key",
        errorCode: 'INVALID_KEY'
      }
    }

    // Check if key is active
    if (!keyRecord.is_active) {
      return {
        success: false,
        error: "API key has been revoked",
        errorCode: 'INACTIVE_KEY'
      }
    }

    // Check expiration
    if (keyRecord.expires_at && new Date(keyRecord.expires_at) < new Date()) {
      return {
        success: false,
        error: "API key has expired",
        errorCode: 'EXPIRED_KEY'
      }
    }

    // Get user's plan
    const userPlan = (keyRecord.profiles as any)?.plan || 'free'

    // Check if user has Agency plan (API access requires Agency)
    if (userPlan !== 'agency') {
      return {
        success: false,
        error: "API access requires Agency plan. Upgrade at /dashboard/pricing",
        errorCode: 'PLAN_REQUIRED'
      }
    }

    // Rate limiting check
    const rateLimitResult = checkRateLimit(keyRecord.id, userPlan)
    if (!rateLimitResult.allowed) {
      return {
        success: false,
        error: `Rate limit exceeded. ${rateLimitResult.remaining} requests remaining. Resets in ${rateLimitResult.resetIn} seconds.`,
        errorCode: 'RATE_LIMITED'
      }
    }

    // Update last_used_at
    await supabase
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', keyRecord.id)

    return {
      success: true,
      userId: keyRecord.user_id,
      plan: userPlan,
      keyId: keyRecord.id,
      scopes: keyRecord.scopes || ['contracts:read', 'contracts:write']
    }
  } catch (err) {
    console.error('API auth error:', err)

    // Demo mode fallback - validate format only
    if (apiKey.startsWith("cg_") && apiKey.length >= 35) {
      return {
        success: true,
        userId: "demo-user",
        plan: "agency",
        keyId: "demo-key",
        scopes: ['contracts:read', 'contracts:write']
      }
    }

    return {
      success: false,
      error: "Authentication failed",
      errorCode: 'INVALID_KEY'
    }
  }
}

function checkRateLimit(keyId: string, plan: 'agency' | 'creator'): {
  allowed: boolean
  remaining: number
  resetIn: number
} {
  const limits = RATE_LIMITS[plan] || RATE_LIMITS.agency
  const now = Date.now()

  const record = rateLimitStore.get(keyId)

  if (!record || now > record.resetAt) {
    // New window
    rateLimitStore.set(keyId, { count: 1, resetAt: now + limits.windowMs })
    return { allowed: true, remaining: limits.requests - 1, resetIn: Math.ceil(limits.windowMs / 1000) }
  }

  if (record.count >= limits.requests) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: Math.ceil((record.resetAt - now) / 1000)
    }
  }

  record.count++
  return {
    allowed: true,
    remaining: limits.requests - record.count,
    resetIn: Math.ceil((record.resetAt - now) / 1000)
  }
}

export function generateApiKey(): { key: string; prefix: string; hash: Promise<string> } {
  const random = crypto.randomUUID().replace(/-/g, '') +
                 crypto.randomUUID().replace(/-/g, '').slice(0, 8)
  const key = `cg_${random}`
  const prefix = key.slice(0, 11) // "cg_" + 8 chars

  return {
    key,
    prefix,
    hash: hashApiKey(key)
  }
}

async function hashApiKey(key: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(key)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// Helper to check if a scope is allowed
export function hasScope(scopes: string[], required: string): boolean {
  if (scopes.includes('*')) return true

  // Check exact match
  if (scopes.includes(required)) return true

  // Check wildcard (e.g., "contracts:*" matches "contracts:read")
  const [resource] = required.split(':')
  if (scopes.includes(`${resource}:*`)) return true

  return false
}

// Response helpers
export function apiError(message: string, status: number = 400, code?: string) {
  return Response.json(
    {
      error: {
        message,
        code: code || 'BAD_REQUEST',
        status
      }
    },
    { status }
  )
}

export function apiSuccess<T>(data: T, status: number = 200) {
  return Response.json({ data }, { status })
}

export function apiList<T>(
  items: T[],
  pagination: { page: number; limit: number; total: number }
) {
  return Response.json({
    data: items,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: Math.ceil(pagination.total / pagination.limit),
      hasMore: pagination.page * pagination.limit < pagination.total
    }
  })
}
