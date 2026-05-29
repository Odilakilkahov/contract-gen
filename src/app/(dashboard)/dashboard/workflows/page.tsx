"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Workflow {
  id: string
  name: string
  description: string
  trigger: {
    type: string
    label: string
    icon: string
  }
  actions: {
    type: string
    label: string
    icon: string
    config?: Record<string, any>
  }[]
  isActive: boolean
  triggerCount: number
  lastTriggered: string | null
}

const triggerTypes = [
  { type: "contract_signed", label: "Contract Signed", icon: "✅" },
  { type: "contract_sent", label: "Contract Sent", icon: "📤" },
  { type: "signature_viewed", label: "Signature Viewed", icon: "👁️" },
  { type: "invoice_sent", label: "Invoice Sent", icon: "💰" },
  { type: "invoice_overdue", label: "Invoice Overdue", icon: "⚠️" },
  { type: "invoice_paid", label: "Invoice Paid", icon: "💵" },
  { type: "deal_stage_changed", label: "Deal Stage Changed", icon: "📊" },
  { type: "proposal_accepted", label: "Proposal Accepted", icon: "🎉" },
]

const actionTypes = [
  { type: "send_email", label: "Send Email", icon: "✉️" },
  { type: "create_invoice", label: "Create Invoice", icon: "📄" },
  { type: "send_notification", label: "Send Notification", icon: "🔔" },
  { type: "create_task", label: "Create Task", icon: "✓" },
  { type: "update_deal", label: "Update Deal", icon: "📊" },
  { type: "add_calendar_event", label: "Add Calendar Event", icon: "📅" },
  { type: "webhook", label: "Call Webhook", icon: "🔗" },
]

