// Paddle Billing API v2
// Merchant of Record - handles taxes, works globally, payouts to Payoneer/bank
// Commission: 5% + $0.50

const PADDLE_API_URL = process.env.PADDLE_ENVIRONMENT === 'sandbox'
  ? 'https://sandbox-api.paddle.com'
  : 'https://api.paddle.com'

const PADDLE_API_KEY = process.env.PADDLE_API_KEY

// Plan configuration
export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    priceId: null,
    features: [
      "3 contracts per month",
      "Basic templates",
      "Email support",
    ],
    limits: {
      contracts_per_month: 3,
      templates: 5,
      team_members: 0,
    },
  },
  creator: {
    name: "Creator",
    priceId: process.env.PADDLE_CREATOR_PRICE_ID || "pri_creator",
    price: 19,
    features: [
      "Unlimited contracts",
      "All templates",
      "E-signatures",
      "AI clause suggestions",
      "Priority support",
    ],
    limits: {
      contracts_per_month: -1, // unlimited
      templates: -1,
      team_members: 0,
    },
  },
  agency: {
    name: "Agency",
    priceId: process.env.PADDLE_AGENCY_PRICE_ID || "pri_agency",
    price: 79,
    features: [
      "Everything in Creator",
      "5 team members",
      "White-label contracts",
      "API access",
      "Dedicated support",
    ],
    limits: {
      contracts_per_month: -1,
      templates: -1,
      team_members: 10,
    },
  },
} as const

export type PlanType = keyof typeof PLANS

export function isPaddleConfigured(): boolean {
  return Boolean(process.env.PADDLE_API_KEY)
}

interface PaddleResponse<T = unknown> {
  data?: T
  error?: {
    type: string
    code: string
    detail: string
  }
  meta?: {
    request_id: string
  }
}

async function paddleRequest<T = unknown>(
  endpoint: string,
  method = 'GET',
  body?: Record<string, unknown>
): Promise<PaddleResponse<T>> {
  if (!PADDLE_API_KEY) {
    throw new Error("PADDLE_API_KEY is not configured")
  }

  const response = await fetch(`${PADDLE_API_URL}${endpoint}`, {
    method,
    headers: {
      'Authorization': `Bearer ${PADDLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  return response.json()
}

/**
 * Get checkout data for Paddle.js client-side checkout
 * Paddle uses client-side checkout with Paddle.js overlay
 */
export async function createCheckoutSession(params: {
  priceId: string
  customerEmail: string
  customerId?: string
  successUrl: string
  customData?: Record<string, string>
}) {
  // For Paddle, checkout is initiated client-side with Paddle.js
  // We just return the data needed to initialize the checkout
  return {
    priceId: params.priceId,
    customerEmail: params.customerEmail,
    customerId: params.customerId,
    successUrl: params.successUrl,
    customData: params.customData,
  }
}

/**
 * Get subscription details
 */
export async function getSubscription(subscriptionId: string) {
  return paddleRequest(`/subscriptions/${subscriptionId}`)
}

/**
 * Get active subscription for a customer
 */
export async function getCustomerSubscriptions(customerId: string) {
  return paddleRequest<{ id: string; status: string; items: unknown[] }[]>(
    `/subscriptions?customer_id=${customerId}&status=active,trialing,past_due`
  )
}

/**
 * Cancel a subscription at end of billing period
 */
export async function cancelSubscription(subscriptionId: string) {
  return paddleRequest(`/subscriptions/${subscriptionId}/cancel`, 'POST', {
    effective_from: 'next_billing_period'
  })
}

/**
 * Create a customer portal session for subscription management
 * Returns URL to Paddle's hosted portal
 */
export async function getCustomerPortalUrl(customerId: string): Promise<string | null> {
  try {
    const result = await paddleRequest<{ urls: { general: string } }>(
      `/customers/${customerId}/portal-sessions`,
      'POST'
    )
    return result.data?.urls?.general || null
  } catch {
    return null
  }
}

/**
 * Get customer by ID
 */
export async function getCustomer(customerId: string) {
  return paddleRequest(`/customers/${customerId}`)
}

/**
 * Create a new customer
 */
export async function createCustomer(email: string, name?: string) {
  return paddleRequest('/customers', 'POST', {
    email,
    name,
  })
}

/**
 * Get customer by email (search)
 */
export async function getCustomerByEmail(email: string) {
  const result = await paddleRequest<{ id: string; email: string }[]>(
    `/customers?email=${encodeURIComponent(email)}`
  )
  return result.data?.[0] || null
}

/**
 * Get or create customer
 */
export async function getOrCreateCustomer(
  email: string,
  name?: string,
  existingCustomerId?: string | null
) {
  // If we have an existing customer ID, verify it exists
  if (existingCustomerId) {
    try {
      const result = await getCustomer(existingCustomerId)
      if (result.data) {
        return result.data as { id: string; email: string }
      }
    } catch {
      // Customer doesn't exist, continue to create
    }
  }

  // Search for existing customer by email
  const existingCustomer = await getCustomerByEmail(email)
  if (existingCustomer) {
    return existingCustomer
  }

  // Create new customer
  const result = await createCustomer(email, name)
  return result.data as { id: string; email: string }
}

/**
 * Get transactions (invoices/payments) for a customer
 */
export async function getCustomerTransactions(customerId: string, limit = 10) {
  return paddleRequest(
    `/transactions?customer_id=${customerId}&per_page=${limit}&order_by=created_at[DESC]`
  )
}

/**
 * Map Paddle price ID to plan type
 */
export function getPlanFromPriceId(priceId: string): PlanType {
  if (priceId === process.env.PADDLE_CREATOR_PRICE_ID) return 'creator'
  if (priceId === process.env.PADDLE_AGENCY_PRICE_ID) return 'agency'
  return 'free'
}
