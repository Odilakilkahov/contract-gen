"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Deal {
  id: string
  brand: string
  title: string
  value: number
  status: "lead" | "negotiation" | "contract_sent" | "signed" | "completed" | "lost"
  platform: string
  dueDate?: string
  notes?: string
  createdAt: string
}

const initialDeals: Deal[] = [
  { id: "1", brand: "Nike", title: "Summer Campaign", value: 5000, status: "signed", platform: "Instagram", dueDate: "2026-06-15", createdAt: "2026-05-01" },
  { id: "2", brand: "Gymshark", title: "Ambassador Deal", value: 12000, status: "negotiation", platform: "TikTok", createdAt: "2026-05-10" },
  { id: "3", brand: "Audible", title: "Podcast Promo", value: 2500, status: "contract_sent", platform: "YouTube", createdAt: "2026-05-15" },
  { id: "4", brand: "Samsung", title: "Product Review", value: 3500, status: "lead", platform: "YouTube", createdAt: "2026-05-20" },
  { id: "5", brand: "Adobe", title: "Tutorial Series", value: 8000, status: "completed", platform: "YouTube", dueDate: "2026-04-30", createdAt: "2026-04-01" },
  { id: "6", brand: "Spotify", title: "Music Feature", value: 1500, status: "lost", platform: "Instagram", createdAt: "2026-05-05" },
]

const columns = [
  { id: "lead", title: "Leads", color: "bg-zinc-500" },
  { id: "negotiation", title: "Negotiation", color: "bg-amber-500" },
  { id: "contract_sent", title: "Contract Sent", color: "bg-blue-500" },
  { id: "signed", title: "Signed", color: "bg-violet-500" },
  { id: "completed", title: "Completed", color: "bg-emerald-500" },
]

