"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppStore } from "@/lib/store"

const PLAN_DETAILS = {
  free: {
    name: "Free",
    price: "$0",
    period: "forever",
    contracts: 3,
    color: "gray",
  },
  creator: {
    name: "Creator",
    price: "$19",
    period: "/month",
    contracts: "Unlimited",
    color: "purple",
  },
  agency: {
    name: "Agency",
    price: "$79",
    period: "/month",
    contracts: "Unlimited + Team",
    color: "fuchsia",
  },
}

type PlanType = keyof typeof PLAN_DETAILS
type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete' | 'paused' | null | undefined

// Helper component: Plan Badge
function PlanBadge({ plan, status }: { plan: PlanType; status?: SubscriptionStatus }) {
  const details = PLAN_DETAILS[plan] || PLAN_DETAILS.free

  const colorClasses = {
    gray: "bg-gray-100 text-gray-600",
    purple: "bg-purple-100 text-purple-600",
    fuchsia: "bg-gradient-to-r from-purple-100 to-fuchsia-100 text-fuchsia-600",
  }

  const statusIndicator = status === 'canceled' ? (
    <span className="ml-2 text-xs text-red-500">(Canceled)</span>
  ) : status === 'past_due' ? (
    <span className="ml-2 text-xs text-amber-500">(Past Due)</span>
  ) : status === 'trialing' ? (
    <span className="ml-2 text-xs text-blue-500">(Trial)</span>
  ) : null

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${colorClasses[details.color as keyof typeof colorClasses]}`}>
      {details.name} Plan{statusIndicator}
    </span>
  )
}

// Helper component: Current Plan Details
function CurrentPlanDetails({
  plan,
  expiresAt,
  status
}: {
  plan: PlanType
  expiresAt?: string
  status?: SubscriptionStatus
}) {
  const details = PLAN_DETAILS[plan] || PLAN_DETAILS.free

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="mb-4 space-y-2">
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold">{details.price}</span>
        <span className="text-gray-500">{details.period}</span>
      </div>

      <div className="text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>
            {typeof details.contracts === 'number'
              ? `${details.contracts} contracts/month`
              : details.contracts}
          </span>
        </div>
      </div>

      {plan !== 'free' && expiresAt && (
        <div className="text-sm text-gray-500">
          {status === 'canceled' ? (
            <span>Access until: {formatDate(expiresAt)}</span>
          ) : (
            <span>Next billing date: {formatDate(expiresAt)}</span>
          )}
        </div>
      )}

      {status === 'past_due' && (
        <div className="p-2 rounded bg-amber-50 border border-amber-200 text-amber-700 text-sm">
          Your payment is past due. Please update your payment method to continue using premium features.
        </div>
      )}
    </div>
  )
}

export default function SettingsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const user = useAppStore((state) => state.user)
  const setUser = useAppStore((state) => state.setUser)
  const logout = useAppStore((state) => state.logout)

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isLoadingBilling, setIsLoadingBilling] = useState(false)
  const [billingError, setBillingError] = useState<string | null>(null)

  // Check for demo mode billing param
  useEffect(() => {
    if (searchParams.get("billing") === "demo") {
      setBillingError("Billing portal is not available in demo mode. Configure Stripe to enable.")
      // Clear the URL param
      router.replace("/dashboard/settings")
    }
  }, [searchParams, router])

  const handleSave = async () => {
    setIsSaving(true)
    setSaveSuccess(false)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    setUser({
      id: user?.id || "demo-user",
      name: formData.name,
      email: formData.email,
    })

    setIsSaving(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const handleDeleteAccount = () => {
    logout()
    router.push("/")
  }

  const handleManageBilling = async () => {
    setIsLoadingBilling(true)
    setBillingError(null)

    try {
      const response = await fetch("/api/paddle/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          returnUrl: window.location.href,
        }),
      })

      const data = await response.json()

      if (data.success && data.url) {
        window.location.href = data.url
      } else {
        setBillingError(data.error || "Failed to open billing portal")
      }
    } catch (error) {
      console.error("Billing portal error:", error)
      setBillingError("Failed to connect to billing portal. Please try again.")
    }

    setIsLoadingBilling(false)
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Settings</h1>
        <p className="text-gray-500">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <Card className="bg-white border-[#E5E0D8] mb-6">
        <CardContent className="p-6">
          <h2 className="font-semibold mb-4">Profile</h2>
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center text-2xl font-bold">
              {formData.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1.5">Full Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-gray-100 border-[#E5E0D8]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1.5">Email</label>
                  <Input
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-gray-100 border-[#E5E0D8]"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
                {saveSuccess && (
                  <span className="text-sm text-emerald-400 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Saved successfully
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing */}
      <Card className="bg-white border-[#E5E0D8] mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Subscription</h2>
            <PlanBadge plan={user?.plan || "free"} status={user?.subscriptionStatus} />
          </div>

          <CurrentPlanDetails
            plan={user?.plan || "free"}
            expiresAt={user?.planExpiresAt}
            status={user?.subscriptionStatus}
          />

          {billingError && (
            <div className="mb-4 p-3 rounded-lg bg-amber-100 border border-amber-200 text-amber-800 text-sm">
              {billingError}
            </div>
          )}

          <div className="flex items-center gap-3">
            {(user?.plan === "creator" || user?.plan === "agency") && user?.paddleCustomerId ? (
              <Button
                onClick={handleManageBilling}
                disabled={isLoadingBilling}
                variant="outline"
                className="border-[#E5E0D8]"
              >
                {isLoadingBilling ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Manage Subscription
                  </>
                )}
              </Button>
            ) : null}

            {(!user?.plan || user?.plan === "free") && (
              <Button
                onClick={() => router.push("/dashboard/pricing")}
                className="bg-gradient-to-r from-purple-500 to-fuchsia-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Upgrade to Pro
              </Button>
            )}

            {user?.plan === "creator" && (
              <Button
                onClick={() => router.push("/dashboard/pricing")}
                variant="outline"
                className="border-purple-500 text-purple-600 hover:bg-purple-50"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                Upgrade to Agency
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* White-Label Branding (Agency only) */}
      {user?.plan === 'agency' && (
        <Card className="bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-950/30 dark:to-fuchsia-950/30 border-violet-200 dark:border-violet-800 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-gray-100">White-Label Branding</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Customize contracts and emails with your brand</p>
                </div>
              </div>
              <Button
                onClick={() => router.push('/dashboard/settings/branding')}
                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Customize
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Integrations */}
      <Card className="bg-white border-[#E5E0D8] mb-6">
        <CardContent className="p-6">
          <h2 className="font-semibold mb-4">Integrations</h2>
          <div className="space-y-3">
            {[
              { name: "Paddle", desc: "Accept payments globally", connected: false },
              { name: "DocuSign", desc: "E-signatures", connected: false },
              { name: "Google Drive", desc: "Store contracts", connected: false },
            ].map((integration) => (
              <div key={integration.name} className="flex items-center justify-between p-3 rounded-lg bg-gray-100">
                <div>
                  <div className="font-medium">{integration.name}</div>
                  <div className="text-sm text-gray-500">{integration.desc}</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#E5E0D8]"
                  onClick={() => alert(`${integration.name} integration coming soon!`)}
                >
                  Connect
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-red-500/5 border-red-500/20">
        <CardContent className="p-6">
          <h2 className="font-semibold text-red-400 mb-2">Danger Zone</h2>
          <p className="text-gray-500 text-sm mb-4">
            Once you delete your account, there is no going back.
          </p>
          {!showDeleteConfirm ? (
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(true)}
              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
            >
              Delete Account
            </Button>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                onClick={handleDeleteAccount}
                className="bg-red-600 hover:bg-red-700"
              >
                Yes, Delete My Account
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                className="border-[#E5E0D8]"
              >
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
