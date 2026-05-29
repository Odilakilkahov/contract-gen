"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Contract {
  id: string
  title: string
  brand: string
  brandName?: string
  influencerName?: string
  type: string
  status: string
  amount: string
  value?: number
  created: string
  createdAt?: string
  signedDate: string | null
}

// Demo contracts for showcase when no real data exists
const demoContracts: Contract[] = [
  {
    id: "demo-1",
    title: "Nike Sponsored Post",
    brand: "Nike",
    type: "Sponsored Post",
    status: "signed",
    amount: "$2,500",
    created: "May 25, 2026",
    signedDate: "May 26, 2026",
  },
  {
    id: "demo-2",
    title: "Gymshark Ambassador Q2",
    brand: "Gymshark",
    type: "Brand Ambassador",
    status: "pending_signature",
    amount: "$5,000/mo",
    created: "May 24, 2026",
    signedDate: null,
  },
  {
    id: "demo-3",
    title: "Audible Product Review",
    brand: "Audible",
    type: "Product Review",
    status: "draft",
    amount: "$1,200",
    created: "May 23, 2026",
    signedDate: null,
  },
]

const statusColors = {
  draft: { bg: "bg-gray-100", text: "text-gray-600", label: "Draft" },
  pending_signature: { bg: "bg-amber-50", text: "text-amber-600", label: "Pending" },
  pending: { bg: "bg-amber-50", text: "text-amber-600", label: "Pending" },
  signed: { bg: "bg-emerald-50", text: "text-emerald-600", label: "Signed" },
  expired: { bg: "bg-red-50", text: "text-red-600", label: "Expired" },
}

const filters = ["All", "Draft", "Pending", "Signed", "Expired"]

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // Load contracts from localStorage
    const stored = localStorage.getItem("generated-contracts")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        const storedContracts = Array.isArray(parsed) ? parsed : [parsed]

        // Transform stored contracts to match our interface
        const transformedContracts: Contract[] = storedContracts.map((c: Record<string, unknown>, index: number) => ({
          id: (c.id as string) || `contract-${index}`,
          title: (c.title as string) || `${c.brandName || 'Brand'} Contract`,
          brand: (c.brandName as string) || (c.brand as string) || 'Unknown Brand',
          brandName: c.brandName as string,
          influencerName: c.influencerName as string,
          type: (c.type as string) || (c.dealType as string) || 'Contract',
          status: (c.status as string) || 'draft',
          amount: (c.amount as string) || (c.value ? `$${(c.value as number).toLocaleString()}` : '$0'),
          value: c.value as number,
          created: (c.created as string) || formatDate(c.createdAt as string) || formatDate(new Date().toISOString()),
          createdAt: c.createdAt as string,
          signedDate: (c.signedDate as string) || null,
        }))

        setContracts(transformedContracts.length > 0 ? transformedContracts : demoContracts)
      } catch (e) {
        console.error("Failed to parse contracts:", e)
        setContracts(demoContracts)
      }
    } else {
      // No stored contracts, use demo data
      setContracts(demoContracts)
    }
    setIsLoading(false)
  }, [])

  function formatDate(dateStr?: string): string {
    if (!dateStr) return ""
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    } catch {
      return dateStr
    }
  }

  const filteredContracts = contracts.filter((contract) => {
    const matchesFilter = activeFilter === "All" ||
      (activeFilter === "Pending" && (contract.status === "pending_signature" || contract.status === "pending")) ||
      contract.status === activeFilter.toLowerCase()

    const matchesSearch = contract.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.brand.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesFilter && matchesSearch
  })

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Contracts</h1>
          <p className="text-gray-500">Manage and track all your influencer contracts</p>
        </div>
        <Link href="/dashboard/contracts/new">
          <Button className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Contract
          </Button>
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
        <div className="flex gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === filter
                  ? "bg-violet-100 text-violet-700"
                  : "bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <Input
              placeholder="Search contracts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64 bg-white border-[#E5E0D8]"
            />
          </div>
          <Button variant="outline" className="border-[#E5E0D8] text-gray-600 hover:bg-gray-50">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Contracts Table */}
      <Card className="bg-white border border-[#E5E0D8] shadow-sm">
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E0D8]">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                  Contract
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                  Type
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                  Status
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                  Amount
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                  Date
                </th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E0D8]">
              {filteredContracts.map((contract) => {
                const status = statusColors[contract.status as keyof typeof statusColors] || statusColors.draft
                return (
                  <tr key={contract.id} className="hover:bg-[#FDF9F3] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
                          <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{contract.title}</div>
                          <div className="text-sm text-gray-500">{contract.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {contract.type}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {contract.amount}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {contract.signedDate || contract.created}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/dashboard/contracts/${contract.id}`}>
                          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-violet-600">
                            View
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600 p-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {filteredContracts.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-600 mb-2">No contracts found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search or filter</p>
              <Link href="/dashboard/contracts/new">
                <Button className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500">
                  Create your first contract
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
