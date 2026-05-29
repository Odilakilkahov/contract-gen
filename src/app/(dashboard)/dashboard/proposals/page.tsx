"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Proposal {
  id: string
  title: string
  brand: string
  brandEmail: string
  status: "draft" | "sent" | "viewed" | "accepted" | "declined" | "expired"
  value: number
  sentAt: string | null
  viewedAt: string | null
  respondedAt: string | null
  expiresAt: string
  sections: {
    type: "intro" | "services" | "pricing" | "timeline" | "terms"
    content: string
  }[]
}

const initialProposals: Proposal[] = [
  {
    id: "1",
    title: "Summer Campaign Partnership",
    brand: "Nike",
    brandEmail: "partnerships@nike.com",
    status: "accepted",
    value: 15000,
    sentAt: "2026-05-15",
    viewedAt: "2026-05-16",
    respondedAt: "2026-05-18",
    expiresAt: "2026-06-15",
    sections: [],
  },
  {
    id: "2",
    title: "Ambassador Program Q3",
    brand: "Gymshark",
    brandEmail: "creators@gymshark.com",
    status: "viewed",
    value: 8000,
    sentAt: "2026-05-25",
    viewedAt: "2026-05-26",
    respondedAt: null,
    expiresAt: "2026-06-25",
    sections: [],
  },
  {
    id: "3",
    title: "Product Review Series",
    brand: "Samsung",
    brandEmail: "influencer@samsung.com",
    status: "sent",
    value: 5000,
    sentAt: "2026-05-28",
    viewedAt: null,
    respondedAt: null,
    expiresAt: "2026-06-28",
    sections: [],
  },
  {
    id: "4",
    title: "Holiday Campaign",
    brand: "Audible",
    brandEmail: "creators@audible.com",
    status: "draft",
    value: 3500,
    sentAt: null,
    viewedAt: null,
    respondedAt: null,
    expiresAt: "2026-07-01",
    sections: [],
  },
]

