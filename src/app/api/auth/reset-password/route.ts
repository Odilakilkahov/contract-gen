import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
    }

    // In production, this would:
    // 1. Check if user exists in database
    // 2. Generate a secure reset token
    // 3. Store token with expiration in database
    // 4. Send email via Resend/SendGrid with reset link

    // For demo, we simulate the process
    console.log(`Password reset requested for: ${email}`)

    // Always return success for security (don't reveal if email exists)
    return NextResponse.json({
      success: true,
      message: "If an account exists with this email, a reset link has been sent."
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 })
  }
}
