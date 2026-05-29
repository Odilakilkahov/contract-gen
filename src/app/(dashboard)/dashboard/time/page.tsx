"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface TimeEntry {
  id: string
  date: string
  description: string
  hours: number
  hourlyRate: number
  project: string
  billable: boolean
  invoiced: boolean
}

const initialEntries: TimeEntry[] = [
  { id: "1", date: "2026-05-29", description: "Content creation for Instagram Reel", hours: 2.5, hourlyRate: 150, project: "Nike Campaign", billable: true, invoiced: false },
  { id: "2", date: "2026-05-28", description: "Video editing and color grading", hours: 4, hourlyRate: 150, project: "Nike Campaign", billable: true, invoiced: false },
  { id: "3", date: "2026-05-28", description: "Brand call - campaign briefing", hours: 1, hourlyRate: 150, project: "Gymshark", billable: true, invoiced: false },
  { id: "4", date: "2026-05-27", description: "Photo shoot preparation", hours: 2, hourlyRate: 150, project: "Nike Campaign", billable: true, invoiced: true },
  { id: "5", date: "2026-05-26", description: "Script writing for YouTube", hours: 3, hourlyRate: 200, project: "Audible Promo", billable: true, invoiced: true },
]

export default function TimePage() {
  const [entries, setEntries] = useState<TimeEntry[]>(initialEntries)
  const [showAddModal, setShowAddModal] = useState(false)
  const [filter, setFilter] = useState<"all" | "billable" | "unbilled">("all")
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    hours: "",
    hourlyRate: "150",
    project: "",
    billable: true,
  })

  const filteredEntries = entries.filter(e => {
    if (filter === "billable") return e.billable && !e.invoiced
    if (filter === "unbilled") return !e.invoiced
    return true
  })

  const totalHours = entries.reduce((sum, e) => sum + e.hours, 0)
  const billableHours = entries.filter(e => e.billable && !e.invoiced).reduce((sum, e) => sum + e.hours, 0)
  const unbilledAmount = entries.filter(e => e.billable && !e.invoiced).reduce((sum, e) => sum + e.hours * e.hourlyRate, 0)

  const addEntry = () => {
    if (newEntry.description && newEntry.hours) {
      setEntries([
        {
          id: Date.now().toString(),
          date: newEntry.date,
          description: newEntry.description,
          hours: parseFloat(newEntry.hours),
          hourlyRate: parseFloat(newEntry.hourlyRate),
          project: newEntry.project,
          billable: newEntry.billable,
          invoiced: false,
        },
        ...entries,
      ])
      setNewEntry({ date: new Date().toISOString().split("T")[0], description: "", hours: "", hourlyRate: "150", project: "", billable: true })
      setShowAddModal(false)
    }
  }

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id))
  }

  const groupedByDate = filteredEntries.reduce((acc, entry) => {
    if (!acc[entry.date]) acc[entry.date] = []
    acc[entry.date].push(entry)
    return acc
  }, {} as Record<string, TimeEntry[]>)

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Time Tracking</h1>
          <p className="text-gray-500">Track hours spent on projects and deals</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Log Time
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white border-[#E5E0D8] rounded-xl">
          <CardContent className="p-5">
            <div className="text-sm text-gray-500">Total Hours</div>
            <div className="text-3xl font-bold">{totalHours.toFixed(1)}h</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-[#E5E0D8] rounded-xl">
          <CardContent className="p-5">
            <div className="text-sm text-gray-500">Billable Hours</div>
            <div className="text-3xl font-bold text-violet-400">{billableHours.toFixed(1)}h</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-[#E5E0D8] rounded-xl">
          <CardContent className="p-5">
            <div className="text-sm text-gray-500">Unbilled Amount</div>
            <div className="text-3xl font-bold text-emerald-400">${unbilledAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-[#E5E0D8] rounded-xl">
          <CardContent className="p-5">
            <div className="text-sm text-gray-500">This Week</div>
            <div className="text-3xl font-bold">{entries.filter(e => {
              const entryDate = new Date(e.date)
              const weekAgo = new Date()
              weekAgo.setDate(weekAgo.getDate() - 7)
              return entryDate >= weekAgo
            }).reduce((sum, e) => sum + e.hours, 0).toFixed(1)}h</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "all", label: "All Time" },
          { key: "billable", label: "Billable" },
          { key: "unbilled", label: "Unbilled" },
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

      {/* Time Entries */}
      <div className="space-y-6">
        {Object.entries(groupedByDate).map(([date, dayEntries]) => (
          <div key={date}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">
                {new Date(date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
              </h3>
              <span className="text-sm text-gray-500">
                {dayEntries.reduce((sum, e) => sum + e.hours, 0).toFixed(1)}h
              </span>
            </div>
            <Card className="bg-white border-[#E5E0D8] rounded-xl overflow-hidden">
              <div className="divide-y divide-[#E5E0D8]">
                {dayEntries.map((entry) => (
                  <div key={entry.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <div className="font-medium mb-1">{entry.description}</div>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span>{entry.project}</span>
                        {entry.billable && (
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            entry.invoiced
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-amber-500/20 text-amber-400"
                          }`}>
                            {entry.invoiced ? "Invoiced" : "Billable"}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{entry.hours}h</div>
                      <div className="text-sm text-gray-500">${(entry.hours * entry.hourlyRate).toLocaleString()}</div>
                    </div>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ))}

        {filteredEntries.length === 0 && (
          <Card className="bg-white border-[#E5E0D8] rounded-xl">
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-3">⏱️</div>
              <div className="text-gray-500">No time entries found</div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-white border-[#E5E0D8] rounded-2xl">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Log Time</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Date</label>
                    <Input
                      type="date"
                      value={newEntry.date}
                      onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                      className="bg-gray-100 border-[#E5E0D8] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Hours</label>
                    <Input
                      type="number"
                      step="0.5"
                      value={newEntry.hours}
                      onChange={(e) => setNewEntry({ ...newEntry, hours: e.target.value })}
                      placeholder="2.5"
                      className="bg-gray-100 border-[#E5E0D8] rounded-xl"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Description</label>
                  <Input
                    value={newEntry.description}
                    onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                    placeholder="What did you work on?"
                    className="bg-gray-100 border-[#E5E0D8] rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Project</label>
                    <Input
                      value={newEntry.project}
                      onChange={(e) => setNewEntry({ ...newEntry, project: e.target.value })}
                      placeholder="Nike Campaign"
                      className="bg-gray-100 border-[#E5E0D8] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Hourly Rate</label>
                    <Input
                      type="number"
                      value={newEntry.hourlyRate}
                      onChange={(e) => setNewEntry({ ...newEntry, hourlyRate: e.target.value })}
                      placeholder="150"
                      className="bg-gray-100 border-[#E5E0D8] rounded-xl"
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newEntry.billable}
                    onChange={(e) => setNewEntry({ ...newEntry, billable: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 bg-white/5 text-violet-500"
                  />
                  <span className="text-sm">Billable</span>
                </label>
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1 border-[#E5E0D8]">
                  Cancel
                </Button>
                <Button onClick={addEntry} className="flex-1 bg-violet-600 hover:bg-violet-500">
                  Log Time
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
