import { NextRequest, NextResponse } from 'next/server'
import { docusign } from '@/lib/docusign'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const accessToken = searchParams.get('accessToken')
    const envelopeId = searchParams.get('envelopeId')

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'Missing access token' },
        { status: 401 }
      )
    }

    if (!envelopeId) {
      return NextResponse.json(
        { success: false, error: 'Missing envelope ID' },
        { status: 400 }
      )
    }

    const status = await docusign.getEnvelopeStatus(accessToken, envelopeId)

    return NextResponse.json({
      success: true,
      ...status,
    })
  } catch (error) {
    console.error('DocuSign status error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get envelope status',
      },
      { status: 500 }
    )
  }
}
