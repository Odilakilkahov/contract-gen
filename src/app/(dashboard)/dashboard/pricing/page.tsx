"use client"

import { useState, useEffect } from "react"
import Script from "next/script"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"

// Declare Paddle global type
declare global {
  interface Window {
    Paddle?: {
      Environment: {
        set: (env: string) => void
      }
      Initialize: (config: { token: string; eventCallback?: (event: PaddleEvent) => void }) => void
      Checkout: {
        open: (config: {
          items: Array<{ priceId: string; quantity: number }>
          customer?: { email: string; id?: string }
          customData?: Record<string, string>
          settings?: {
            successUrl?: string
            displayMode?: "overlay" | "inline"
            theme?: "light" | "dark"
            locale?: string
          }
        }) => void
      }
    }
  }
}

interface PaddleEvent {
  name: string
  data?: {
    status?: string
    transaction_id?: string
  }
}

const plans = [
  {
    id: "free",
    name: "Starter",
    price: "$0",
    period: "forever",
    desc: "Perfect for trying it out",
    features: [
      "3 contracts/month",
      "Basic templates",
      "Email support",
    ],
    cta: "Current Plan",
    highlighted: false,
    disabled: true,
  },
  {
    id: "creator",
    name: "Creator",
    price: "$19",
    period: "/month",
    desc: "For active creators",
    features: [
      "Unlimited contracts",
      "All templates",
      "E-signatures included",
      "AI clause suggestions",
      "Priority support",
    ],
    cta: "Upgrade to Creator",
    highlighted: true,
    disabled: false,
  },
  {
    id: "agency",
    name: "Agency",
    price: "$79",
    period: "/month",
    desc: "For teams & agencies",
    features: [
      "Everything in Creator",
      "5 team members",
      "White-label contracts",
      "API access",
      "Dedicated support",
    ],
    cta: "Upgrade to Agency",
    highlighted: false,
    disabled: false,
  },
]

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [paddleLoaded, setPaddleLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const user = useAppStore((state) => state.user)

  // Initialize Paddle when script loads
  const initializePaddle = () => {
    if (typeof window !== "undefined" && window.Paddle) {
      const environment = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT || "sandbox"
      const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN

      if (!clientToken) {
        console.warn("Paddle client token not configured")
        return
      }

      window.Paddle.Environment.set(environment)
      window.Paddle.Initialize({
        token: clientToken,
        eventCallback: (event: PaddleEvent) => {
          console.log("Paddle event:", event)
          if (event.name === "checkout.completed") {
            // Redirect handled by Paddle successUrl
          }
        },
      })
      setPaddleLoaded(true)
    }
  }

  useEffect(() => {
    // Check if Paddle is already loaded
    if (window.Paddle) {
      initializePaddle()
    }
  }, [])

  const handleUpgrade = async (planId: string) => {
    if (planId === "free") return

    setIsLoading(planId)
    setError(null)

    try {
      const response = await fetch("/api/paddle/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: planId,
        }),
      })

      const data = await response.json()

      if (data.demo) {
        // Demo mode - Paddle not configured
        alert("Demo mode: Paddle not configured. Add PADDLE_API_KEY and NEXT_PUBLIC_PADDLE_CLIENT_TOKEN to enable real payments.")
        setIsLoading(null)
        return
      }

      if (data.success && data.priceId) {
        // Check if Paddle is loaded
        if (!window.Paddle) {
          setError("Payment system is loading. Please try again in a moment.")
          setIsLoading(null)
          return
        }

        // Open Paddle checkout overlay
        window.Paddle.Checkout.open({
          items: [{ priceId: data.priceId, quantity: 1 }],
          customer: {
            email: data.customerEmail,
            id: data.customerId,
          },
          customData: data.customData,
          settings: {
            successUrl: data.successUrl,
            displayMode: "overlay",
            theme: "light",
            locale: "en",
          },
        })
      } else {
        setError(data.error || "Failed to start checkout")
      }
    } catch (err) {
      console.error("Checkout error:", err)
      setError("Network error. Please try again.")
    }

    setIsLoading(null)
  }

  return (
    <>
      {/* Load Paddle.js */}
      <Script
        src="https://cdn.paddle.com/paddle/v2/paddle.js"
        onLoad={initializePaddle}
        onError={() => console.error("Failed to load Paddle.js")}
      />

      <div className="p-8 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">Upgrade Your Plan</h1>
          <p className="text-gray-500">Choose the plan that's right for you</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative bg-white backdrop-blur-sm transition-all duration-300 ${
                plan.highlighted
                  ? "border-purple-500/50 scale-105 shadow-xl shadow-purple-500/10"
                  : "border-[#E5E0D8] hover:border-gray-300"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full text-xs font-bold text-white">
                  MOST POPULAR
                </div>
              )}
              <CardContent className="p-8 pt-10">
                <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
                <p className="text-xs text-gray-500 mb-4">{plan.desc}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-500 text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <svg className="w-4 h-4 text-purple-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={plan.disabled || isLoading === plan.id}
                  className={`w-full h-12 rounded-xl font-semibold ${
                    plan.highlighted
                      ? "bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 text-white"
                      : plan.disabled
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                  }`}
                >
                  {isLoading === plan.id ? (
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    plan.cta
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            All plans include 14-day free trial. Cancel anytime.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Payments secured by Paddle. We handle taxes and compliance globally.
          </p>
          {!paddleLoaded && (
            <p className="text-xs text-amber-500 mt-2">
              Loading payment system...
            </p>
          )}
        </div>
      </div>
    </>
  )
}
