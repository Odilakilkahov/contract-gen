interface DocuSignConfig {
  integrationKey: string
  secretKey: string
  accountId: string
  oauthBasePath: string
  apiBasePath: string
}

interface TokenResponse {
  access_token: string
  refresh_token?: string
  token_type: string
  expires_in: number
  error?: string
  error_description?: string
}

interface EnvelopeResponse {
  envelopeId?: string
  uri?: string
  statusDateTime?: string
  status?: string
  errorCode?: string
  message?: string
}

interface SignerTab {
  documentId: string
  pageNumber: string
  xPosition: string
  yPosition: string
}

interface Signer {
  email: string
  name: string
  recipientId: string
  routingOrder: string
  tabs?: {
    signHereTabs?: SignerTab[]
    dateSignedTabs?: SignerTab[]
    textTabs?: Array<SignerTab & { tabLabel: string; value?: string }>
  }
}

interface EnvelopeDefinition {
  emailSubject: string
  emailBlurb?: string
  documents: Array<{
    documentBase64: string
    name: string
    fileExtension: string
    documentId: string
  }>
  recipients: {
    signers: Signer[]
  }
  status: 'created' | 'sent'
}

export class DocuSignService {
  private config: DocuSignConfig

  constructor() {
    this.config = {
      integrationKey: process.env.DOCUSIGN_INTEGRATION_KEY || '',
      secretKey: process.env.DOCUSIGN_SECRET_KEY || '',
      accountId: process.env.DOCUSIGN_ACCOUNT_ID || '',
      // Use demo endpoints by default, switch to production when ready
      oauthBasePath: process.env.DOCUSIGN_OAUTH_BASE_PATH || 'https://account-d.docusign.com',
      apiBasePath: process.env.DOCUSIGN_API_BASE_PATH || 'https://demo.docusign.net/restapi',
    }
  }

  /**
   * Check if DocuSign is properly configured
   */
  isConfigured(): boolean {
    return !!(
      this.config.integrationKey &&
      this.config.secretKey &&
      this.config.accountId
    )
  }

