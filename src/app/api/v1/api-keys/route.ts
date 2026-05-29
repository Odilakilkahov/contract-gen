import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { generateApiKey } from "@/lib/api-auth"
import { cookies } from "next/headers"

// Helper to get current user from session (not API key)
async function getCurrentUser() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    // Get user profile with plan
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .single()

    return {
      id: user.id,
      email: user.email,
      plan: profile?.plan || 'free'
    }
  } catch {
    return null
  }
}

// Check for demo session
async function getDemoUser() {
  const cookieStore = await cookies()
  const demoSession = cookieStore.get('demo-session')?.value
  if (demoSession) {
    try {
      const session = JSON.parse(demoSession)
      return {
        id: session.userId || 'demo-user',
        email: session.email || 'demo@example.com',
        plan: session.plan || 'agency'
      }
    } catch {
      return null
    }
  }
  return null
}

// GET /api/v1/api-keys - List user's API keys
export async function GET(request: NextRequest) {
  const user = await getCurrentUser() || await getDemoUser()

  if (!user) {
    return NextResponse.json(
      { error: { message: 'Unauthorized', code: 'UNAUTHORIZED' } },
      { status: 401 }
    )
  }

  // Check plan
  if (user.plan !== 'agency') {
    return NextResponse.json(
      { error: { message: 'API access requires Agency plan', code: 'PLAN_REQUIRED' } },
      { status: 403 }
    )
  }

  try {
    const supabase = await createServerSupabaseClient()

    const { data: keys, error } = await supabase
      .from('api_keys')
      .select('id, name, key_prefix, scopes, is_active, last_used_at, expires_at, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: { message: 'Failed to fetch API keys', code: 'DATABASE_ERROR' } },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: keys.map(key => ({
        id: key.id,
        name: key.name,
        key_preview: `${key.key_prefix}...`,
        scopes: key.scopes,
        is_active: key.is_active,
        last_used_at: key.last_used_at,
        expires_at: key.expires_at,
        created_at: key.created_at,
      }))
    })
  } catch (err) {
    console.error('API error:', err)

    // Demo mode - return empty list
    return NextResponse.json({ data: [] })
  }
}

// POST /api/v1/api-keys - Create a new API key
export async function POST(request: NextRequest) {
  const user = await getCurrentUser() || await getDemoUser()

  if (!user) {
    return NextResponse.json(
      { error: { message: 'Unauthorized', code: 'UNAUTHORIZED' } },
      { status: 401 }
    )
  }

  // Check plan
  if (user.plan !== 'agency') {
    return NextResponse.json(
      { error: { message: 'API access requires Agency plan', code: 'PLAN_REQUIRED' } },
      { status: 403 }
    )
  }

  let body: any
  try {
    body = await request.json()
  } catch {
    body = {}
  }

  const name = body.name || 'API Key'
  const scopes = body.scopes || ['contracts:read', 'contracts:write']

  // Validate scopes
  const validScopes = ['contracts:read', 'contracts:write', 'contracts:*', '*']
  for (const scope of scopes) {
    if (!validScopes.includes(scope)) {
      return NextResponse.json(
        { error: { message: `Invalid scope: ${scope}`, code: 'VALIDATION_ERROR' } },
        { status: 400 }
      )
    }
  }

  // Generate new API key
  const { key, prefix, hash } = generateApiKey()
  const keyHash = await hash

  // Calculate expiration (optional, default no expiration)
  let expiresAt: string | null = null
  if (body.expires_in_days) {
    const expDate = new Date()
    expDate.setDate(expDate.getDate() + body.expires_in_days)
    expiresAt = expDate.toISOString()
  }

  try {
    const supabase = await createServerSupabaseClient()

    // Check existing key count (limit to 5 keys per user)
    const { count } = await supabase
      .from('api_keys')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_active', true)

    if (count && count >= 5) {
      return NextResponse.json(
        { error: { message: 'Maximum of 5 active API keys allowed', code: 'LIMIT_EXCEEDED' } },
        { status: 400 }
      )
    }

    const { data: apiKey, error } = await supabase
      .from('api_keys')
      .insert({
        user_id: user.id,
        name,
        key_hash: keyHash,
        key_prefix: prefix,
        scopes,
        expires_at: expiresAt,
        is_active: true,
      })
      .select('id, name, key_prefix, scopes, is_active, expires_at, created_at')
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: { message: 'Failed to create API key', code: 'DATABASE_ERROR' } },
        { status: 500 }
      )
    }

    // Return the full key only once (on creation)
    return NextResponse.json({
      data: {
        id: apiKey.id,
        name: apiKey.name,
        key: key, // Full key - only shown once!
        key_preview: `${prefix}...`,
        scopes: apiKey.scopes,
        is_active: apiKey.is_active,
        expires_at: apiKey.expires_at,
        created_at: apiKey.created_at,
      },
      warning: 'Store this key securely. It will not be shown again.'
    }, { status: 201 })
  } catch (err) {
    console.error('API error:', err)

    // Demo mode - return generated key
    return NextResponse.json({
      data: {
        id: crypto.randomUUID(),
        name,
        key: key,
        key_preview: `${prefix}...`,
        scopes,
        is_active: true,
        expires_at: expiresAt,
        created_at: new Date().toISOString(),
      },
      warning: 'Store this key securely. It will not be shown again.'
    }, { status: 201 })
  }
}
