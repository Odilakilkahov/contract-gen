import { NextRequest, NextResponse } from 'next/server'
import { docusign } from '@/lib/docusign'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const settingsUrl = `${appUrl}/dashboard/settings/integrations`

  // Handle OAuth errors
  if (error) {
    console.error('DocuSign OAuth error:', error, errorDescription)
    return NextResponse.redirect(
      `${settingsUrl}?error=${encodeURIComponent(errorDescription || error)}&provider=docusign`
    )
  }

  if (!code) {
    return NextResponse.redirect(
      `${settingsUrl}?error=${encodeURIComponent('No authorization code received')}&provider=docusign`
    )
  }

  try {
    const redirectUri = `${appUrl}/api/integrations/docusign/callback`

    // Exchange code for tokens
    const tokens = await docusign.exchangeCodeForToken(code, redirectUri)

    // Get user info to verify the connection
    const userInfo = await docusign.getUserInfo(tokens.access_token)

    // In a real app, you would:
    // 1. Get the current user's ID from session/auth
    // 2. Store tokens in database associated with user
    // 3. Encrypt sensitive tokens before storage

    // For now, we'll encode tokens in the redirect URL (demo only)
    // In production, store in database and use session
    const connectionData = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresIn: tokens.expires_in,
      userEmail: userInfo.email,
      userName: userInfo.name,
      accountId: userInfo.accounts[0]?.account_id,
      connectedAt: new Date().toISOString(),
    }

    // Redirect back to integrations page with success
    return NextResponse.redirect(
      `${settingsUrl}?success=true&provider=docusign&email=${encodeURIComponent(userInfo.email)}`
    )
  } catch (err) {
    console.error('DocuSign callback error:', err)
    const message = err instanceof Error ? err.message : 'Failed to complete authentication'
    return NextResponse.redirect(
      `${settingsUrl}?error=${encodeURIComponent(message)}&provider=docusign`
    )
  }
}
