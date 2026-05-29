const RESEND_API_KEY = process.env.RESEND_API_KEY

interface EmailOptions {
  to: string
  subject: string
  html: string
  from?: string
}

export async function sendEmail({ to, subject, html, from }: EmailOptions) {
  if (!RESEND_API_KEY) {
    console.log('Resend not configured, email would be sent to:', to)
    return { success: true, id: 'demo-mode' }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: from || 'ContractGen <noreply@contractgen.io>',
        to: [to],
        subject,
        html,
      }),
    })

    const data = await response.json()
    return { success: true, id: data.id }
  } catch (error) {
    console.error('Failed to send email:', error)
    return { success: false, error }
  }
}

// Email Templates
export const emailTemplates = {
  signatureRequest: (data: { contractTitle: string; signerName: string; signUrl: string }) => ({
    subject: `Please sign: ${data.contractTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #8b5cf6; }
          .card { background: #f9fafb; border-radius: 12px; padding: 30px; margin: 20px 0; }
          .button { display: inline-block; background: linear-gradient(135deg, #8b5cf6, #d946ef); color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; }
          .footer { text-align: center; margin-top: 40px; color: #9ca3af; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">ContractGen</div>
          </div>

          <h2>You've been invited to sign a contract</h2>

          <p>Hi ${data.signerName},</p>

          <p>You've been sent a contract to review and sign:</p>

          <div class="card">
            <strong>${data.contractTitle}</strong>
          </div>

          <p style="text-align: center; margin: 30px 0;">
            <a href="${data.signUrl}" class="button">Review & Sign Contract</a>
          </p>

          <p style="color: #6b7280; font-size: 14px;">
            This link will expire in 7 days. If you have any questions, please contact the sender directly.
          </p>

          <div class="footer">
            <p>Powered by ContractGen</p>
            <p>Secure e-signatures for creators</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  signatureComplete: (data: { contractTitle: string; signerName: string }) => ({
    subject: `Contract signed: ${data.contractTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #8b5cf6; }
          .success { background: #ecfdf5; border: 1px solid #10b981; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0; }
          .success-icon { font-size: 48px; }
          .button { display: inline-block; background: #8b5cf6; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; }
          .footer { text-align: center; margin-top: 40px; color: #9ca3af; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">ContractGen</div>
          </div>

          <div class="success">
            <div class="success-icon">✅</div>
            <h2 style="color: #059669; margin: 10px 0;">Contract Signed!</h2>
          </div>

          <p><strong>${data.signerName}</strong> has signed the contract:</p>
          <p style="font-size: 18px; font-weight: 600;">${data.contractTitle}</p>

          <p style="text-align: center; margin: 30px 0;">
            <a href="https://contractgen.io/dashboard/contracts" class="button">View Contract</a>
          </p>

          <div class="footer">
            <p>Powered by ContractGen</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  invoiceReminder: (data: { invoiceId: string; amount: string; dueDate: string; brandName: string }) => ({
    subject: `Payment reminder: Invoice ${data.invoiceId}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #8b5cf6; }
          .card { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 12px; padding: 20px; margin: 20px 0; }
          .amount { font-size: 32px; font-weight: bold; color: #8b5cf6; }
          .button { display: inline-block; background: #8b5cf6; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; }
          .footer { text-align: center; margin-top: 40px; color: #9ca3af; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">ContractGen</div>
          </div>

          <h2>Payment Reminder</h2>

          <p>Hi ${data.brandName},</p>

          <p>This is a friendly reminder that payment is due for the following invoice:</p>

          <div class="card">
            <p><strong>Invoice:</strong> ${data.invoiceId}</p>
            <p class="amount">${data.amount}</p>
            <p><strong>Due Date:</strong> ${data.dueDate}</p>
          </div>

          <p style="text-align: center; margin: 30px 0;">
            <a href="https://contractgen.io/pay/${data.invoiceId}" class="button">Pay Now</a>
          </p>

          <div class="footer">
            <p>Powered by ContractGen</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  welcome: (data: { userName: string }) => ({
    subject: 'Welcome to ContractGen!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #8b5cf6; }
          .feature { display: flex; align-items: center; gap: 15px; padding: 15px 0; border-bottom: 1px solid #e5e7eb; }
          .feature-icon { font-size: 24px; }
          .button { display: inline-block; background: linear-gradient(135deg, #8b5cf6, #d946ef); color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; }
          .footer { text-align: center; margin-top: 40px; color: #9ca3af; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">ContractGen</div>
          </div>

          <h2>Welcome to ContractGen, ${data.userName}! 🎉</h2>

          <p>You're all set to create professional influencer contracts in minutes.</p>

          <h3>Here's what you can do:</h3>

          <div class="feature">
            <span class="feature-icon">📄</span>
            <div>
              <strong>Create Contracts</strong>
              <p style="margin: 5px 0 0; color: #6b7280;">Use AI to generate legally-sound contracts</p>
            </div>
          </div>

          <div class="feature">
            <span class="feature-icon">✍️</span>
            <div>
              <strong>E-Signatures</strong>
              <p style="margin: 5px 0 0; color: #6b7280;">Send contracts for signature instantly</p>
            </div>
          </div>

          <div class="feature">
            <span class="feature-icon">💰</span>
            <div>
              <strong>Invoicing</strong>
              <p style="margin: 5px 0 0; color: #6b7280;">Generate invoices and track payments</p>
            </div>
          </div>

          <p style="text-align: center; margin: 30px 0;">
            <a href="https://contractgen.io/dashboard" class="button">Go to Dashboard</a>
          </p>

          <div class="footer">
            <p>Questions? Reply to this email or visit our help center.</p>
            <p>© 2026 ContractGen</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
}
