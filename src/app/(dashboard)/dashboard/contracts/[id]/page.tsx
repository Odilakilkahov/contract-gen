"use client"

import { use, useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface Contract {
  id: string
  title: string
  brand?: string
  type: string
  status: string
  amount?: string
  created_at?: string
  content: string
  parties?: {
    creator: string
    brand: string
  }
}

const mockContracts: Record<string, Contract> = {
  "1": {
    id: "1",
    title: "Nike Sponsored Post",
    brand: "Nike",
    type: "Sponsored Post",
    status: "signed",
    amount: "$2,500",
    created_at: "May 25, 2026",
    content: `INFLUENCER AGREEMENT

This Influencer Agreement ("Agreement") is entered into as of May 25, 2026 ("Effective Date") by and between:

BRAND: Nike, Inc. ("Brand")
INFLUENCER: [Creator Name] ("Influencer")

1. SERVICES
Influencer agrees to create and publish the following content:
- 1 Instagram Reel featuring Nike products
- 3 Instagram Stories with product tags
- 1 Static feed post with brand mention

2. COMPENSATION
Brand agrees to pay Influencer $2,500 USD within 30 days of content publication.

3. FTC DISCLOSURE
Influencer must clearly disclose the sponsored nature of all content in accordance with FTC guidelines.

[Signatures]
Nike, Inc.: John Smith - May 26, 2026
Influencer: [Creator Name] - May 26, 2026`,
    parties: { creator: "Creator", brand: "Nike" }
  },
  "2": {
    id: "2",
    title: "Gymshark Ambassador Q2",
    brand: "Gymshark",
    type: "Brand Ambassador",
    status: "pending_signature",
    amount: "$5,000/mo",
    created_at: "May 24, 2026",
    content: `BRAND AMBASSADOR AGREEMENT

This Brand Ambassador Agreement is pending signature...

[Contract content would appear here]`,
    parties: { creator: "Creator", brand: "Gymshark" }
  }
}

const statusConfig = {
  draft: { color: "text-gray-500", bg: "bg-zinc-500/20", label: "Draft" },
  pending_signature: { color: "text-orange-400", bg: "bg-orange-500/20", label: "Pending Signature" },
  signed: { color: "text-green-400", bg: "bg-green-500/20", label: "Signed" },
  expired: { color: "text-red-400", bg: "bg-red-500/20", label: "Expired" },
}

export default function ContractDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [contract, setContract] = useState<Contract | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Try to load from localStorage first (newly generated contracts)
    const stored = localStorage.getItem(`contract_${id}`)
    if (stored) {
      const parsed = JSON.parse(stored)
      setContract(parsed)
      setEditedContent(parsed.content || "")
    } else if (mockContracts[id]) {
      // Fall back to mock data
      setContract(mockContracts[id])
      setEditedContent(mockContracts[id].content)
    } else {
      // Create a placeholder for unknown IDs
      setContract({
        id,
        title: "New Contract",
        type: "Custom",
        status: "draft",
        content: "Contract content will appear here after generation.",
        parties: { creator: "Creator", brand: "Brand" }
      })
      setEditedContent("Contract content will appear here after generation.")
    }
  }, [id])

  const handleSave = async () => {
    if (!contract) return
    setIsSaving(true)

    const updated = {
      ...contract,
      content: editedContent,
      updated_at: new Date().toISOString(),
    }

    // Save to localStorage
    localStorage.setItem(`contract_${id}`, JSON.stringify(updated))
    setContract(updated)
    setIsEditing(false)
    setIsSaving(false)
  }

  const handleExportPDF = async () => {
    if (!contract) return
    setIsExporting(true)

    try {
      const response = await fetch('/api/contract/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: contract.title,
          brand: contract.parties?.brand || contract.brand || 'Brand',
          creator: contract.parties?.creator || 'Creator',
          content: contract.content,
          value: contract.amount,
        }),
      })

      if (!response.ok) {
        throw new Error('PDF generation failed')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${contract.title.replace(/[^a-z0-9]/gi, '_')}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Export error:", error)
      alert("Failed to export PDF. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  const handleSendForSignature = () => {
    if (!contract) return

    const updated = {
      ...contract,
      status: "pending_signature",
      updated_at: new Date().toISOString(),
    }

    localStorage.setItem(`contract_${id}`, JSON.stringify(updated))
    setContract(updated)
    alert("Contract sent for signature! (Demo - would integrate with HelloSign/DocuSign)")
  }

  if (!contract) {
    return (
      <div className="min-h-screen bg-[#FDF9F3] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  const status = statusConfig[contract.status as keyof typeof statusConfig] || statusConfig.draft

  return (
    <div className="min-h-screen bg-[#FDF9F3]">
      {/* Header */}
      <div className="border-b border-[#E5E0D8] bg-[#FDF9F3]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/contracts"
                className="p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-lg font-semibold">{contract.title}</h1>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full ${status.bg} ${status.color}`}>
                    {status.label}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {contract.parties?.brand || contract.brand} • {contract.type}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Export PDF */}
              <Button
                variant="outline"
                onClick={handleExportPDF}
                disabled={isExporting}
                className="border-[#E5E0D8] text-gray-700"
              >
                {isExporting ? (
                  <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                )}
                Export PDF
              </Button>

              {/* Edit / Save */}
              {contract.status === "draft" && (
                isEditing ? (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditedContent(contract.content)
                        setIsEditing(false)
                      }}
                      className="border-[#E5E0D8] text-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="border-[#E5E0D8] text-gray-700"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit
                  </Button>
                )
              )}

              {/* Send for Signature */}
              {contract.status === "draft" && !isEditing && (
                <Button
                  onClick={handleSendForSignature}
                  className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Send for Signature
                </Button>
              )}

              {contract.status === "pending_signature" && (
                <Button variant="outline" className="border-orange-500/50 text-orange-400">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Resend
                </Button>
              )}

              {contract.status === "signed" && (
                <span className="flex items-center gap-2 text-green-400 text-sm font-medium">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Signed
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-4 gap-6">
          {/* Main Content - Contract Editor */}
          <div className="col-span-3">
            <Card className="bg-white border-[#E5E0D8]">
              <CardContent className="p-0">
                <div className="p-4 border-b border-[#E5E0D8] flex items-center justify-between">
                  <span className="font-medium">
                    {isEditing ? "Editing Contract" : "Contract Document"}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    {isEditing && (
                      <span className="flex items-center gap-1 text-yellow-400">
                        <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                        Editing
                      </span>
                    )}
                    <span>{contract.content?.length || 0} characters</span>
                  </div>
                </div>

                {isEditing ? (
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full min-h-[700px] p-8 bg-white text-zinc-900 font-mono text-sm leading-relaxed resize-none focus:outline-none"
                    placeholder="Enter contract content..."
                  />
                ) : (
                  <div
                    ref={contentRef}
                    className="p-8 bg-white text-zinc-900 min-h-[700px] overflow-auto"
                  >
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                      {contract.content}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Contract Info */}
            <Card className="bg-white border-[#E5E0D8]">
              <CardContent className="p-4">
                <h3 className="font-medium mb-4">Contract Info</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Type</span>
                    <span>{contract.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Created</span>
                    <span>{contract.created_at || "Just now"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <span className={status.color}>{status.label}</span>
                  </div>
                  {contract.amount && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Value</span>
                      <span className="font-medium">{contract.amount}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Parties */}
            <Card className="bg-white border-[#E5E0D8]">
              <CardContent className="p-4">
                <h3 className="font-medium mb-4">Parties</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-sm font-medium">
                      {contract.parties?.creator?.charAt(0) || "C"}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{contract.parties?.creator || "Creator"}</div>
                      <div className="text-xs text-gray-500">Creator</div>
                    </div>
                    {contract.status === "signed" && (
                      <svg className="w-4 h-4 text-green-400 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm font-medium">
                      {contract.parties?.brand?.charAt(0) || contract.brand?.charAt(0) || "B"}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{contract.parties?.brand || contract.brand || "Brand"}</div>
                      <div className="text-xs text-gray-500">Brand</div>
                    </div>
                    {contract.status === "signed" && (
                      <svg className="w-4 h-4 text-green-400 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white border-[#E5E0D8]">
              <CardContent className="p-4">
                <h3 className="font-medium mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      const newId = Date.now().toString()
                      const duplicate = {
                        ...contract,
                        id: newId,
                        title: `${contract?.title} (Copy)`,
                        status: "draft",
                        created_at: new Date().toISOString(),
                      }
                      localStorage.setItem(`contract_${newId}`, JSON.stringify(duplicate))
                      router.push(`/dashboard/contracts/${newId}`)
                    }}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors text-left text-sm"
                  >
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Duplicate Contract
                  </button>
                  <button
                    onClick={() => router.push(`/dashboard/invoices?contract=${contract?.title}`)}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors text-left text-sm"
                  >
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                    </svg>
                    Generate Invoice
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this contract?")) {
                        localStorage.removeItem(`contract_${id}`)
                        router.push("/dashboard/contracts")
                      }
                    }}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors text-left text-sm text-red-400"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Contract
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* AI Suggestions (for drafts) */}
            {contract.status === "draft" && (
              <Card className="bg-purple-500/10 border-purple-500/20">
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2 flex items-center gap-2 text-purple-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    AI Suggestions
                  </h3>
                  <p className="text-xs text-gray-500 mb-3">
                    Review these suggestions to strengthen your contract:
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-start gap-2 p-2 rounded bg-white">
                      <span className="text-green-400">✓</span>
                      <span className="text-gray-700">FTC disclosure clause included</span>
                    </div>
                    <div className="flex items-start gap-2 p-2 rounded bg-white">
                      <span className="text-green-400">✓</span>
                      <span className="text-gray-700">Payment terms specified</span>
                    </div>
                    <div className="flex items-start gap-2 p-2 rounded bg-white">
                      <span className="text-yellow-400">!</span>
                      <span className="text-gray-700">Consider adding termination clause</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
