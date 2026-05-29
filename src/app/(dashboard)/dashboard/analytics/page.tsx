"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ContractData {
  id: string
  title: string
  brand: string
  status: string
  value?: number
  createdAt?: string
}

// Simple bar chart component without external libraries
const SimpleBarChart = ({ data }: { data: { label: string; value: number }[] }) => {
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div className="flex items-end gap-2 h-48">
      {data.map((item, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-xs font-medium text-gray-600">{item.value}</span>
          <div
            className="w-full bg-gradient-to-t from-violet-500 to-fuchsia-500 rounded-t transition-all"
            style={{ height: `${(item.value / max) * 100}%`, minHeight: item.value > 0 ? 8 : 0 }}
          />
          <span className="text-xs text-gray-500">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

// Simple horizontal bar chart for top brands
const HorizontalBarChart = ({ data }: { data: { label: string; value: number }[] }) => {
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div className="space-y-3">
      {data.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-sm text-gray-600 w-24 truncate">{item.label}</span>
          <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all"
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-900 w-8">{item.value}</span>
        </div>
      ))}
    </div>
  )
}

// Demo data for visualization
const demoContracts: ContractData[] = [
  { id: "1", title: "Nike Sponsored Post", brand: "Nike", status: "signed", value: 2500, createdAt: "2026-05-25" },
  { id: "2", title: "Gymshark Ambassador Q2", brand: "Gymshark", status: "pending", value: 5000, createdAt: "2026-05-24" },
  { id: "3", title: "Audible Product Review", brand: "Audible", status: "draft", value: 1200, createdAt: "2026-05-23" },
  { id: "4", title: "Samsung UGC License", brand: "Samsung", status: "signed", value: 3000, createdAt: "2026-05-22" },
  { id: "5", title: "Red Bull Event", brand: "Red Bull", status: "signed", value: 8000, createdAt: "2026-04-15" },
  { id: "6", title: "HelloFresh Affiliate", brand: "HelloFresh", status: "signed", value: 1500, createdAt: "2026-04-10" },
  { id: "7", title: "Apple Campaign", brand: "Apple", status: "signed", value: 12000, createdAt: "2026-03-20" },
  { id: "8", title: "Google Ads", brand: "Google", status: "pending", value: 4500, createdAt: "2026-03-15" },
  { id: "9", title: "Nike Summer", brand: "Nike", status: "signed", value: 3500, createdAt: "2026-02-10" },
  { id: "10", title: "Adidas Collab", brand: "Adidas", status: "signed", value: 6000, createdAt: "2026-01-05" },
]

export default function AnalyticsPage() {
  const [contracts, setContracts] = useState<ContractData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Try to load from localStorage, fallback to demo data
    const stored = localStorage.getItem("generated-contracts")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        const contractList = Array.isArray(parsed) ? parsed : [parsed]
        if (contractList.length > 0) {
          setContracts(contractList)
        } else {
          setContracts(demoContracts)
        }
      } catch {
        setContracts(demoContracts)
      }
    } else {
      setContracts(demoContracts)
    }
    setIsLoading(false)
  }, [])

  // Calculate monthly data for last 6 months
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - (5 - i))
    const month = date.toLocaleString('default', { month: 'short' })
    const monthNum = date.getMonth()
    const year = date.getFullYear()
    const count = contracts.filter(c => {
      if (!c.createdAt) return false
      const cDate = new Date(c.createdAt)
      return cDate.getMonth() === monthNum && cDate.getFullYear() === year
    }).length
    return { label: month, value: count }
  })

  // Calculate revenue by month
  const revenueData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - (5 - i))
    const month = date.toLocaleString('default', { month: 'short' })
    const monthNum = date.getMonth()
    const year = date.getFullYear()
    const revenue = contracts
      .filter(c => {
        if (!c.createdAt || c.status !== "signed") return false
        const cDate = new Date(c.createdAt)
        return cDate.getMonth() === monthNum && cDate.getFullYear() === year
      })
      .reduce((sum, c) => sum + (c.value || 0), 0)
    return { label: month, value: revenue }
  })

  // Calculate top brands
  const brandCounts: Record<string, number> = {}
  contracts.forEach(c => {
    brandCounts[c.brand] = (brandCounts[c.brand] || 0) + 1
  })
  const topBrands = Object.entries(brandCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([label, value]) => ({ label, value }))

  // Calculate stats
  const totalValue = contracts
    .filter(c => c.status === "signed")
    .reduce((sum, c) => sum + (c.value || 0), 0)
  const signedCount = contracts.filter(c => c.status === "signed").length
  const sentCount = contracts.filter(c => c.status !== "draft").length
  const conversionRate = sentCount > 0 ? (signedCount / sentCount * 100).toFixed(1) : "0"
  const avgDealSize = signedCount > 0 ? Math.round(totalValue / signedCount) : 0

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Analytics</h1>
        <p className="text-gray-500">Track your contract performance and revenue</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-white border border-[#E5E0D8] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Contracts</p>
                <p className="text-3xl font-bold text-gray-900">{contracts.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-[#E5E0D8] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Signed</p>
                <p className="text-3xl font-bold text-emerald-600">{signedCount}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-[#E5E0D8] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Conversion Rate</p>
                <p className="text-3xl font-bold text-gray-900">{conversionRate}%</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-[#E5E0D8] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">${totalValue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-fuchsia-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-fuchsia-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <Card className="bg-white border border-[#E5E0D8] shadow-sm">
          <CardHeader className="border-b border-[#E5E0D8]">
            <CardTitle className="text-lg font-semibold">Contracts Over Time</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <SimpleBarChart data={monthlyData} />
          </CardContent>
        </Card>

        <Card className="bg-white border border-[#E5E0D8] shadow-sm">
          <CardHeader className="border-b border-[#E5E0D8]">
            <CardTitle className="text-lg font-semibold">Revenue by Month</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <SimpleBarChart data={revenueData.map(d => ({ label: d.label, value: d.value / 1000 }))} />
            <p className="text-xs text-gray-400 text-center mt-2">Values in thousands ($K)</p>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-white border border-[#E5E0D8] shadow-sm">
          <CardHeader className="border-b border-[#E5E0D8]">
            <CardTitle className="text-lg font-semibold">Top Brands</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {topBrands.length > 0 ? (
              <HorizontalBarChart data={topBrands} />
            ) : (
              <div className="text-center text-gray-500 py-8">
                No brand data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white border border-[#E5E0D8] shadow-sm">
          <CardHeader className="border-b border-[#E5E0D8]">
            <CardTitle className="text-lg font-semibold">Key Metrics</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#FDF9F3] rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <span className="text-gray-600">Average Deal Size</span>
                </div>
                <span className="text-xl font-bold text-gray-900">${avgDealSize.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#FDF9F3] rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-gray-600">Success Rate</span>
                </div>
                <span className="text-xl font-bold text-emerald-600">{conversionRate}%</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#FDF9F3] rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-gray-600">Pending Contracts</span>
                </div>
                <span className="text-xl font-bold text-amber-600">
                  {contracts.filter(c => c.status === "pending" || c.status === "pending_signature").length}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#FDF9F3] rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-fuchsia-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-fuchsia-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <span className="text-gray-600">Unique Brands</span>
                </div>
                <span className="text-xl font-bold text-fuchsia-600">{Object.keys(brandCounts).length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
