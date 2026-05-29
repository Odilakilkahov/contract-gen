"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAppStore, CONTRACT_TEMPLATES } from "@/lib/store"
import { useUsageStore, getPlanName } from "@/lib/usage-store"
import { DashboardSkeleton } from "@/components/Skeleton"
import { Onboarding, useOnboarding } from "@/components/Onboarding"

interface Contract {
  id: string
  title: string
  brand?: string
  brandName?: string
  status: string
  amount?: string
  value?: number
  created?: string
  createdAt?: string
  date?: string
}

interface DashboardStats {
  totalContracts: number
  pendingCount: number
  signedCount: number
  totalRevenue: number
  revenueDisplay: string
  thisMonth: number
}

const statusConfig = {
  draft: { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400", label: "Draft" },
  pending_signature: { bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-500", label: "Pending" },
  pending: { bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-500", label: "Pending" },
  signed: { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500", label: "Signed" },
  expired: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500", label: "Expired" },
}

// Demo contracts for showcase when no real data exists
const demoContracts: Contract[] = [
  { id: "demo-1", title: "Nike Sponsored Post", brand: "Nike", status: "signed", date: "2 hours ago", amount: "$2,500" },
  { id: "demo-2", title: "Gymshark Ambassador", brand: "Gymshark", status: "pending_signature", date: "1 day ago", amount: "$5,000/mo" },
  { id: "demo-3", title: "Audible Product Review", brand: "Audible", status: "draft", date: "2 days ago", amount: "$1,200" },
  { id: "demo-4", title: "Samsung UGC License", brand: "Samsung", status: "pending_signature", date: "3 days ago", amount: "$3,000" },
]

// Demo stats for showcase
const demoStats: DashboardStats = {
  totalContracts: 12,
  pendingCount: 4,
  signedCount: 8,
  totalRevenue: 24500,
  revenueDisplay: "$24.5K",
  thisMonth: 3,
}

function formatRelativeDate(dateStr?: string): string {
  if (!dateStr) return "Recently"
  try {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffHours < 1) return "Just now"
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  } catch {
    return "Recently"
  }
}

function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`
  }
  return `$${value.toLocaleString()}`
}

function parseAmount(amount?: string): number {
  if (!amount) return 0
  const cleaned = amount.replace(/[$,]/g, '').replace(/\/mo.*$/, '')
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}

export default function DashboardPage() {
  const user = useAppStore((state) => state.user)
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>(demoStats)
  const [recentContracts, setRecentContracts] = useState<Contract[]>(demoContracts)
  const { showOnboarding, completeOnboarding } = useOnboarding()
  const {
    contractsThisMonth,
    getLimit,
    plan,
    getUsagePercentage,
    getRemainingContracts,
    resetIfNewMonth
  } = useUsageStore()

  useEffect(() => {
    // Reset usage if new month
    resetIfNewMonth()

    // Load contracts from localStorage
    const stored = localStorage.getItem("generated-contracts")
    let contracts: Contract[] = []

    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        const storedContracts = Array.isArray(parsed) ? parsed : [parsed]

        contracts = storedContracts.map((c: Record<string, unknown>, index: number) => ({
          id: (c.id as string) || `contract-${index}`,
          title: (c.title as string) || `${c.brandName || 'Brand'} Contract`,
          brand: (c.brandName as string) || (c.brand as string) || 'Unknown Brand',
          brandName: c.brandName as string,
          status: (c.status as string) || 'draft',
          amount: (c.amount as string) || (c.value ? `$${(c.value as number).toLocaleString()}` : undefined),
          value: c.value as number,
          created: c.created as string,
          createdAt: c.createdAt as string,
          date: formatRelativeDate((c.createdAt as string) || (c.created as string)),
        }))
      } catch (e) {
        console.error("Failed to parse contracts:", e)
      }
    }

    // Calculate stats from real data if available
    if (contracts.length > 0) {
      const now = new Date()
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)

      const pendingCount = contracts.filter(c =>
        c.status === "pending" || c.status === "pending_signature"
      ).length
      const signedCount = contracts.filter(c => c.status === "signed").length

      const totalRevenue = contracts.reduce((sum, c) => {
        const value = c.value || parseAmount(c.amount)
        return sum + value
      }, 0)

      const thisMonth = contracts.filter(c => {
        const dateStr = c.createdAt || c.created
        if (!dateStr) return false
        try {
          const date = new Date(dateStr)
          return date >= thisMonthStart
        } catch {
          return false
        }
      }).length

      setStats({
        totalContracts: contracts.length,
        pendingCount,
        signedCount,
        totalRevenue,
        revenueDisplay: formatCurrency(totalRevenue),
        thisMonth,
      })

      // Get recent contracts (last 4)
      setRecentContracts(contracts.slice(0, 4))
    }

    setIsLoading(false)
  }, [resetIfNewMonth])

  if (isLoading) {
    return <DashboardSkeleton />
  }

  const statsDisplay = [
    {
      label: "Total Contracts",
      value: stats.totalContracts.toString(),
      change: `+${stats.thisMonth}`,
      trend: "up",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: "from-violet-500 to-purple-500",
    },
    {
      label: "Pending",
      value: stats.pendingCount.toString(),
      change: stats.pendingCount > 0 ? `${stats.pendingCount} awaiting` : "None",
      trend: stats.pendingCount > 0 ? "warning" : "neutral",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "from-amber-500 to-orange-500",
    },
    {
      label: "Signed",
      value: stats.signedCount.toString(),
      change: stats.totalContracts > 0 ? `${Math.round((stats.signedCount / stats.totalContracts) * 100)}%` : "0%",
      trend: "up",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "from-emerald-500 to-green-500",
    },
    {
      label: "Revenue",
      value: stats.revenueDisplay,
      change: `${stats.signedCount} deals`,
      trend: "neutral",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "from-blue-500 to-cyan-500",
    },
  ]

  return (
    <>
      {showOnboarding && <Onboarding onComplete={completeOnboarding} />}
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-1 text-gray-900 dark:text-white">
            Welcome back, {user?.name?.split(" ")[0] || "Creator"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Here&apos;s what&apos;s happening with your contracts</p>
        </div>
        <Link href="/dashboard/contracts/new" className="hidden sm:block">
          <Button className="h-10 px-5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-xl font-medium shadow-lg shadow-violet-500/20">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Contract
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 lg:mb-8">
        {statsDisplay.map((stat, i) => (
          <Card
            key={i}
            className="group relative overflow-hidden bg-white dark:bg-gray-800 border border-[#E5E0D8] dark:border-gray-700 hover:border-[#D5D0C8] dark:hover:border-gray-600 hover:shadow-md transition-all duration-300 rounded-xl sm:rounded-2xl"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
            <CardContent className="p-3 sm:p-5">
              <div className="flex items-start justify-between mb-2 sm:mb-4">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}>
                  {stat.icon}
                </div>
                <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ${
                  stat.trend === "up" ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" :
                  stat.trend === "warning" ? "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" :
                  "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                }`}>
                  {stat.change}
                </span>
              </div>
              <div className="text-xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-0.5 sm:mb-1">{stat.value}</div>
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Contracts */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Contracts</h2>
            <Link
              href="/dashboard/contracts"
              className="text-sm text-gray-500 hover:text-violet-600 transition-colors flex items-center gap-1"
            >
              View all
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <Card className="bg-white border border-[#E5E0D8] rounded-2xl overflow-hidden shadow-sm">
            <CardContent className="p-0">
              <div className="divide-y divide-[#E5E0D8]">
                {recentContracts.map((contract) => {
                  const status = statusConfig[contract.status as keyof typeof statusConfig] || statusConfig.draft
                  return (
                    <Link
                      key={contract.id}
                      href={`/dashboard/contracts/${contract.id}`}
                      className="group flex items-center gap-4 p-4 hover:bg-[#FDF9F3] transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-fuchsia-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900 truncate">{contract.title}</span>
                          <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${status.bg} ${status.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                            {status.label}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">{contract.brand || contract.brandName} • {contract.date}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-semibold text-gray-900">{contract.amount || "TBD"}</div>
                      </div>
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-violet-600 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Activity Chart Placeholder */}
          <Card className="bg-white border border-[#E5E0D8] rounded-2xl overflow-hidden shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900">Contract Activity</h3>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-violet-500" />
                    Created
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Signed
                  </span>
                </div>
              </div>
              <div className="h-32 flex items-end justify-between gap-2">
                {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex flex-col gap-1">
                      <div
                        className="w-full bg-gradient-to-t from-violet-600 to-violet-400 rounded-t"
                        style={{ height: `${h}px` }}
                      />
                      <div
                        className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-b"
                        style={{ height: `${h * 0.6}px` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-3 text-xs text-gray-500">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/dashboard/contracts/new">
                <Card className="group bg-gradient-to-r from-violet-50 to-fuchsia-50 border border-violet-200 hover:border-violet-300 hover:shadow-md transition-all cursor-pointer rounded-xl">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">New Contract</div>
                      <div className="text-xs text-gray-500">AI-powered generation</div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/dashboard/templates">
                <Card className="group bg-white border border-[#E5E0D8] hover:border-[#D5D0C8] hover:shadow-md transition-all cursor-pointer rounded-xl">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Browse Templates</div>
                      <div className="text-xs text-gray-500">8+ ready to use</div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Card className="group bg-white border border-[#E5E0D8] hover:border-[#D5D0C8] hover:shadow-md transition-all cursor-pointer rounded-xl">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Import Contract</div>
                    <div className="text-xs text-gray-500">Upload existing PDF</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Popular Templates */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Popular Templates</h2>
            <div className="space-y-2">
              {CONTRACT_TEMPLATES.slice(0, 4).map((template) => (
                <Link
                  key={template.id}
                  href={`/dashboard/contracts/new?template=${template.id}`}
                  className="group flex items-center gap-3 p-3 rounded-xl bg-white border border-[#E5E0D8] hover:border-[#D5D0C8] hover:bg-[#FDF9F3] hover:shadow-sm transition-all"
                >
                  <span className="text-xl">{template.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{template.name}</div>
                    <div className="text-xs text-gray-500 truncate">{template.description}</div>
                  </div>
                  <svg className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          {/* Usage Card */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-violet-100 via-fuchsia-50 to-white border border-violet-200 rounded-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-200/50 rounded-full blur-3xl" />
            <CardContent className="p-5 relative">
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm font-medium text-violet-700">{getPlanName(plan)} Plan</div>
                {plan !== "free" && (
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </div>
              {plan === "free" ? (
                <>
                  <div className="text-xs text-gray-500 mb-4">
                    {contractsThisMonth} of {getLimit()} contracts used this month
                  </div>
                  <div className="w-full h-1.5 bg-violet-100 rounded-full overflow-hidden mb-4">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        getUsagePercentage() >= 100
                          ? "bg-red-500"
                          : getUsagePercentage() >= 66
                          ? "bg-amber-500"
                          : "bg-gradient-to-r from-violet-500 to-fuchsia-500"
                      }`}
                      style={{ width: `${Math.min(getUsagePercentage(), 100)}%` }}
                    />
                  </div>
                  {getRemainingContracts() === 0 ? (
                    <div className="text-xs text-red-600 mb-4 font-medium">
                      Limit reached - upgrade to continue
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500 mb-4">
                      {getRemainingContracts()} contract{getRemainingContracts() !== 1 ? 's' : ''} remaining
                    </div>
                  )}
                  <Link href="/dashboard/pricing">
                    <Button className="w-full h-9 text-sm bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-lg shadow-md">
                      Upgrade Plan
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <div className="text-xs text-gray-500 mb-2">Unlimited contracts</div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{contractsThisMonth} contracts created this month</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </>
  )
}
