"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Invoice {
  id: string
  contract: string
  brand: string
  amount: number
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
  issueDate: string
  dueDate: string
  paidDate?: string
  paymentMethod?: string
  notes?: string
}

const initialInvoices: Invoice[] = [
  { id: "INV-001", contract: "Nike Sponsored Post", brand: "Nike", amount: 2500, status: "paid", issueDate: "2026-05-01", dueDate: "2026-05-31", paidDate: "2026-05-15", paymentMethod: "Bank Transfer" },
  { id: "INV-002", contract: "Red Bull Event", brand: "Red Bull", amount: 8000, status: "paid", issueDate: "2026-04-15", dueDate: "2026-05-15", paidDate: "2026-05-10", paymentMethod: "PayPal" },
  { id: "INV-003", contract: "Gymshark Ambassador", brand: "Gymshark", amount: 5000, status: "sent", issueDate: "2026-05-20", dueDate: "2026-06-20" },
  { id: "INV-004", contract: "Audible Promo", brand: "Audible", amount: 1500, status: "overdue", issueDate: "2026-04-01", dueDate: "2026-05-01" },
  { id: "INV-005", contract: "Samsung Review", brand: "Samsung", amount: 3500, status: "draft", issueDate: "2026-05-28", dueDate: "2026-06-28" },
]

