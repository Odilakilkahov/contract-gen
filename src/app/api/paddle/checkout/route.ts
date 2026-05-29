import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import {
  createCheckoutSession,
  getOrCreateCustomer,
  isPaddleConfigured,
  PLANS,
  PlanType,
} from "@/lib/paddle"

export async function POST(request: NextRequest) {
  try {
    const { plan } = await request.json()

    // Validate plan
    if (!plan || !["creator", "agency"].includes(plan)) {
      return NextResponse.json(
        { success: false, error: "Invalid plan" },
        { status: 400 }
      )
    }

    const selectedPlan = PLANS[plan as PlanType]
    if (!selectedPlan.priceId) {
      return NextResponse.json(
        { success: false, error: "Plan price not configured" },
        { status: 400 }
      )
    }

    // Check if Paddle is configured
    if (!isPaddleConfigured()) {
      return NextResponse.json({
        success: true,
        demo: true,
        message: "Demo mode - Paddle not configured. Add PADDLE_API_KEY to enable payments.",
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
        { success: false, error: "Please log in to upgrade" },
        { status: 401 }
      )
    }

    // Get user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, paddle_customer_id")
      .eq("id", user.id)
      .single()

    // Get or create Paddle customer
    const customer = await getOrCreateCustomer(
      user.email!,
      profile?.full_name || undefined,
      profile?.paddle_customer_id
    )

    // Update profile with Paddle customer ID if new
    if (!profile?.paddle_customer_id && customer?.id) {
      await supabase
        .from("profiles")
        .update({ paddle_customer_id: customer.id })
        .eq("id", user.id)
    }

    // Create checkout session data for Paddle.js
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const session = await createCheckoutSession({
      priceId: selectedPlan.priceId,
      customerEmail: user.email!,
      customerId: customer?.id,
      successUrl: `${appUrl}/dashboard?upgraded=${plan}`,
      customData: {
        user_id: user.id,
        plan: plan,
      },
    })

    return NextResponse.json({
      success: true,
      priceId: session.priceId,
      customerEmail: session.customerEmail,
      customerId: session.customerId,
      successUrl: session.successUrl,
      customData: session.customData,
    })
  } catch (error) {
    console.error("Paddle checkout error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
