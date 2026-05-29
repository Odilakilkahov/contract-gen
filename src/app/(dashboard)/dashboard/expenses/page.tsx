"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Expense {
  id: string
  date: string
  description: string
  amount: number
  category: string
  project: string
  receiptUrl: string | null
  billable: boolean
  taxDeductible: boolean
}

const categories = [
  { id: "equipment", name: "Equipment", icon: "📷" },
  { id: "software", name: "Software", icon: "💻" },
  { id: "travel", name: "Travel", icon: "✈️" },
  { id: "props", name: "Props & Materials", icon: "🎨" },
  { id: "studio", name: "Studio Rental", icon: "🏠" },
  { id: "talent", name: "Talent & Crew", icon: "👥" },
  { id: "marketing", name: "Marketing", icon: "📢" },
  { id: "other", name: "Other", icon: "📦" },
]

const initialExpenses: Expense[] = [
  { id: "1", date: "2026-05-28", description: "Ring light for studio", amount: 89, category: "equipment", project: "General", receiptUrl: null, billable: false, taxDeductible: true },
  { id: "2", date: "2026-05-25", description: "Adobe Creative Cloud - Monthly", amount: 55, category: "software", project: "General", receiptUrl: null, billable: false, taxDeductible: true },
  { id: "3", date: "2026-05-22", description: "Props for Nike shoot", amount: 150, category: "props", project: "Nike Campaign", receiptUrl: null, billable: true, taxDeductible: true },
  { id: "4", date: "2026-05-20", description: "Studio rental - 4 hours", amount: 200, category: "studio", project: "Nike Campaign", receiptUrl: null, billable: true, taxDeductible: true },
  { id: "5", date: "2026-05-15", description: "Uber to brand meeting", amount: 35, category: "travel", project: "Gymshark", receiptUrl: null, billable: true, taxDeductible: true },
]

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses)
  const [showAddModal, setShowAddModal] = useState(false)
  const [filter, setFilter] = useState<"all" | "billable" | "deductible">("all")
  const [newExpense, setNewExpense] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    amount: "",
    category: "other",
    project: "",
    billable: false,
    taxDeductible: true,
  })

  const filteredExpenses = expenses.filter(e => {
    if (filter === "billable") return e.billable
    if (filter === "deductible") return e.taxDeductible
    return true
  })

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const billableExpenses = expenses.filter(e => e.billable).reduce((sum, e) => sum + e.amount, 0)
  const deductibleExpenses = expenses.filter(e => e.taxDeductible).reduce((sum, e) => sum + e.amount, 0)

  const addExpense = () => {
    if (newExpense.description && newExpense.amount) {
      setExpenses([
        {
          id: Date.now().toString(),
          date: newExpense.date,
          description: newExpense.description,
          amount: parseFloat(newExpense.amount),
          category: newExpense.category,
          project: newExpense.project,
          receiptUrl: null,
          billable: newExpense.billable,
          taxDeductible: newExpense.taxDeductible,
        },
        ...expenses,
      ])
      setNewExpense({ date: new Date().toISOString().split("T")[0], description: "", amount: "", category: "other", project: "", billable: false, taxDeductible: true })
      setShowAddModal(false)
    }
  }

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id))
  }

  const expensesByCategory = categories.map(cat => ({
    ...cat,
    total: expenses.filter(e => e.category === cat.id).reduce((sum, e) => sum + e.amount, 0),
    count: expenses.filter(e => e.category === cat.id).length,
  })).filter(c => c.count > 0)

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Expenses</h1>
          <p className="text-gray-500">Track business expenses and receipts</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Expense
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white border-[#E5E0D8] rounded-xl">
          <CardContent className="p-5">
            <div className="text-sm text-gray-500">Total Expenses</div>
            <div className="text-3xl font-bold">${totalExpenses.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-[#E5E0D8] rounded-xl">
          <CardContent className="p-5">
            <div className="text-sm text-gray-500">Billable</div>
            <div className="text-3xl font-bold text-violet-400">${billableExpenses.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-[#E5E0D8] rounded-xl">
          <CardContent className="p-5">
            <div className="text-sm text-gray-500">Tax Deductible</div>
            <div className="text-3xl font-bold text-emerald-400">${deductibleExpenses.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-[#E5E0D8] rounded-xl">
          <CardContent className="p-5">
            <div className="text-sm text-gray-500">This Month</div>
            <div className="text-3xl font-bold">{expenses.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Expenses by Category */}
        <div>
          <h2 className="text-lg font-semibold mb-4">By Category</h2>
          <Card className="bg-white border-[#E5E0D8] rounded-xl">
            <CardContent className="p-4 space-y-3">
              {expensesByCategory.map((cat) => (
                <div key={cat.id} className="flex items-center gap-3">
                  <span className="text-xl">{cat.icon}</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{cat.name}</div>
                    <div className="text-xs text-gray-500">{cat.count} expenses</div>
                  </div>
                  <div className="font-semibold">${cat.total.toLocaleString()}</div>
                </div>
              ))}
              {expensesByCategory.length === 0 && (
                <div className="text-center text-gray-500 py-4">No expenses yet</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Expenses List */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Expenses</h2>
            <div className="flex gap-2">
              {[
                { key: "all", label: "All" },
                { key: "billable", label: "Billable" },
                { key: "deductible", label: "Deductible" },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key as typeof filter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filter === f.key
                      ? "bg-violet-500/20 text-violet-400"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <Card className="bg-white border-[#E5E0D8] rounded-xl overflow-hidden">
            <div className="divide-y divide-[#E5E0D8]">
              {filteredExpenses.map((expense) => {
                const cat = categories.find(c => c.id === expense.category)
                return (
                  <div key={expense.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xl">
                      {cat?.icon || "📦"}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium mb-1">{expense.description}</div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{new Date(expense.date).toLocaleDateString()}</span>
                        {expense.project && (
                          <>
                            <span>•</span>
                            <span>{expense.project}</span>
                          </>
                        )}
                        {expense.billable && (
                          <span className="px-2 py-0.5 bg-violet-500/20 text-violet-400 rounded-full text-xs">Billable</span>
                        )}
                        {expense.taxDeductible && (
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full text-xs">Deductible</span>
                        )}
                      </div>
                    </div>
                    <div className="font-semibold">${expense.amount.toLocaleString()}</div>
                    <button
                      onClick={() => deleteExpense(expense.id)}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )
              })}
              {filteredExpenses.length === 0 && (
                <div className="p-8 text-center">
                  <div className="text-4xl mb-3">💸</div>
                  <div className="text-gray-500">No expenses found</div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-white border-[#E5E0D8] rounded-2xl">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Add Expense</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Date</label>
                    <Input
                      type="date"
                      value={newExpense.date}
                      onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                      className="bg-gray-100 border-[#E5E0D8] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Amount ($)</label>
                    <Input
                      type="number"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                      placeholder="99.00"
                      className="bg-gray-100 border-[#E5E0D8] rounded-xl"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Description</label>
                  <Input
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                    placeholder="What was the expense for?"
                    className="bg-gray-100 border-[#E5E0D8] rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Category</label>
                    <select
                      value={newExpense.category}
                      onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                      className="w-full h-10 px-3 bg-gray-100 border border-[#E5E0D8] rounded-xl text-gray-900"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Project</label>
                    <Input
                      value={newExpense.project}
                      onChange={(e) => setNewExpense({ ...newExpense, project: e.target.value })}
                      placeholder="Nike Campaign"
                      className="bg-gray-100 border-[#E5E0D8] rounded-xl"
                    />
                  </div>
                </div>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newExpense.billable}
                      onChange={(e) => setNewExpense({ ...newExpense, billable: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 bg-gray-100 text-violet-500"
                    />
                    <span className="text-sm">Billable to client</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newExpense.taxDeductible}
                      onChange={(e) => setNewExpense({ ...newExpense, taxDeductible: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 bg-gray-100 text-violet-500"
                    />
                    <span className="text-sm">Tax deductible</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1 border-[#E5E0D8]">
                  Cancel
                </Button>
                <Button onClick={addExpense} className="flex-1 bg-violet-600 hover:bg-violet-500">
                  Add Expense
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
