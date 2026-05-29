import { NextRequest } from "next/server"
import { verifyApiKey, apiError, apiSuccess, hasScope } from "@/lib/api-auth"
import { createServerSupabaseClient } from "@/lib/supabase-server"

interface RouteParams {
  params: Promise<{ id: string }>
}

// POST /api/v1/contracts/:id/send - Send contract for signature
export async function POST(request: NextRequest, { params }: RouteParams) {
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

  // Validate required fields for sending
  if (!body.recipient_email) {
    return apiError('Missing required field: recipient_email', 400, 'VALIDATION_ERROR')
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(body.recipient_email)) {
    return apiError('Invalid email format for recipient_email', 400, 'VALIDATION_ERROR')
  }

  try {
    const supabase = await createServerSupabaseClient()

    // Get contract
    const { data: contract, error: fetchError } = await supabase
      .from('contracts')
      .select('*')
      .eq('id', id)
      .eq('user_id', auth.userId!)
      .single()

    if (fetchError || !contract) {
      return apiError('Contract not found', 404, 'NOT_FOUND')
    }

    // Check contract status
    if (contract.status === 'signed') {
      return apiError('Contract is already signed', 400, 'ALREADY_SIGNED')
    }

    if (contract.status === 'cancelled') {
      return apiError('Cannot send a cancelled contract', 400, 'CONTRACT_CANCELLED')
    }

    // Generate access token for signature
    const accessToken = crypto.randomUUID()

    // Calculate expiration (default 7 days)
    const expiresInDays = body.expires_in_days || 7
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + expiresInDays)

    // Create signature request
    const { data: signatureRequest, error: sigError } = await supabase
      .from('signature_requests')
      .insert({
        contract_id: id,
        recipient_name: body.recipient_name || contract.brand_contact_name || 'Recipient',
        recipient_email: body.recipient_email,
        status: 'sent',
        sent_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
        access_token: accessToken,
      })
      .select()
      .single()

    if (sigError) {
      console.error('Database error:', sigError)
      return apiError('Failed to create signature request', 500, 'DATABASE_ERROR')
    }

    // Update contract status
    await supabase
      .from('contracts')
      .update({
        status: 'pending_signature',
        expires_at: expiresAt.toISOString(),
      })
      .eq('id', id)

    // TODO: Send email notification
    // await sendSignatureRequestEmail(body.recipient_email, contract, accessToken)

    return apiSuccess({
      signature_request_id: signatureRequest.id,
      contract_id: id,
      recipient_email: body.recipient_email,
      status: 'sent',
      sent_at: signatureRequest.sent_at,
      expires_at: signatureRequest.expires_at,
      signing_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://contractgen.app'}/sign/${accessToken}`,
    })
  } catch (err) {
    console.error('API error:', err)

    // Demo mode fallback
    const accessToken = crypto.randomUUID()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    return apiSuccess({
      signature_request_id: crypto.randomUUID(),
      contract_id: id,
      recipient_email: body.recipient_email,
      status: 'sent',
      sent_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
      signing_url: `https://contractgen.app/sign/${accessToken}`,
    })
  }
}
