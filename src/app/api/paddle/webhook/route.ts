import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { createClient } from "@supabase/supabase-js"
import { getPlanFromPriceId } from "@/lib/paddle"

const PADDLE_WEBHOOK_SECRET = process.env.PADDLE_WEBHOOK_SECRET

// Lazy initialization of Supabase admin client
let _supabaseAdmin: ReturnType<typeof createClient> | null = null

function getSupabaseAdmin() {
  if (!_supabaseAdmin) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase configuration is missing")
    }

    _supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    })
  }
  return _supabaseAdmin
}

/**
 * Verify Paddle webhook signature
 * Paddle uses HMAC-SHA256 signature in the Paddle-Signature header
 */
function verifySignature(payload: string, signatureHeader: string): boolean {
  if (!PADDLE_WEBHOOK_SECRET) {
    console.warn("PADDLE_WEBHOOK_SECRET not set, skipping signature verification")
    return true // Demo mode
  }

  try {
    // Paddle signature format: ts=timestamp;h1=signature
    const parts = signatureHeader.split(';')
    const timestampPart = parts.find(p => p.startsWith('ts='))
    const signaturePart = parts.find(p => p.startsWith('h1='))

    if (!timestampPart || !signaturePart) {
      console.error("Invalid signature header format")
      return false
    }

    const timestamp = timestampPart.replace('ts=', '')
    const signature = signaturePart.replace('h1=', '')

    // Build signed payload: timestamp:payload
    const signedPayload = `${timestamp}:${payload}`

    // Compute HMAC
    const hmac = crypto.createHmac('sha256', PADDLE_WEBHOOK_SECRET)
    hmac.update(signedPayload)
    const expectedSignature = hmac.digest('hex')

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  } catch (error) {
    console.error("Signature verification error:", error)
    return false
  }
}

// Paddle webhook event types
interface PaddleEvent {
  event_id: string
  event_type: string
  occurred_at: string
  notification_id: string
  data: {
    id: string
    status?: string
    customer_id?: string
    items?: Array<{
      price: {
        id: string
        product_id: string
      }
    }>
    billing_period?: {
      ends_at: string
    }
    current_billing_period?: {
      ends_at: string
    }
    custom_data?: {
      user_id?: string
      plan?: string
    }
    customer?: {
      id: string
      email: string
    }
    totals?: {
      total: string
      currency_code: string
    }
  }
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('paddle-signature') || ''

