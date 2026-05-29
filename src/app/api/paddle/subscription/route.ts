import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import {
  getCustomerSubscriptions,
  isPaddleConfigured,
  PLANS,
  PlanType,
} from "@/lib/paddle"

/**
 * GET /api/paddle/subscription
 * Get current user's subscription details
 */
export async function GET() {
  try {
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

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("plan, plan_expires_at, paddle_customer_id, paddle_subscription_id, subscription_status")
      .eq("id", user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { success: false, error: "Profile not found" },
        { status: 404 }
      )
    }

    const currentPlan = (profile.plan as PlanType) || "free"
    const planDetails = PLANS[currentPlan]

    // Base response with profile data
    const response = {
      success: true,
      plan: currentPlan,
      planName: planDetails.name,
      features: planDetails.features,
      limits: planDetails.limits,
      expiresAt: profile.plan_expires_at,
      paddleConfigured: isPaddleConfigured(),
      subscription: null as {
        id: string
        status: string
        currentPeriodEnd: string
        cancelAtPeriodEnd: boolean
      } | null,
    }

    // If user has Paddle customer ID, get subscription details
    if (profile.paddle_customer_id && isPaddleConfigured()) {
      try {
        const subscriptions = await getCustomerSubscriptions(
          profile.paddle_customer_id
        )

        const activeSubscription = subscriptions.data?.[0]

        if (activeSubscription) {
          response.subscription = {
            id: activeSubscription.id,
            status: activeSubscription.status,
            currentPeriodEnd: profile.plan_expires_at || new Date().toISOString(),
            cancelAtPeriodEnd: profile.subscription_status === 'canceled',
          }
        }
      } catch (error) {
        console.error("Error fetching Paddle subscription:", error)
        // Continue without subscription details
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Subscription status error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to get subscription status" },
      { status: 500 }
    )
  }
}
