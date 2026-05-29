import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { cookies } from "next/headers"

interface RouteParams {
  params: Promise<{ id: string }>
}

// Helper to get current user from session
async function getCurrentUser() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

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

// DELETE /api/v1/api-keys/:id - Revoke an API key
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params

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

  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(id)) {
    return NextResponse.json(
      { error: { message: 'Invalid API key ID format', code: 'INVALID_ID' } },
      { status: 400 }
    )
  }

  try {
    const supabase = await createServerSupabaseClient()

    // Check if key exists and belongs to user
    const { data: existing, error: fetchError } = await supabase
      .from('api_keys')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !existing) {
      return NextResponse.json(
        { error: { message: 'API key not found', code: 'NOT_FOUND' } },
        { status: 404 }
      )
    }

    // Soft delete - mark as inactive instead of deleting
    const { error } = await supabase
      .from('api_keys')
      .update({ is_active: false })
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: { message: 'Failed to revoke API key', code: 'DATABASE_ERROR' } },
        { status: 500 }
      )
    }

    return new Response(null, { status: 204 })
  } catch (err) {
    console.error('API error:', err)

    // Demo mode
    return new Response(null, { status: 204 })
  }
}

// PATCH /api/v1/api-keys/:id - Update API key (name, scopes)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params

  const user = await getCurrentUser() || await getDemoUser()

  if (!user) {
    return NextResponse.json(
      { error: { message: 'Unauthorized', code: 'UNAUTHORIZED' } },
      { status: 401 }
    )
  }

  if (user.plan !== 'agency') {
    return NextResponse.json(
      { error: { message: 'API access requires Agency plan', code: 'PLAN_REQUIRED' } },
      { status: 403 }
    )
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(id)) {
    return NextResponse.json(
      { error: { message: 'Invalid API key ID format', code: 'INVALID_ID' } },
      { status: 400 }
    )
  }

  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: { message: 'Invalid JSON body', code: 'INVALID_JSON' } },
      { status: 400 }
    )
  }

  const updateFields: Record<string, any> = {}

  if (body.name !== undefined) {
    updateFields.name = body.name
  }

  if (body.scopes !== undefined) {
    const validScopes = ['contracts:read', 'contracts:write', 'contracts:*', '*']
    for (const scope of body.scopes) {
      if (!validScopes.includes(scope)) {
        return NextResponse.json(
          { error: { message: `Invalid scope: ${scope}`, code: 'VALIDATION_ERROR' } },
          { status: 400 }
        )
      }
    }
    updateFields.scopes = body.scopes
  }

  if (Object.keys(updateFields).length === 0) {
    return NextResponse.json(
      { error: { message: 'No valid fields to update', code: 'VALIDATION_ERROR' } },
      { status: 400 }
    )
  }

  try {
    const supabase = await createServerSupabaseClient()

    const { data: apiKey, error } = await supabase
      .from('api_keys')
      .update(updateFields)
      .eq('id', id)
      .eq('user_id', user.id)
      .select('id, name, key_prefix, scopes, is_active, last_used_at, expires_at, created_at')
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: { message: 'API key not found', code: 'NOT_FOUND' } },
        { status: 404 }
      )
    }

    return NextResponse.json({
      data: {
        id: apiKey.id,
        name: apiKey.name,
        key_preview: `${apiKey.key_prefix}...`,
        scopes: apiKey.scopes,
        is_active: apiKey.is_active,
        last_used_at: apiKey.last_used_at,
        expires_at: apiKey.expires_at,
        created_at: apiKey.created_at,
      }
    })
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json(
      { error: { message: 'Failed to update API key', code: 'SERVER_ERROR' } },
      { status: 500 }
    )
  }
}
