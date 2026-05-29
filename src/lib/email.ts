// Email service using Resend
// npm install resend

const RESEND_API_KEY = process.env.RESEND_API_KEY

interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  from?: string
  replyTo?: string
}

export async function sendEmail(options: EmailOptions) {
  if (!RESEND_API_KEY) {
    console.log('[Email] Resend not configured, logging email:', options.subject)
    return { success: true, demo: true }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: options.from || 'ContractGen <noreply@contractgen.io>',
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        reply_to: options.replyTo,
      }),
    })

    const data = await response.json()
    return { success: response.ok, data }
  } catch (error) {
    console.error('[Email] Error sending email:', error)
    return { success: false, error }
  }
}

// Email templates
export const emailTemplates = {
  signatureRequest: (params: {
    recipientName: string
    senderName: string
    contractTitle: string
    signUrl: string
    expiresAt: string
    message?: string
  }) => ({
    subject: `${params.senderName} has sent you a contract to sign`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .header { text-align: center; margin-bottom: 40px; }
          .logo { width: 48px; height: 48px; background: linear-gradient(135deg, #8b5cf6, #d946ef); border-radius: 12px; margin: 0 auto 16px; }
          .card { background: #f9fafb; border-radius: 16px; padding: 32px; margin-bottom: 24px; }
          .button { display: inline-block; background: linear-gradient(135deg, #8b5cf6, #d946ef); color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; }
          .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 40px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo"></div>
            <h1 style="margin: 0; font-size: 24px;">ContractGen</h1>
          </div>

          <p>Hi ${params.recipientName},</p>

          <p><strong>${params.senderName}</strong> has sent you a contract to review and sign:</p>

          <div class="card">
            <h2 style="margin: 0 0 8px; font-size: 20px;">${params.contractTitle}</h2>
            <p style="margin: 0; color: #6b7280;">Please review and sign by ${params.expiresAt}</p>
          </div>

          ${params.message ? `<p style="background: #fef3c7; padding: 16px; border-radius: 8px;"><strong>Message from ${params.senderName}:</strong><br>${params.message}</p>` : ''}

          <p style="text-align: center; margin: 32px 0;">
            <a href="${params.signUrl}" class="button">Review & Sign Contract</a>
          </p>

          <p style="color: #6b7280; font-size: 14px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${params.signUrl}">${params.signUrl}</a>
          </p>

          <div class="footer">
            <p>This email was sent by ContractGen on behalf of ${params.senderName}.</p>
            <p>© 2026 ContractGen. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  signatureReminder: (params: {
    recipientName: string
    contractTitle: string
    signUrl: string
    daysLeft: number
  }) => ({
    subject: `Reminder: "${params.contractTitle}" is waiting for your signature`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .alert { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 8px; margin-bottom: 24px; }
          .button { display: inline-block; background: linear-gradient(135deg, #8b5cf6, #d946ef); color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Signature Reminder</h1>

          <div class="alert">
            <strong>⏰ ${params.daysLeft} days left</strong> to sign this contract
          </div>

          <p>Hi ${params.recipientName},</p>

          <p>This is a friendly reminder that "<strong>${params.contractTitle}</strong>" is still waiting for your signature.</p>

          <p style="text-align: center; margin: 32px 0;">
            <a href="${params.signUrl}" class="button">Sign Now</a>
          </p>
        </div>
      </body>
      </html>
    `,
  }),

  contractSigned: (params: {
    ownerName: string
    signerName: string
    contractTitle: string
    viewUrl: string
    signedAt: string
  }) => ({
    subject: `✅ "${params.contractTitle}" has been signed!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .success { background: #d1fae5; border-left: 4px solid #10b981; padding: 16px; border-radius: 8px; margin-bottom: 24px; }
          .button { display: inline-block; background: #10b981; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="success">
            <strong>✅ Contract Signed Successfully!</strong>
          </div>

          <p>Hi ${params.ownerName},</p>

          <p>Great news! <strong>${params.signerName}</strong> has signed "<strong>${params.contractTitle}</strong>".</p>

          <p>Signed on: ${params.signedAt}</p>

          <p style="text-align: center; margin: 32px 0;">
            <a href="${params.viewUrl}" class="button">View Signed Contract</a>
          </p>
        </div>
      </body>
      </html>
    `,
  }),

  invoiceSent: (params: {
    recipientName: string
    senderName: string
    invoiceNumber: string
    amount: string
    dueDate: string
    viewUrl: string
  }) => ({
    subject: `Invoice ${params.invoiceNumber} from ${params.senderName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .card { background: #f9fafb; border-radius: 16px; padding: 32px; text-align: center; }
          .amount { font-size: 48px; font-weight: bold; color: #8b5cf6; }
          .button { display: inline-block; background: linear-gradient(135deg, #8b5cf6, #d946ef); color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <p>Hi ${params.recipientName},</p>

          <p>You have received an invoice from <strong>${params.senderName}</strong>.</p>

          <div class="card">
            <p style="margin: 0; color: #6b7280;">Invoice ${params.invoiceNumber}</p>
            <p class="amount">${params.amount}</p>
            <p style="margin: 0; color: #6b7280;">Due by ${params.dueDate}</p>
          </div>

          <p style="text-align: center; margin: 32px 0;">
            <a href="${params.viewUrl}" class="button">View Invoice</a>
          </p>
        </div>
      </body>
      </html>
    `,
  }),

  invoiceOverdue: (params: {
    recipientName: string
    invoiceNumber: string
    amount: string
    daysOverdue: number
    viewUrl: string
  }) => ({
    subject: `⚠️ Invoice ${params.invoiceNumber} is overdue`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .alert { background: #fee2e2; border-left: 4px solid #ef4444; padding: 16px; border-radius: 8px; }
          .button { display: inline-block; background: #ef4444; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="alert">
            <strong>⚠️ Payment Overdue</strong><br>
            Invoice ${params.invoiceNumber} is ${params.daysOverdue} days overdue
          </div>

          <p>Hi ${params.recipientName},</p>

          <p>This is a reminder that your payment of <strong>${params.amount}</strong> is now overdue.</p>

          <p style="text-align: center; margin: 32px 0;">
            <a href="${params.viewUrl}" class="button">Pay Now</a>
          </p>
        </div>
      </body>
      </html>
    `,
  }),

  proposalSent: (params: {
    recipientName: string
    senderName: string
    proposalTitle: string
    viewUrl: string
    expiresAt: string
  }) => ({
    subject: `Proposal: ${params.proposalTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .card { background: linear-gradient(135deg, #8b5cf620, #d946ef20); border-radius: 16px; padding: 32px; text-align: center; }
          .button { display: inline-block; background: linear-gradient(135deg, #8b5cf6, #d946ef); color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <p>Hi ${params.recipientName},</p>

          <p><strong>${params.senderName}</strong> has sent you a proposal for your review.</p>

          <div class="card">
            <h2 style="margin: 0 0 8px;">${params.proposalTitle}</h2>
            <p style="margin: 0; color: #6b7280;">Valid until ${params.expiresAt}</p>
          </div>

          <p style="text-align: center; margin: 32px 0;">
            <a href="${params.viewUrl}" class="button">View Proposal</a>
          </p>
        </div>
      </body>
      </html>
    `,
  }),

  welcomeEmail: (params: {
    userName: string
  }) => ({
    subject: `Welcome to ContractGen! 🎉`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .header { text-align: center; margin-bottom: 40px; }
          .feature { display: flex; align-items: flex-start; gap: 16px; margin-bottom: 24px; }
          .feature-icon { width: 40px; height: 40px; background: #f3f4f6; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
          .button { display: inline-block; background: linear-gradient(135deg, #8b5cf6, #d946ef); color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to ContractGen! 🎉</h1>
          </div>

          <p>Hi ${params.userName},</p>

          <p>Thanks for signing up! You're now ready to create professional influencer contracts in minutes.</p>

          <h3>Here's what you can do:</h3>

          <div class="feature">
            <div class="feature-icon">📄</div>
            <div>
              <strong>Create AI-Powered Contracts</strong>
              <p style="margin: 4px 0 0; color: #6b7280;">Answer a few questions, get a professional contract instantly.</p>
            </div>
          </div>

          <div class="feature">
            <div class="feature-icon">✍️</div>
            <div>
              <strong>Get E-Signatures</strong>
              <p style="margin: 4px 0 0; color: #6b7280;">Send contracts for legally binding signatures.</p>
            </div>
          </div>

          <div class="feature">
            <div class="feature-icon">💰</div>
            <div>
              <strong>Track Payments</strong>
              <p style="margin: 4px 0 0; color: #6b7280;">Create invoices and track when you get paid.</p>
            </div>
          </div>

          <p style="text-align: center; margin: 32px 0;">
            <a href="https://contractgen.io/dashboard" class="button">Go to Dashboard</a>
          </p>

          <p>If you have any questions, just reply to this email!</p>

          <p>Best,<br>The ContractGen Team</p>
        </div>
      </body>
      </html>
    `,
  }),
}