const statusConfig = {
  draft: { bg: "bg-zinc-500/20", text: "text-gray-500", label: "Draft" },
  sent: { bg: "bg-blue-500/20", text: "text-blue-400", label: "Sent" },
  paid: { bg: "bg-emerald-500/20", text: "text-emerald-400", label: "Paid" },
  overdue: { bg: "bg-red-500/20", text: "text-red-400", label: "Overdue" },
  cancelled: { bg: "bg-zinc-500/20", text: "text-gray-500", label: "Cancelled" },
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices)
  const [filter, setFilter] = useState<"all" | "pending" | "paid" | "overdue">("all")
  const [showPaymentModal, setShowPaymentModal] = useState<string | null>(null)
  const [showNewInvoice, setShowNewInvoice] = useState(false)
  const [paymentDetails, setPaymentDetails] = useState({ method: "Bank Transfer", date: "", notes: "" })
  const [newInvoice, setNewInvoice] = useState({ contract: "", brand: "", amount: "", dueDate: "" })

  const filteredInvoices = invoices.filter(inv => {
    if (filter === "all") return true
    if (filter === "pending") return inv.status === "sent" || inv.status === "draft"
    if (filter === "paid") return inv.status === "paid"
    if (filter === "overdue") return inv.status === "overdue"
    return true
  })

  const totalEarned = invoices.filter(i => i.status === "paid").reduce((sum, i) => sum + i.amount, 0)
  const totalPending = invoices.filter(i => i.status === "sent" || i.status === "overdue").reduce((sum, i) => sum + i.amount, 0)
  const totalOverdue = invoices.filter(i => i.status === "overdue").reduce((sum, i) => sum + i.amount, 0)

  const markAsPaid = (id: string) => {
    setInvoices(invoices.map(inv =>
      inv.id === id
        ? { ...inv, status: "paid" as const, paidDate: paymentDetails.date || new Date().toISOString().split("T")[0], paymentMethod: paymentDetails.method, notes: paymentDetails.notes }
        : inv
    ))
    setShowPaymentModal(null)
    setPaymentDetails({ method: "Bank Transfer", date: "", notes: "" })
  }

  const sendInvoice = (id: string) => {
    setInvoices(invoices.map(inv =>
      inv.id === id ? { ...inv, status: "sent" as const } : inv
    ))
  }

  const sendReminder = (id: string) => {
    alert(`Reminder sent for invoice ${id}!`)
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Invoices & Payments</h1>
          <p className="text-gray-500">Track payments and manage invoices</p>
        </div>
        <Button
          onClick={() => setShowNewInvoice(true)}
          className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Invoice
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white border-[#E5E0D8] rounded-xl">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-400">${totalEarned.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Total Earned</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-[#E5E0D8] rounded-xl">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-400">${totalPending.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-[#E5E0D8] rounded-xl">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">${totalOverdue.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Overdue</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-[#E5E0D8] rounded-xl">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold">{invoices.length}</div>
                <div className="text-xs text-gray-500">Total Invoices</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "all", label: "All" },
          { key: "pending", label: "Pending" },
          { key: "paid", label: "Paid" },
          { key: "overdue", label: "Overdue" },
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

      {/* Invoices List */}
      <Card className="bg-white border-[#E5E0D8] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E0D8]">
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-4">Invoice</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-4">Brand</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-4">Amount</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-4">Status</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-4">Due Date</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredInvoices.map((invoice) => {
                const status = statusConfig[invoice.status]
                const isOverdue = new Date(invoice.dueDate) < new Date() && invoice.status === "sent"

                return (
                  <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium">{invoice.id}</div>
                      <div className="text-sm text-gray-500">{invoice.contract}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{invoice.brand}</td>
                    <td className="px-6 py-4">
                      <span className="font-semibold">${invoice.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.text.replace("text-", "bg-")}`} />
                        {isOverdue ? "Overdue" : status.label}
                      </span>
                      {invoice.paidDate && (
                        <div className="text-xs text-gray-500 mt-1">
                          Paid {invoice.paidDate} via {invoice.paymentMethod}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(invoice.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        {invoice.status === "draft" && (
                          <Button
                            size="sm"
                            onClick={() => sendInvoice(invoice.id)}
                            className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                          >
                            Send
                          </Button>
                        )}
                        {(invoice.status === "sent" || invoice.status === "overdue") && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => sendReminder(invoice.id)}
                              className="border-[#E5E0D8] text-gray-500"
                            >
                              Remind
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => setShowPaymentModal(invoice.id)}
                              className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                            >
                              Mark Paid
                            </Button>
                          </>
                        )}
                        {invoice.status === "paid" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#E5E0D8] text-gray-500"
                          >
                            Download
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-white border-[#E5E0D8] rounded-2xl">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Record Payment</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Payment Method</label>
                  <select
                    value={paymentDetails.method}
                    onChange={(e) => setPaymentDetails({ ...paymentDetails, method: e.target.value })}
                    className="w-full h-10 px-3 bg-gray-100 border border-[#E5E0D8] rounded-xl text-gray-900"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Stripe">Stripe</option>
                    <option value="Wire Transfer">Wire Transfer</option>
                    <option value="Check">Check</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Payment Date</label>
                  <Input
                    type="date"
                    value={paymentDetails.date}
                    onChange={(e) => setPaymentDetails({ ...paymentDetails, date: e.target.value })}
                    className="bg-gray-100 border-[#E5E0D8] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Notes (optional)</label>
                  <Input
                    value={paymentDetails.notes}
                    onChange={(e) => setPaymentDetails({ ...paymentDetails, notes: e.target.value })}
                    placeholder="Transaction ID, reference, etc."
                    className="bg-gray-100 border-[#E5E0D8] rounded-xl"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowPaymentModal(null)}
                  className="flex-1 border-[#E5E0D8]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => markAsPaid(showPaymentModal)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500"
                >
                  Confirm Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* New Invoice Modal */}
      {showNewInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-white border-[#E5E0D8] rounded-2xl">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Create New Invoice</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Contract/Project Name</label>
                  <Input
                    value={newInvoice.contract}
                    onChange={(e) => setNewInvoice({ ...newInvoice, contract: e.target.value })}
                    placeholder="e.g. Nike Summer Campaign"
                    className="bg-gray-100 border-[#E5E0D8] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Brand/Client</label>
                  <Input
                    value={newInvoice.brand}
                    onChange={(e) => setNewInvoice({ ...newInvoice, brand: e.target.value })}
                    placeholder="e.g. Nike"
                    className="bg-gray-100 border-[#E5E0D8] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Amount ($)</label>
                  <Input
                    type="number"
                    value={newInvoice.amount}
                    onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                    placeholder="2500"
                    className="bg-gray-100 border-[#E5E0D8] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Due Date</label>
                  <Input
                    type="date"
                    value={newInvoice.dueDate}
                    onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
                    className="bg-gray-100 border-[#E5E0D8] rounded-xl"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowNewInvoice(false)}
                  className="flex-1 border-[#E5E0D8]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (newInvoice.contract && newInvoice.brand && newInvoice.amount) {
                      const invoice: Invoice = {
                        id: `INV-${String(invoices.length + 1).padStart(3, '0')}`,
                        contract: newInvoice.contract,
                        brand: newInvoice.brand,
                        amount: parseInt(newInvoice.amount),
                        status: "draft",
                        issueDate: new Date().toISOString().split("T")[0],
                        dueDate: newInvoice.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                      }
                      setInvoices([invoice, ...invoices])
                      setNewInvoice({ contract: "", brand: "", amount: "", dueDate: "" })
                      setShowNewInvoice(false)
                    }
                  }}
                  className="flex-1 bg-violet-600 hover:bg-violet-500"
                >
                  Create Invoice
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Overdue Alert */}
      {totalOverdue > 0 && (
        <Card className="mt-6 bg-red-500/10 border-red-500/20 rounded-xl">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="font-medium text-red-400">You have overdue invoices</div>
              <div className="text-sm text-gray-500">
                ${totalOverdue.toLocaleString()} is past due. Send reminders to collect payments.
              </div>
            </div>
            <Button className="bg-red-500/20 text-red-400 hover:bg-red-500/30">
              Send All Reminders
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