  /**
   * Generate OAuth authorization URL
   */
  getAuthUrl(redirectUri: string, state?: string): string {
    const scopes = encodeURIComponent('signature impersonation')
    const params = new URLSearchParams({
      response_type: 'code',
      scope: scopes,
      client_id: this.config.integrationKey,
      redirect_uri: redirectUri,
    })

    if (state) {
      params.append('state', state)
    }

    return `${this.config.oauthBasePath}/oauth/auth?${params.toString()}`
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string, redirectUri: string): Promise<TokenResponse> {
    const credentials = Buffer.from(
      `${this.config.integrationKey}:${this.config.secretKey}`
    ).toString('base64')

    const response = await fetch(`${this.config.oauthBasePath}/oauth/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }).toString(),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error_description || data.error || 'Failed to exchange code for token')
    }

    return data
  }

  /**
   * Refresh an access token
   */
  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const credentials = Buffer.from(
      `${this.config.integrationKey}:${this.config.secretKey}`
    ).toString('base64')

    const response = await fetch(`${this.config.oauthBasePath}/oauth/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }).toString(),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error_description || data.error || 'Failed to refresh token')
    }

    return data
  }

  /**
   * Get user info from access token
   */
  async getUserInfo(accessToken: string): Promise<{
    sub: string
    name: string
    email: string
    accounts: Array<{
      account_id: string
      is_default: boolean
      account_name: string
      base_uri: string
    }>
  }> {
    const response = await fetch(`${this.config.oauthBasePath}/oauth/userinfo`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to get user info')
    }

    return response.json()
  }

  /**
   * Send an envelope for signature
   */
  async sendEnvelope(
    accessToken: string,
    envelope: {
      emailSubject: string
      emailBlurb?: string
      documentBase64: string
      documentName: string
      signerEmail: string
      signerName: string
      signaturePosition?: {
        pageNumber?: string
        xPosition?: string
        yPosition?: string
      }
    }
  ): Promise<EnvelopeResponse> {
    const signaturePos = envelope.signaturePosition || {}

    const envelopeDefinition: EnvelopeDefinition = {
      emailSubject: envelope.emailSubject,
      emailBlurb: envelope.emailBlurb || 'Please sign this contract.',
      documents: [
        {
          documentBase64: envelope.documentBase64,
          name: envelope.documentName,
          fileExtension: 'pdf',
          documentId: '1',
        },
      ],
      recipients: {
        signers: [
          {
            email: envelope.signerEmail,
            name: envelope.signerName,
            recipientId: '1',
            routingOrder: '1',
            tabs: {
              signHereTabs: [
                {
                  documentId: '1',
                  pageNumber: signaturePos.pageNumber || '1',
                  xPosition: signaturePos.xPosition || '100',
                  yPosition: signaturePos.yPosition || '700',
                },
              ],
              dateSignedTabs: [
                {
                  documentId: '1',
                  pageNumber: signaturePos.pageNumber || '1',
                  xPosition: String(parseInt(signaturePos.xPosition || '100') + 150),
                  yPosition: signaturePos.yPosition || '700',
                },
              ],
            },
          },
        ],
      },
      status: 'sent',
    }

    const response = await fetch(
      `${this.config.apiBasePath}/v2.1/accounts/${this.config.accountId}/envelopes`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(envelopeDefinition),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || data.errorCode || 'Failed to send envelope')
    }

    return data
  }

  /**
   * Send envelope with multiple signers
   */
  async sendEnvelopeMultipleSigners(
    accessToken: string,
    envelope: {
      emailSubject: string
      emailBlurb?: string
      documentBase64: string
      documentName: string
      signers: Array<{
        email: string
        name: string
        routingOrder: number
        signaturePosition?: {
          pageNumber?: string
          xPosition?: string
          yPosition?: string
        }
      }>
    }
  ): Promise<EnvelopeResponse> {
    const signers: Signer[] = envelope.signers.map((signer, index) => {
      const pos = signer.signaturePosition || {}
      const baseY = parseInt(pos.yPosition || '700') - index * 100

      return {
        email: signer.email,
        name: signer.name,
        recipientId: String(index + 1),
        routingOrder: String(signer.routingOrder),
        tabs: {
          signHereTabs: [
            {
              documentId: '1',
              pageNumber: pos.pageNumber || '1',
              xPosition: pos.xPosition || '100',
              yPosition: String(baseY),
            },
          ],
        },
      }
    })

    const envelopeDefinition: EnvelopeDefinition = {
      emailSubject: envelope.emailSubject,
      emailBlurb: envelope.emailBlurb,
      documents: [
        {
          documentBase64: envelope.documentBase64,
          name: envelope.documentName,
          fileExtension: 'pdf',
          documentId: '1',
        },
      ],
      recipients: {
        signers,
      },
      status: 'sent',
    }

    const response = await fetch(
      `${this.config.apiBasePath}/v2.1/accounts/${this.config.accountId}/envelopes`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(envelopeDefinition),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || data.errorCode || 'Failed to send envelope')
    }

    return data
  }

  /**
   * Get envelope status
   */
  async getEnvelopeStatus(
    accessToken: string,
    envelopeId: string
  ): Promise<{
    envelopeId: string
    status: string
    statusChangedDateTime: string
    sentDateTime?: string
    completedDateTime?: string
  }> {
    const response = await fetch(
      `${this.config.apiBasePath}/v2.1/accounts/${this.config.accountId}/envelopes/${envelopeId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to get envelope status')
    }

    return response.json()
  }

  /**
   * Download signed document
   */
  async downloadDocument(
    accessToken: string,
    envelopeId: string,
    documentId: string = '1'
  ): Promise<Buffer> {
    const response = await fetch(
      `${this.config.apiBasePath}/v2.1/accounts/${this.config.accountId}/envelopes/${envelopeId}/documents/${documentId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to download document')
    }

    const arrayBuffer = await response.arrayBuffer()
    return Buffer.from(arrayBuffer)
  }

  /**
   * Void an envelope
   */
  async voidEnvelope(
    accessToken: string,
    envelopeId: string,
    voidedReason: string
  ): Promise<void> {
    const response = await fetch(
      `${this.config.apiBasePath}/v2.1/accounts/${this.config.accountId}/envelopes/${envelopeId}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'voided',
          voidedReason,
        }),
      }
    )

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || 'Failed to void envelope')
    }
  }
}

export const docusign = new DocuSignService()