const statusConfig = {
  draft: { bg: "bg-zinc-500/20", text: "text-gray-500", label: "Draft" },
  sent: { bg: "bg-blue-500/20", text: "text-blue-400", label: "Sent" },
  viewed: { bg: "bg-amber-500/20", text: "text-amber-400", label: "Viewed" },
  accepted: { bg: "bg-emerald-500/20", text: "text-emerald-400", label: "Accepted" },
  declined: { bg: "bg-red-500/20", text: "text-red-400", label: "Declined" },
  expired: { bg: "bg-zinc-500/20", text: "text-gray-500", label: "Expired" },
}

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>(initialProposals)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [filter, setFilter] = useState<"all" | "active" | "accepted">("all")
  const [newProposal, setNewProposal] = useState({ title: "", brand: "", brandEmail: "", value: "", expiresAt: "" })

  const filteredProposals = proposals.filter(p => {
    if (filter === "active") return ["sent", "viewed"].includes(p.status)
    if (filter === "accepted") return p.status === "accepted"
    return true
  })

  const totalValue = proposals.filter(p => p.status === "accepted").reduce((sum, p) => sum + p.value, 0)
  const pendingValue = proposals.filter(p => ["sent", "viewed"].includes(p.status)).reduce((sum, p) => sum + p.value, 0)
  const acceptanceRate = Math.round(
    (proposals.filter(p => p.status === "accepted").length /
    Math.max(proposals.filter(p => ["accepted", "declined"].includes(p.status)).length, 1)) * 100
  )

  const sendProposal = (id: string) => {
    setProposals(proposals.map(p =>
      p.id === id ? { ...p, status: "sent" as const, sentAt: new Date().toISOString().split("T")[0] } : p
    ))
  }

  const duplicateProposal = (proposal: Proposal) => {
    setProposals([
      {
        ...proposal,
        id: Date.now().toString(),
        title: `${proposal.title} (Copy)`,
        status: "draft",
        sentAt: null,
        viewedAt: null,
        respondedAt: null,
      },
      ...proposals,
    ])
  }

  const deleteProposal = (id: string) => {
    setProposals(proposals.filter(p => p.id !== id))
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Proposals</h1>
          <p className="text-gray-500">Create and send professional proposals to brands</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Proposal
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white border-[#E5E0D8] rounded-xl">
          <CardContent className="p-5">
            <div className="text-sm text-gray-500">Total Proposals</div>
            <div className="text-3xl font-bold">{proposals.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-[#E5E0D8] rounded-xl">
          <CardContent className="p-5">
            <div className="text-sm text-gray-500">Pending Value</div>
            <div className="text-3xl font-bold text-amber-400">${pendingValue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-[#E5E0D8] rounded-xl">
          <CardContent className="p-5">
            <div className="text-sm text-gray-500">Won Value</div>
            <div className="text-3xl font-bold text-emerald-400">${totalValue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-[#E5E0D8] rounded-xl">
          <CardContent className="p-5">
            <div className="text-sm text-gray-500">Acceptance Rate</div>
            <div className="text-3xl font-bold text-violet-400">{acceptanceRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "all", label: "All Proposals" },
          { key: "active", label: "Active" },
          { key: "accepted", label: "Accepted" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as typeof filter)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === f.key
                ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                : "bg-gray-100 text-gray-500 border border-[#E5E0D8] hover:border-gray-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Proposals List */}
      <div className="space-y-3">
        {filteredProposals.map((proposal) => {
          const status = statusConfig[proposal.status]
          return (
            <Card key={proposal.id} className="bg-white border-[#E5E0D8] rounded-xl hover:border-gray-300 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center text-xl font-bold flex-shrink-0">
                    {proposal.brand.charAt(0)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold truncate">{proposal.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${status.bg} ${status.text}`}>
                        {status.label}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mb-2">
                      {proposal.brand} • {proposal.brandEmail}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      {proposal.sentAt && <span>Sent: {proposal.sentAt}</span>}
                      {proposal.viewedAt && <span>Viewed: {proposal.viewedAt}</span>}
                      {proposal.respondedAt && <span>Responded: {proposal.respondedAt}</span>}
                      <span>Expires: {proposal.expiresAt}</span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-xl font-bold">${proposal.value.toLocaleString()}</div>
                    <div className="flex gap-2 mt-2">
                      {proposal.status === "draft" && (
                        <Button size="sm" onClick={() => sendProposal(proposal.id)} className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">
                          Send
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => duplicateProposal(proposal)} className="border-[#E5E0D8]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => deleteProposal(proposal.id)} className="border-[#E5E0D8] text-red-400 hover:bg-red-500/10">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {filteredProposals.length === 0 && (
          <Card className="bg-white border-[#E5E0D8] rounded-xl">
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-3">📝</div>
              <div className="text-gray-500">No proposals found</div>
              <Button onClick={() => setShowCreateModal(true)} className="mt-4 bg-violet-600 hover:bg-violet-500">
                Create Your First Proposal
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Proposal Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-zinc-900 border-[#E5E0D8] rounded-2xl">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Create New Proposal</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Proposal Title</label>
                  <Input
                    value={newProposal.title}
                    onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                    placeholder="e.g. Summer Campaign Partnership"
                    className="bg-white/5 border-[#E5E0D8] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Brand Name</label>
                  <Input
                    value={newProposal.brand}
                    onChange={(e) => setNewProposal({ ...newProposal, brand: e.target.value })}
                    placeholder="e.g. Nike"
                    className="bg-white/5 border-[#E5E0D8] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Brand Email</label>
                  <Input
                    type="email"
                    value={newProposal.brandEmail}
                    onChange={(e) => setNewProposal({ ...newProposal, brandEmail: e.target.value })}
                    placeholder="partnerships@brand.com"
                    className="bg-white/5 border-[#E5E0D8] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Proposed Value ($)</label>
                  <Input
                    type="number"
                    value={newProposal.value}
                    onChange={(e) => setNewProposal({ ...newProposal, value: e.target.value })}
                    placeholder="5000"
                    className="bg-white/5 border-[#E5E0D8] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Expires On</label>
                  <Input
                    type="date"
                    value={newProposal.expiresAt}
                    onChange={(e) => setNewProposal({ ...newProposal, expiresAt: e.target.value })}
                    className="bg-white/5 border-[#E5E0D8] rounded-xl"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 border-[#E5E0D8]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (newProposal.title && newProposal.brand && newProposal.value) {
                      const proposal: Proposal = {
                        id: Date.now().toString(),
                        title: newProposal.title,
                        brand: newProposal.brand,
                        brandEmail: newProposal.brandEmail || `contact@${newProposal.brand.toLowerCase()}.com`,
                        status: "draft",
                        value: parseInt(newProposal.value),
                        sentAt: null,
                        viewedAt: null,
                        respondedAt: null,
                        expiresAt: newProposal.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                        sections: [],
                      }
                      setProposals([proposal, ...proposals])
                      setNewProposal({ title: "", brand: "", brandEmail: "", value: "", expiresAt: "" })
                      setShowCreateModal(false)
                    }
                  }}
                  className="flex-1 bg-violet-600 hover:bg-violet-500"
                >
                  Create Proposal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Proposal Templates */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Quick Templates</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { title: "Sponsored Post", desc: "Single post partnership", value: "$500-2,000" },
            { title: "Ambassador Program", desc: "Long-term partnership", value: "$2,000-10,000/mo" },
            { title: "UGC Package", desc: "Content creation bundle", value: "$1,000-5,000" },
          ].map((template, i) => (
            <Card key={i} className="bg-white border-[#E5E0D8] rounded-xl hover:border-gray-300 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <h3 className="font-medium mb-1">{template.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{template.desc}</p>
                <div className="text-sm text-violet-400">{template.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
