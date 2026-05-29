import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { getCustomerPortalUrl, isPaddleConfigured } from "@/lib/paddle"

/**
 * POST /api/paddle/portal
 * Creates a Paddle Customer Portal session for managing subscriptions
 */
export async function POST(request: NextRequest) {
  try {
    // Check if Paddle is configured
    if (!isPaddleConfigured()) {
      return NextResponse.json({
        success: true,
        url: "/dashboard/settings?billing=demo",
        message: "Demo mode - Paddle not configured",
      })
    }

    // Get authenticated user
    const supabase = await createServerSupabaseClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get user profile with Paddle customer ID
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("paddle_customer_id")
      .eq("id", user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { success: false, error: "Profile not found" },
        { status: 404 }
      )
    }

    if (!profile.paddle_customer_id) {
      return NextResponse.json(
        {
          success: false,
          error: "No subscription found. Please upgrade first.",
        },
        { status: 400 }
      )
    }

    // Get return URL from request or default
    const { returnUrl } = await request.json().catch(() => ({}))
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const finalReturnUrl = returnUrl || `${appUrl}/dashboard/settings`

    // Create portal session
    const portalUrl = await getCustomerPortalUrl(profile.paddle_customer_id)

    if (!portalUrl) {
      // Fallback: Paddle's default customer portal
      // Customers can access via https://customer-portal.paddle.com
      return NextResponse.json({
        success: true,
        url: `https://customer-portal.paddle.com?customer_id=${profile.paddle_customer_id}&return_url=${encodeURIComponent(finalReturnUrl)}`,
      })
    }

    return NextResponse.json({
      success: true,
      url: portalUrl,
    })
  } catch (error) {
    console.error("Paddle billing portal error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create billing portal session" },
      { status: 500 }
    )
  }
}