const platformIcons: Record<string, string> = {
  Instagram: "📸",
  TikTok: "🎵",
  YouTube: "▶️",
  Twitter: "🐦",
}

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>(initialDeals)
  const [showNewDeal, setShowNewDeal] = useState(false)
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null)
  const [newDeal, setNewDeal] = useState({
    brand: "",
    title: "",
    value: "",
    platform: "Instagram",
  })

  const handleDragStart = (deal: Deal) => {
    setDraggedDeal(deal)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (status: Deal["status"]) => {
    if (draggedDeal) {
      setDeals(deals.map(d =>
        d.id === draggedDeal.id ? { ...d, status } : d
      ))
      setDraggedDeal(null)
    }
  }

  const addDeal = () => {
    if (newDeal.brand && newDeal.title) {
      const deal: Deal = {
        id: Date.now().toString(),
        brand: newDeal.brand,
        title: newDeal.title,
        value: parseInt(newDeal.value) || 0,
        status: "lead",
        platform: newDeal.platform,
        createdAt: new Date().toISOString().split("T")[0],
      }
      setDeals([deal, ...deals])
      setNewDeal({ brand: "", title: "", value: "", platform: "Instagram" })
      setShowNewDeal(false)
    }
  }

  const deleteDeal = (id: string) => {
    setDeals(deals.filter(d => d.id !== id))
  }

  const totalPipeline = deals
    .filter(d => !["completed", "lost"].includes(d.status))
    .reduce((sum, d) => sum + d.value, 0)

  const completedValue = deals
    .filter(d => d.status === "completed")
    .reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">Deal Pipeline</h1>
          <p className="text-gray-500">Track your brand deals from lead to completion</p>
        </div>
        <Button
          onClick={() => setShowNewDeal(true)}
          className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Deal
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white border-[#E5E0D8] rounded-xl">
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Pipeline Value</div>
            <div className="text-2xl font-bold text-violet-400">${totalPipeline.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-[#E5E0D8] rounded-xl">
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Completed</div>
            <div className="text-2xl font-bold text-emerald-400">${completedValue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-[#E5E0D8] rounded-xl">
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Active Deals</div>
            <div className="text-2xl font-bold">{deals.filter(d => !["completed", "lost"].includes(d.status)).length}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-[#E5E0D8] rounded-xl">
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Win Rate</div>
            <div className="text-2xl font-bold">
              {Math.round((deals.filter(d => d.status === "completed").length / Math.max(deals.filter(d => ["completed", "lost"].includes(d.status)).length, 1)) * 100)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Deal Modal */}
      {showNewDeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-white border-[#E5E0D8] rounded-2xl">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Add New Deal</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Brand Name</label>
                  <Input
                    value={newDeal.brand}
                    onChange={(e) => setNewDeal({ ...newDeal, brand: e.target.value })}
                    placeholder="e.g. Nike"
                    className="bg-gray-100 border-[#E5E0D8] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Deal Title</label>
                  <Input
                    value={newDeal.title}
                    onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
                    placeholder="e.g. Summer Campaign"
                    className="bg-gray-100 border-[#E5E0D8] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Value ($)</label>
                  <Input
                    type="number"
                    value={newDeal.value}
                    onChange={(e) => setNewDeal({ ...newDeal, value: e.target.value })}
                    placeholder="5000"
                    className="bg-gray-100 border-[#E5E0D8] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Platform</label>
                  <div className="grid grid-cols-4 gap-2">
                    {Object.entries(platformIcons).map(([platform, icon]) => (
                      <button
                        key={platform}
                        onClick={() => setNewDeal({ ...newDeal, platform })}
                        className={`p-2 rounded-lg border text-center transition-all ${
                          newDeal.platform === platform
                            ? "bg-violet-500/20 border-violet-500/50"
                            : "bg-gray-100 border-[#E5E0D8] hover:border-white/20"
                        }`}
                      >
                        <span className="text-lg">{icon}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowNewDeal(false)}
                  className="flex-1 border-[#E5E0D8]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={addDeal}
                  className="flex-1 bg-violet-600 hover:bg-violet-500"
                >
                  Add Deal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {columns.map((column) => (
            <div
              key={column.id}
              className="w-72 flex-shrink-0"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column.id as Deal["status"])}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-2 h-2 rounded-full ${column.color}`} />
                <h3 className="font-medium text-sm">{column.title}</h3>
                <span className="text-xs text-gray-500 ml-auto">
                  {deals.filter(d => d.status === column.id).length}
                </span>
              </div>

              <div className="space-y-2 min-h-[200px] p-2 rounded-xl bg-gray-50 border border-[#E5E0D8]">
                {deals
                  .filter((d) => d.status === column.id)
                  .map((deal) => (
                    <div
                      key={deal.id}
                      draggable
                      onDragStart={() => handleDragStart(deal)}
                      className={`p-3 rounded-xl bg-white/[0.03] border border-white/5 cursor-grab hover:border-[#E5E0D8] transition-all ${
                        draggedDeal?.id === deal.id ? "opacity-50" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span>{platformIcons[deal.platform]}</span>
                          <span className="font-medium text-sm">{deal.brand}</span>
                        </div>
                        <button
                          onClick={() => deleteDeal(deal.id)}
                          className="text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="text-sm text-gray-500 mb-2">{deal.title}</div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-emerald-400">
                          ${deal.value.toLocaleString()}
                        </span>
                        {deal.dueDate && (
                          <span className="text-xs text-gray-500">
                            Due {new Date(deal.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}

          {/* Lost Column */}
          <div
            className="w-72 flex-shrink-0 opacity-60"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop("lost")}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <h3 className="font-medium text-sm">Lost</h3>
              <span className="text-xs text-gray-500 ml-auto">
                {deals.filter(d => d.status === "lost").length}
              </span>
            </div>
            <div className="space-y-2 min-h-[200px] p-2 rounded-xl bg-red-500/5 border border-red-500/10">
              {deals
                .filter((d) => d.status === "lost")
                .map((deal) => (
                  <div
                    key={deal.id}
                    draggable
                    onDragStart={() => handleDragStart(deal)}
                    className="p-3 rounded-xl bg-white border border-[#E5E0D8] cursor-grab"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span>{platformIcons[deal.platform]}</span>
                      <span className="font-medium text-sm line-through text-gray-500">{deal.brand}</span>
                    </div>
                    <div className="text-sm text-gray-400">{deal.title}</div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
