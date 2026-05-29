import { NextRequest } from "next/server"
import { verifyApiKey, apiError, apiSuccess, apiList, hasScope } from "@/lib/api-auth"
import { createServerSupabaseClient } from "@/lib/supabase-server"

// GET /api/v1/contracts - List all contracts
export async function GET(request: NextRequest) {
  const auth = await verifyApiKey(request)
  if (!auth.success) {
    const status = auth.errorCode === 'RATE_LIMITED' ? 429 : 401
    return apiError(auth.error!, status, auth.errorCode)
  }

  // Check scope
  if (!hasScope(auth.scopes || [], 'contracts:read')) {
    return apiError('Insufficient permissions. Required scope: contracts:read', 403, 'FORBIDDEN')
  }

  // Parse query parameters
  const { searchParams } = new URL(request.url)
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')))
  const status = searchParams.get('status')
  const search = searchParams.get('search')
  const sortBy = searchParams.get('sort_by') || 'created_at'
  const sortOrder = searchParams.get('sort_order') === 'asc' ? 'asc' : 'desc'

  try {
    const supabase = await createServerSupabaseClient()

    // Build query
    let query = supabase
      .from('contracts')
      .select('*', { count: 'exact' })
      .eq('user_id', auth.userId!)

    // Apply filters
    if (status) {
      query = query.eq('status', status)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,brand_name.ilike.%${search}%,creator_name.ilike.%${search}%`)
    }

    // Apply sorting
    const validSortFields = ['created_at', 'updated_at', 'title', 'status', 'compensation']
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at'
    query = query.order(sortField, { ascending: sortOrder === 'asc' })

    // Apply pagination
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    const { data: contracts, error, count } = await query

    if (error) {
      console.error('Database error:', error)
      return apiError('Failed to fetch contracts', 500, 'DATABASE_ERROR')
    }

    // Transform data for API response
    const transformedContracts = (contracts || []).map(contract => ({
      id: contract.id,
      title: contract.title,
      status: contract.status,
      brand_name: contract.brand_name,
      brand_contact_name: contract.brand_contact_name,
      brand_contact_email: contract.brand_contact_email,
      creator_name: contract.creator_name,
      creator_email: contract.creator_email,
      platform: contract.platform,
      compensation: contract.compensation,
      compensation_type: contract.compensation_type,
      currency: contract.currency,
      deliverables: contract.deliverables,
      start_date: contract.start_date,
      end_date: contract.end_date,
      exclusivity: contract.exclusivity,
      pdf_url: contract.pdf_url,
      created_at: contract.created_at,
      updated_at: contract.updated_at,
    }))

    return apiList(transformedContracts, {
      page,
      limit,
      total: count || 0
    })
  } catch (err) {
    console.error('API error:', err)

    // Demo mode fallback
    return apiList([], { page: 1, limit: 20, total: 0 })
  }
}

// POST /api/v1/contracts - Create a new contract
export async function POST(request: NextRequest) {
  const auth = await verifyApiKey(request)
  if (!auth.success) {
    const status = auth.errorCode === 'RATE_LIMITED' ? 429 : 401
    return apiError(auth.error!, status, auth.errorCode)
  }

  // Check scope
  if (!hasScope(auth.scopes || [], 'contracts:write')) {
    return apiError('Insufficient permissions. Required scope: contracts:write', 403, 'FORBIDDEN')
  }

  let body: any
  try {
    body = await request.json()
  } catch {
    return apiError('Invalid JSON body', 400, 'INVALID_JSON')
  }

  // Validate required fields
  const required = ['title']
  for (const field of required) {
    if (!body[field]) {
      return apiError(`Missing required field: ${field}`, 400, 'VALIDATION_ERROR')
    }
  }

  // Validate optional fields
  const validStatuses = ['draft', 'pending_review', 'pending_signature', 'signed', 'expired', 'cancelled']
  if (body.status && !validStatuses.includes(body.status)) {
    return apiError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400, 'VALIDATION_ERROR')
  }

  const validCompensationTypes = ['flat', 'hourly', 'commission', 'hybrid']
  if (body.compensation_type && !validCompensationTypes.includes(body.compensation_type)) {
    return apiError(`Invalid compensation_type. Must be one of: ${validCompensationTypes.join(', ')}`, 400, 'VALIDATION_ERROR')
  }

  try {
    const supabase = await createServerSupabaseClient()

    const contractData = {
      user_id: auth.userId!,
      title: body.title,
      status: body.status || 'draft',
      content: body.content || null,
      summary: body.summary || null,
      creator_name: body.creator_name || null,
      creator_email: body.creator_email || null,
      brand_name: body.brand_name || null,
      brand_contact_name: body.brand_contact_name || null,
      brand_contact_email: body.brand_contact_email || null,
      platform: body.platform || null,
      deliverables: body.deliverables || [],
      compensation: body.compensation ? parseFloat(body.compensation) : null,
      compensation_type: body.compensation_type || null,
      currency: body.currency || 'USD',
      start_date: body.start_date || null,
      end_date: body.end_date || null,
      exclusivity: body.exclusivity || false,
      exclusivity_details: body.exclusivity_details || null,
      usage_rights: body.usage_rights || {},
    }

    const { data: contract, error } = await supabase
      .from('contracts')
      .insert(contractData)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return apiError('Failed to create contract', 500, 'DATABASE_ERROR')
    }

    return apiSuccess({
      id: contract.id,
      title: contract.title,
      status: contract.status,
      brand_name: contract.brand_name,
      creator_name: contract.creator_name,
      platform: contract.platform,
      compensation: contract.compensation,
      compensation_type: contract.compensation_type,
      currency: contract.currency,
      deliverables: contract.deliverables,
      start_date: contract.start_date,
      end_date: contract.end_date,
      exclusivity: contract.exclusivity,
      created_at: contract.created_at,
      updated_at: contract.updated_at,
    }, 201)
  } catch (err) {
    console.error('API error:', err)

    // Demo mode fallback
    const demoContract = {
      id: crypto.randomUUID(),
      ...body,
      user_id: auth.userId,
      status: body.status || 'draft',
      currency: body.currency || 'USD',
      deliverables: body.deliverables || [],
      exclusivity: body.exclusivity || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    return apiSuccess(demoContract, 201)
  }
}