const initialWorkflows: Workflow[] = [
  {
    id: "1",
    name: "Auto-Invoice on Signature",
    description: "Create an invoice when contract is signed",
    trigger: { type: "contract_signed", label: "Contract Signed", icon: "✅" },
    actions: [
      { type: "create_invoice", label: "Create Invoice", icon: "📄" },
      { type: "send_email", label: "Send Email", icon: "✉️" },
    ],
    isActive: true,
    triggerCount: 12,
    lastTriggered: "2026-05-28",
  },
  {
    id: "2",
    name: "Overdue Payment Reminder",
    description: "Send reminder when invoice is overdue",
    trigger: { type: "invoice_overdue", label: "Invoice Overdue", icon: "⚠️" },
    actions: [
      { type: "send_email", label: "Send Reminder Email", icon: "✉️" },
      { type: "send_notification", label: "Notify Me", icon: "🔔" },
    ],
    isActive: true,
    triggerCount: 3,
    lastTriggered: "2026-05-20",
  },
  {
    id: "3",
    name: "Proposal Won Celebration",
    description: "Celebrate when proposal is accepted",
    trigger: { type: "proposal_accepted", label: "Proposal Accepted", icon: "🎉" },
    actions: [
      { type: "send_notification", label: "Send Celebration", icon: "🔔" },
      { type: "add_calendar_event", label: "Add Kickoff Meeting", icon: "📅" },
    ],
    isActive: false,
    triggerCount: 5,
    lastTriggered: "2026-05-15",
  },
]

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>(initialWorkflows)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newWorkflow, setNewWorkflow] = useState({ name: "", description: "", trigger: "", actions: [] as string[] })

  const toggleWorkflow = (id: string) => {
    setWorkflows(workflows.map(w =>
      w.id === id ? { ...w, isActive: !w.isActive } : w
    ))
  }

  const deleteWorkflow = (id: string) => {
    setWorkflows(workflows.filter(w => w.id !== id))
  }

  const activeCount = workflows.filter(w => w.isActive).length
  const totalTriggers = workflows.reduce((sum, w) => sum + w.triggerCount, 0)

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Workflow Automation</h1>
          <p className="text-gray-500">Automate repetitive tasks with triggers and actions</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Workflow
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="bg-white border-[#E5E0D8] rounded-xl">
          <CardContent className="p-5">
            <div className="text-sm text-gray-500">Total Workflows</div>
            <div className="text-3xl font-bold">{workflows.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-[#E5E0D8] rounded-xl">
          <CardContent className="p-5">
            <div className="text-sm text-gray-500">Active</div>
            <div className="text-3xl font-bold text-emerald-400">{activeCount}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-[#E5E0D8] rounded-xl">
          <CardContent className="p-5">
            <div className="text-sm text-gray-500">Total Triggers</div>
            <div className="text-3xl font-bold text-violet-400">{totalTriggers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Workflows List */}
      <div className="space-y-4">
        {workflows.map((workflow) => (
          <Card key={workflow.id} className={`border-[#E5E0D8] rounded-xl transition-all ${
            workflow.isActive ? "bg-white/[0.02]" : "bg-gray-50 opacity-60"
          }`}>
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                  workflow.isActive ? "bg-emerald-500/20" : "bg-zinc-500/20"
                }`}>
                  {workflow.trigger.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold">{workflow.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      workflow.isActive
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-zinc-500/20 text-gray-500"
                    }`}>
                      {workflow.isActive ? "Active" : "Paused"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{workflow.description}</p>

                  {/* Workflow visualization */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <span>{workflow.trigger.icon}</span>
                      <span className="text-sm text-blue-400">{workflow.trigger.label}</span>
                    </div>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    {workflow.actions.map((action, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-lg">
                          <span>{action.icon}</span>
                          <span className="text-sm text-violet-400">{action.label}</span>
                        </div>
                        {i < workflow.actions.length - 1 && (
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16" />
                          </svg>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <span>Triggered {workflow.triggerCount} times</span>
                    {workflow.lastTriggered && (
                      <span>Last: {workflow.lastTriggered}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleWorkflow(workflow.id)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      workflow.isActive ? "bg-emerald-500" : "bg-gray-300"
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      workflow.isActive ? "left-7" : "left-1"
                    }`} />
                  </button>
                  <button
                    onClick={() => deleteWorkflow(workflow.id)}
                    className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {workflows.length === 0 && (
          <Card className="bg-white border-[#E5E0D8] rounded-xl">
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-3">⚡</div>
              <div className="text-gray-500 mb-4">No workflows yet</div>
              <Button onClick={() => setShowCreateModal(true)} className="bg-violet-600 hover:bg-violet-500">
                Create Your First Workflow
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Workflow Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-lg bg-white border-[#E5E0D8] rounded-2xl max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Create New Workflow</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Workflow Name</label>
                  <input
                    value={newWorkflow.name}
                    onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                    placeholder="e.g. Auto-Invoice on Signature"
                    className="w-full h-10 px-3 bg-gray-100 border border-[#E5E0D8] rounded-xl text-gray-900 placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Description</label>
                  <input
                    value={newWorkflow.description}
                    onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
                    placeholder="What does this workflow do?"
                    className="w-full h-10 px-3 bg-gray-100 border border-[#E5E0D8] rounded-xl text-gray-900 placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-2">Trigger (When this happens...)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {triggerTypes.map((t) => (
                      <button
                        key={t.type}
                        onClick={() => setNewWorkflow({ ...newWorkflow, trigger: t.type })}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-left text-sm transition-all ${
                          newWorkflow.trigger === t.type
                            ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
                            : "bg-gray-100 border-[#E5E0D8] text-gray-500 hover:border-gray-300"
                        }`}
                      >
                        <span>{t.icon}</span>
                        <span>{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-2">Actions (Do this...)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {actionTypes.map((a) => (
                      <button
                        key={a.type}
                        onClick={() => {
                          const actions = newWorkflow.actions.includes(a.type)
                            ? newWorkflow.actions.filter(x => x !== a.type)
                            : [...newWorkflow.actions, a.type]
                          setNewWorkflow({ ...newWorkflow, actions })
                        }}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-left text-sm transition-all ${
                          newWorkflow.actions.includes(a.type)
                            ? "bg-violet-500/20 border-violet-500/50 text-violet-400"
                            : "bg-gray-100 border-[#E5E0D8] text-gray-500 hover:border-gray-300"
                        }`}
                      >
                        <span>{a.icon}</span>
                        <span>{a.label}</span>
                      </button>
                    ))}
                  </div>
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
                    if (newWorkflow.name && newWorkflow.trigger && newWorkflow.actions.length > 0) {
                      const trigger = triggerTypes.find(t => t.type === newWorkflow.trigger)!
                      const actions = newWorkflow.actions.map(a => actionTypes.find(at => at.type === a)!)
                      const workflow: Workflow = {
                        id: Date.now().toString(),
                        name: newWorkflow.name,
                        description: newWorkflow.description,
                        trigger: { type: trigger.type, label: trigger.label, icon: trigger.icon },
                        actions: actions.map(a => ({ type: a.type, label: a.label, icon: a.icon })),
                        isActive: true,
                        triggerCount: 0,
                        lastTriggered: null,
                      }
                      setWorkflows([workflow, ...workflows])
                      setNewWorkflow({ name: "", description: "", trigger: "", actions: [] })
                      setShowCreateModal(false)
                    }
                  }}
                  className="flex-1 bg-violet-600 hover:bg-violet-500"
                >
                  Create Workflow
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Suggested Workflows */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Suggested Workflows</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              name: "Welcome New Clients",
              trigger: "contract_signed",
              actions: ["send_email", "add_calendar_event"],
              description: "Send welcome email and schedule kickoff call",
            },
            {
              name: "Follow Up on Views",
              trigger: "signature_viewed",
              actions: ["send_notification", "create_task"],
              description: "Notify when contract is viewed but not signed",
            },
            {
              name: "Payment Received",
              trigger: "invoice_paid",
              actions: ["send_email", "send_notification"],
              description: "Send thank you email when payment received",
            },
            {
              name: "Deal Progress",
              trigger: "deal_stage_changed",
              actions: ["send_notification", "update_deal"],
              description: "Track deal progress and update records",
            },
          ].map((suggestion, i) => (
            <Card key={i} className="bg-white border-[#E5E0D8] rounded-xl hover:border-[#E5E0D8] transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                    {triggerTypes.find(t => t.type === suggestion.trigger)?.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{suggestion.name}</h3>
                    <p className="text-sm text-gray-500">{suggestion.description}</p>
                  </div>
                  <Button size="sm" variant="outline" className="border-[#E5E0D8]">
                    Use
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
