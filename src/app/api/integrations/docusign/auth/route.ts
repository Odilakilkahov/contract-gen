import { NextResponse } from 'next/server'
import { docusign } from '@/lib/docusign'

export async function GET() {
  try {
    if (!docusign.isConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: 'DocuSign is not configured. Please add DOCUSIGN_INTEGRATION_KEY, DOCUSIGN_SECRET_KEY, and DOCUSIGN_ACCOUNT_ID to your environment variables.',
        },
        { status: 400 }
      )
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const redirectUri = `${appUrl}/api/integrations/docusign/callback`

    // Generate a state token for CSRF protection
    const state = Buffer.from(
      JSON.stringify({
        timestamp: Date.now(),
        random: Math.random().toString(36).substring(7),
      })
    ).toString('base64')

    const authUrl = docusign.getAuthUrl(redirectUri, state)

    return NextResponse.json({
      success: true,
      url: authUrl,
      state,
    })
  } catch (error) {
    console.error('DocuSign auth error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate auth URL',
      },
      { status: 500 }
    )
  }
}