  if (!verifySignature(body, signature)) {
    console.error("Invalid Paddle webhook signature")
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  let event: PaddleEvent

  try {
    event = JSON.parse(body)
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  console.log(`Received Paddle webhook: ${event.event_type}`)

  try {
    switch (event.event_type) {
      case 'subscription.created':
      case 'subscription.activated':
        await handleSubscriptionCreated(event)
        break

      case 'subscription.updated':
        await handleSubscriptionUpdated(event)
        break

      case 'subscription.canceled':
        await handleSubscriptionCanceled(event)
        break

      case 'subscription.paused':
        await handleSubscriptionPaused(event)
        break

      case 'subscription.resumed':
        await handleSubscriptionResumed(event)
        break

      case 'transaction.completed':
        await handleTransactionCompleted(event)
        break

      case 'transaction.payment_failed':
        await handlePaymentFailed(event)
        break

      case 'customer.created':
        await handleCustomerCreated(event)
        break

      default:
        console.log(`Unhandled Paddle event type: ${event.event_type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error(`Error processing Paddle webhook ${event.event_type}:`, error)
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    )
  }
}

/**
 * Handle subscription created/activated
 */
async function handleSubscriptionCreated(event: PaddleEvent) {
  const { data } = event
  const customerId = data.customer_id
  const priceId = data.items?.[0]?.price?.id
  const plan = priceId ? getPlanFromPriceId(priceId) : 'creator'
  const billingPeriodEnd = data.current_billing_period?.ends_at || data.billing_period?.ends_at

  console.log(`Subscription created: customer=${customerId}, plan=${plan}`)

  if (!customerId) {
    console.error("No customer_id in subscription event")
    return
  }

  // Find user by Paddle customer ID
  const result = await getSupabaseAdmin()
    .from("profiles")
    .select("id, email, plan")
    .eq("paddle_customer_id", customerId)
    .single()

  type ProfileData = { id: string; email: string; plan: string }
  let profile = result.data as ProfileData | null

  if (result.error || !profile) {
    // Try to find by custom_data user_id
    if (data.custom_data?.user_id) {
      const fallbackResult = await getSupabaseAdmin()
        .from("profiles")
        .select("id, email, plan")
        .eq("id", data.custom_data.user_id)
        .single()

      profile = fallbackResult.data as ProfileData | null
      if (profile) {
        await updateUserPlan(profile.id, plan, billingPeriodEnd, data.id, customerId)
        return
      }
    }
    console.error("User not found for Paddle customer:", customerId)
    return
  }

  await updateUserPlan(profile.id, plan, billingPeriodEnd, data.id, customerId)

  // Create notification
  await createNotification(
    profile.id,
    "subscription_activated",
    "Subscription Activated",
    `Your ${plan.charAt(0).toUpperCase() + plan.slice(1)} plan is now active!`,
    "/dashboard"
  )
}

/**
 * Handle subscription updated (plan change, etc.)
 */
async function handleSubscriptionUpdated(event: PaddleEvent) {
  const { data } = event
  const customerId = data.customer_id
  const status = data.status
  const priceId = data.items?.[0]?.price?.id
  const plan = priceId ? getPlanFromPriceId(priceId) : undefined
  const billingPeriodEnd = data.current_billing_period?.ends_at || data.billing_period?.ends_at

  console.log(`Subscription updated: customer=${customerId}, status=${status}, plan=${plan}`)

  if (!customerId) {
    console.error("No customer_id in subscription update event")
    return
  }

  const result = await getSupabaseAdmin()
    .from("profiles")
    .select("id, plan")
    .eq("paddle_customer_id", customerId)
    .single()

  const profile = result.data as { id: string; plan: string } | null

  if (result.error || !profile) {
    console.error("User not found for Paddle customer:", customerId)
    return
  }

  // Update based on status
  if (status === 'active' || status === 'trialing') {
    await updateUserPlan(profile.id, plan || 'creator', billingPeriodEnd, data.id)

    if (plan && profile.plan !== plan) {
      await createNotification(
        profile.id,
        "plan_upgraded",
        "Plan Changed",
        `Your plan has been updated to ${plan.charAt(0).toUpperCase() + plan.slice(1)}!`,
        "/dashboard"
      )
    }
  } else if (status === 'past_due') {
    // Keep plan but update status
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (getSupabaseAdmin() as any)
      .from("profiles")
      .update({
        subscription_status: 'past_due',
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id)

    await createNotification(
      profile.id,
      "payment_past_due",
      "Payment Past Due",
      "Your payment is past due. Please update your payment method.",
      "/dashboard/settings"
    )
  }
}

/**
 * Handle subscription canceled
 */
async function handleSubscriptionCanceled(event: PaddleEvent) {
  const { data } = event
  const customerId = data.customer_id
  const billingPeriodEnd = data.current_billing_period?.ends_at || data.billing_period?.ends_at

  console.log(`Subscription canceled: customer=${customerId}`)

  if (!customerId) {
    console.error("No customer_id in subscription canceled event")
    return
  }

  const result = await getSupabaseAdmin()
    .from("profiles")
    .select("id")
    .eq("paddle_customer_id", customerId)
    .single()

  const profile = result.data as { id: string } | null

  if (result.error || !profile) {
    console.error("User not found for Paddle customer:", customerId)
    return
  }

  // Keep access until billing period ends, then downgrade
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (getSupabaseAdmin() as any)
    .from("profiles")
    .update({
      subscription_status: 'canceled',
      plan_expires_at: billingPeriodEnd,
      updated_at: new Date().toISOString(),
    })
    .eq("id", profile.id)

  await createNotification(
    profile.id,
    "subscription_canceled",
    "Subscription Canceled",
    billingPeriodEnd
      ? `Your subscription has been canceled. You'll have access until ${new Date(billingPeriodEnd).toLocaleDateString()}.`
      : "Your subscription has been canceled.",
    "/dashboard/pricing"
  )
}

/**
 * Handle subscription paused
 */
async function handleSubscriptionPaused(event: PaddleEvent) {
  const { data } = event
  const customerId = data.customer_id

  console.log(`Subscription paused: customer=${customerId}`)

  if (!customerId) return

  const pausedResult = await getSupabaseAdmin()
    .from("profiles")
    .select("id")
    .eq("paddle_customer_id", customerId)
    .single()

  const pausedProfile = pausedResult.data as { id: string } | null
  if (!pausedProfile) return

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (getSupabaseAdmin() as any)
    .from("profiles")
    .update({
      subscription_status: 'paused',
      updated_at: new Date().toISOString(),
    })
    .eq("id", pausedProfile.id)
}

/**
 * Handle subscription resumed
 */
async function handleSubscriptionResumed(event: PaddleEvent) {
  const { data } = event
  const customerId = data.customer_id
  const priceId = data.items?.[0]?.price?.id
  const plan = priceId ? getPlanFromPriceId(priceId) : 'creator'
  const billingPeriodEnd = data.current_billing_period?.ends_at

  console.log(`Subscription resumed: customer=${customerId}`)

  if (!customerId) return

  const resumedResult = await getSupabaseAdmin()
    .from("profiles")
    .select("id")
    .eq("paddle_customer_id", customerId)
    .single()

  const resumedProfile = resumedResult.data as { id: string } | null
  if (!resumedProfile) return

  await updateUserPlan(resumedProfile.id, plan, billingPeriodEnd, data.id)

  await createNotification(
    resumedProfile.id,
    "subscription_resumed",
    "Subscription Resumed",
    "Your subscription has been resumed!",
    "/dashboard"
  )
}

/**
 * Handle transaction completed (payment received)
 */
async function handleTransactionCompleted(event: PaddleEvent) {
  const { data } = event
  const customerId = data.customer?.id || data.customer_id
  const amount = data.totals?.total
  const currency = data.totals?.currency_code

  console.log(`Transaction completed: customer=${customerId}, amount=${amount} ${currency}`)

  if (!customerId) return

  const txResult = await getSupabaseAdmin()
    .from("profiles")
    .select("id")
    .eq("paddle_customer_id", customerId)
    .single()

  const txProfile = txResult.data as { id: string } | null
  if (!txProfile) return

  const formattedAmount = amount ? (parseInt(amount) / 100).toFixed(2) : '0.00'

  await createNotification(
    txProfile.id,
    "payment_received",
    "Payment Received",
    `Your payment of $${formattedAmount} ${currency || 'USD'} was successful.`,
    "/dashboard/settings"
  )
}

/**
 * Handle payment failed
 */
async function handlePaymentFailed(event: PaddleEvent) {
  const { data } = event
  const customerId = data.customer?.id || data.customer_id

  console.log(`Payment failed: customer=${customerId}`)

  if (!customerId) return

  const failedResult = await getSupabaseAdmin()
    .from("profiles")
    .select("id")
    .eq("paddle_customer_id", customerId)
    .single()

  const failedProfile = failedResult.data as { id: string } | null
  if (!failedProfile) return

  await createNotification(
    failedProfile.id,
    "payment_failed",
    "Payment Failed",
    "Your payment failed. Please update your payment method to continue your subscription.",
    "/dashboard/settings"
  )
}

/**
 * Handle customer created
 */
async function handleCustomerCreated(event: PaddleEvent) {
  const { data } = event
  const customerId = data.id
  const email = data.customer?.email

  console.log(`Customer created: ${customerId} for ${email}`)

  if (!email) return

  // Try to link to existing user
  const customerResult = await getSupabaseAdmin()
    .from("profiles")
    .select("id, paddle_customer_id")
    .eq("email", email)
    .single()

  const customerProfile = customerResult.data as { id: string; paddle_customer_id: string | null } | null
  if (!customerProfile || customerProfile.paddle_customer_id) return

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (getSupabaseAdmin() as any)
    .from("profiles")
    .update({
      paddle_customer_id: customerId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", customerProfile.id)

  console.log(`Linked Paddle customer ${customerId} to user ${customerProfile.id}`)
}

/**
 * Helper: Update user plan
 */
async function updateUserPlan(
  userId: string,
  plan: string,
  expiresAt?: string,
  subscriptionId?: string,
  customerId?: string
) {
  const updateData: Record<string, unknown> = {
    plan,
    subscription_status: 'active',
    plan_expires_at: expiresAt,
    updated_at: new Date().toISOString(),
  }

  if (subscriptionId) {
    updateData.paddle_subscription_id = subscriptionId
  }

  if (customerId) {
    updateData.paddle_customer_id = customerId
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (getSupabaseAdmin() as any)
    .from("profiles")
    .update(updateData)
    .eq("id", userId)

  if (error) {
    console.error("Failed to update user plan:", error)
  } else {
    console.log(`Updated user ${userId} to plan: ${plan}`)
  }
}

/**
 * Helper: Create notification
 */
async function createNotification(
  userId: string,
  type: string,
  title: string,
  message: string,
  link?: string
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (getSupabaseAdmin() as any).from("notifications").insert({
    user_id: userId,
    type,
    title,
    message,
    link,
    read: false,
  })

  if (error) {
    console.error("Failed to create notification:", error)
  }
}
