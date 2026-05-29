import { NextRequest, NextResponse } from 'next/server'
import { docusign } from '@/lib/docusign'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      accessToken,
      emailSubject,
      emailBlurb,
      documentBase64,
      documentName,
      signerEmail,
      signerName,
      signaturePosition,
    } = body

    // Validate required fields
    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'Missing access token. Please connect DocuSign first.' },
        { status: 401 }
      )
    }

    if (!documentBase64 || !documentName) {
      return NextResponse.json(
        { success: false, error: 'Missing document data' },
        { status: 400 }
      )
    }

    if (!signerEmail || !signerName) {
      return NextResponse.json(
        { success: false, error: 'Missing signer information' },
        { status: 400 }
      )
    }

    // Send the envelope
    const result = await docusign.sendEnvelope(accessToken, {
      emailSubject: emailSubject || `Please sign: ${documentName}`,
      emailBlurb,
      documentBase64,
      documentName,
      signerEmail,
      signerName,
      signaturePosition,
    })

    return NextResponse.json({
      success: true,
      envelopeId: result.envelopeId,
      status: result.status,
      message: `Document sent to ${signerEmail} for signature`,
    })
  } catch (error) {
    console.error('DocuSign send error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send document',
      },
      { status: 500 }
    )
  }
}
