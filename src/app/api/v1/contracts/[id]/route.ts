import { NextRequest } from "next/server"
import { verifyApiKey, apiError, apiSuccess, hasScope } from "@/lib/api-auth"
import { createServerSupabaseClient } from "@/lib/supabase-server"

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/v1/contracts/:id - Get a single contract
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params

  const auth = await verifyApiKey(request)
  if (!auth.success) {
    const status = auth.errorCode === 'RATE_LIMITED' ? 429 : 401
    return apiError(auth.error!, status, auth.errorCode)
  }

  if (!hasScope(auth.scopes || [], 'contracts:read')) {
    return apiError('Insufficient permissions. Required scope: contracts:read', 403, 'FORBIDDEN')
  }

  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(id)) {
    return apiError('Invalid contract ID format', 400, 'INVALID_ID')
  }

  try {
    const supabase = await createServerSupabaseClient()

    const { data: contract, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('id', id)
      .eq('user_id', auth.userId!)
      .single()

    if (error || !contract) {
      return apiError('Contract not found', 404, 'NOT_FOUND')
    }

    return apiSuccess({
      id: contract.id,
      title: contract.title,
      status: contract.status,
      content: contract.content,
      summary: contract.summary,
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
      exclusivity_details: contract.exclusivity_details,
      usage_rights: contract.usage_rights,
      pdf_url: contract.pdf_url,
      expires_at: contract.expires_at,
      signed_at: contract.signed_at,
      created_at: contract.created_at,
      updated_at: contract.updated_at,
    })
  } catch (err) {
    console.error('API error:', err)
    return apiError('Contract not found', 404, 'NOT_FOUND')
  }
}

// PATCH /api/v1/contracts/:id - Update a contract
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params

  const auth = await verifyApiKey(request)
  if (!auth.success) {
    const status = auth.errorCode === 'RATE_LIMITED' ? 429 : 401
    return apiError(auth.error!, status, auth.errorCode)
  }

  if (!hasScope(auth.scopes || [], 'contracts:write')) {
    return apiError('Insufficient permissions. Required scope: contracts:write', 403, 'FORBIDDEN')
  }

  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(id)) {
    return apiError('Invalid contract ID format', 400, 'INVALID_ID')
  }

  let body: any
  try {
    body = await request.json()
  } catch {
    return apiError('Invalid JSON body', 400, 'INVALID_JSON')
  }

  // Validate status if provided
  const validStatuses = ['draft', 'pending_review', 'pending_signature', 'signed', 'expired', 'cancelled']
  if (body.status && !validStatuses.includes(body.status)) {
    return apiError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400, 'VALIDATION_ERROR')
  }

  // Validate compensation_type if provided
  const validCompensationTypes = ['flat', 'hourly', 'commission', 'hybrid']
  if (body.compensation_type && !validCompensationTypes.includes(body.compensation_type)) {
    return apiError(`Invalid compensation_type. Must be one of: ${validCompensationTypes.join(', ')}`, 400, 'VALIDATION_ERROR')
  }

  // Build update object (only include provided fields)
  const updateFields: Record<string, any> = {}
  const allowedFields = [
    'title', 'status', 'content', 'summary', 'creator_name', 'creator_email',
    'brand_name', 'brand_contact_name', 'brand_contact_email', 'platform',
    'deliverables', 'compensation', 'compensation_type', 'currency',
    'start_date', 'end_date', 'exclusivity', 'exclusivity_details', 'usage_rights'
  ]

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updateFields[field] = body[field]
    }
  }

  if (Object.keys(updateFields).length === 0) {
    return apiError('No valid fields to update', 400, 'VALIDATION_ERROR')
  }

  // Parse compensation as number if provided
  if (updateFields.compensation !== undefined) {
    updateFields.compensation = parseFloat(updateFields.compensation) || null
  }

  try {
    const supabase = await createServerSupabaseClient()

    // First check if contract exists and belongs to user
    const { data: existing, error: fetchError } = await supabase
      .from('contracts')
      .select('id')
      .eq('id', id)
      .eq('user_id', auth.userId!)
      .single()

    if (fetchError || !existing) {
      return apiError('Contract not found', 404, 'NOT_FOUND')
    }

    // Update contract
    const { data: contract, error } = await supabase
      .from('contracts')
      .update(updateFields)
      .eq('id', id)
      .eq('user_id', auth.userId!)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return apiError('Failed to update contract', 500, 'DATABASE_ERROR')
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
    })
  } catch (err) {
    console.error('API error:', err)
    return apiError('Failed to update contract', 500, 'SERVER_ERROR')
  }
}

// DELETE /api/v1/contracts/:id - Delete a contract
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params

  const auth = await verifyApiKey(request)
  if (!auth.success) {
    const status = auth.errorCode === 'RATE_LIMITED' ? 429 : 401
    return apiError(auth.error!, status, auth.errorCode)
  }

  if (!hasScope(auth.scopes || [], 'contracts:write')) {
    return apiError('Insufficient permissions. Required scope: contracts:write', 403, 'FORBIDDEN')
  }

  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(id)) {
    return apiError('Invalid contract ID format', 400, 'INVALID_ID')
  }

  try {
    const supabase = await createServerSupabaseClient()

    // First check if contract exists and belongs to user
    const { data: existing, error: fetchError } = await supabase
      .from('contracts')
      .select('id, status')
      .eq('id', id)
      .eq('user_id', auth.userId!)
      .single()

    if (fetchError || !existing) {
      return apiError('Contract not found', 404, 'NOT_FOUND')
    }

    // Prevent deletion of signed contracts
    if (existing.status === 'signed') {
      return apiError('Cannot delete a signed contract', 400, 'CANNOT_DELETE_SIGNED')
    }

    // Delete contract
    const { error } = await supabase
      .from('contracts')
      .delete()
      .eq('id', id)
      .eq('user_id', auth.userId!)

    if (error) {
      console.error('Database error:', error)
      return apiError('Failed to delete contract', 500, 'DATABASE_ERROR')
    }

    return new Response(null, { status: 204 })
  } catch (err) {
    console.error('API error:', err)
    return apiError('Failed to delete contract', 500, 'SERVER_ERROR')
  }
}
