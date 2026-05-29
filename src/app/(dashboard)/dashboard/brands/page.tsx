"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Brand {
  id: string
  name: string
  website: string
  industry: string
  contactName: string
  contactEmail: string
  contactRole: string
  notes: string
  tags: string[]
  lastContacted: string | null
  dealsCount: number
  totalValue: number
}

const initialBrands: Brand[] = [
  { id: "1", name: "Nike", website: "nike.com", industry: "Sports & Fitness", contactName: "Sarah Johnson", contactEmail: "sarah@nike.com", contactRole: "Influencer Manager", notes: "Great to work with, quick payments", tags: ["sportswear", "premium"], lastContacted: "2026-05-20", dealsCount: 3, totalValue: 15000 },
  { id: "2", name: "Gymshark", website: "gymshark.com", industry: "Fitness Apparel", contactName: "Mike Chen", contactEmail: "mike@gymshark.com", contactRole: "Brand Partnerships", notes: "Looking for long-term ambassadors", tags: ["fitness", "apparel"], lastContacted: "2026-05-25", dealsCount: 1, totalValue: 5000 },
  { id: "3", name: "Audible", website: "audible.com", industry: "Entertainment", contactName: "Emily Brown", contactEmail: "emily@audible.com", contactRole: "Creator Relations", notes: "", tags: ["tech", "entertainment"], lastContacted: "2026-05-15", dealsCount: 2, totalValue: 4000 },
  { id: "4", name: "Samsung", website: "samsung.com", industry: "Technology", contactName: "John Park", contactEmail: "john.park@samsung.com", contactRole: "Influencer Marketing", notes: "Prefers long-form content", tags: ["tech", "premium"], lastContacted: null, dealsCount: 0, totalValue: 0 },
]

const industries = ["Sports & Fitness", "Technology", "Beauty", "Fashion", "Food & Beverage", "Entertainment", "Finance", "Travel", "Gaming", "Health"]

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>(initialBrands)
  const [search, setSearch] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
  const [newBrand, setNewBrand] = useState({
    name: "",
    website: "",
    industry: "",
    contactName: "",
    contactEmail: "",
    contactRole: "",
    notes: "",
    tags: "",
  })

  const filteredBrands = brands.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.industry.toLowerCase().includes(search.toLowerCase()) ||
    b.contactName.toLowerCase().includes(search.toLowerCase())
  )

  const addBrand = () => {
    if (newBrand.name) {
      setBrands([
        ...brands,
        {
          id: Date.now().toString(),
          ...newBrand,
          tags: newBrand.tags.split(",").map(t => t.trim()).filter(Boolean),
          lastContacted: null,
          dealsCount: 0,
          totalValue: 0,
        },
      ])
      setNewBrand({ name: "", website: "", industry: "", contactName: "", contactEmail: "", contactRole: "", notes: "", tags: "" })
      setShowAddModal(false)
    }
  }

  const deleteBrand = (id: string) => {
    setBrands(brands.filter(b => b.id !== id))
    setSelectedBrand(null)
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Brand CRM</h1>
          <p className="text-gray-500">Manage your brand contacts and relationships</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Brand
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white border-[#E5E0D8] rounded-xl">
          <CardContent className="p-5">
            <div className="text-sm text-gray-500">Total Brands</div>
            <div className="text-3xl font-bold">{brands.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-[#E5E0D8] rounded-xl">
          <CardContent className="p-5">
            <div className="text-sm text-gray-500">Active Deals</div>
            <div className="text-3xl font-bold text-violet-400">{brands.filter(b => b.dealsCount > 0).length}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-[#E5E0D8] rounded-xl">
          <CardContent className="p-5">
            <div className="text-sm text-gray-500">Total Revenue</div>
            <div className="text-3xl font-bold text-emerald-400">${brands.reduce((sum, b) => sum + b.totalValue, 0).toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-[#E5E0D8] rounded-xl">
          <CardContent className="p-5">
            <div className="text-sm text-gray-500">Avg Deal Value</div>
            <div className="text-3xl font-bold">
              ${Math.round(brands.reduce((sum, b) => sum + b.totalValue, 0) / Math.max(brands.reduce((sum, b) => sum + b.dealsCount, 0), 1)).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          placeholder="Search brands, contacts, industries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md bg-gray-100 border-[#E5E0D8] rounded-xl"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Brands List */}
        <div className="lg:col-span-2">
          <div className="grid gap-3">
            {filteredBrands.map((brand) => (
              <Card
                key={brand.id}
                onClick={() => setSelectedBrand(brand)}
                className={`bg-white border-[#E5E0D8] rounded-xl cursor-pointer transition-all hover:border-gray-300 ${
                  selectedBrand?.id === brand.id ? "border-violet-500/50 bg-violet-500/5" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center text-xl font-bold flex-shrink-0">
                      {brand.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{brand.name}</h3>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-500">{brand.industry}</span>
                      </div>
                      <div className="text-sm text-gray-500">{brand.contactName} • {brand.contactEmail}</div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>{brand.dealsCount} deals</span>
                        <span>${brand.totalValue.toLocaleString()} total</span>
                        {brand.lastContacted && (
                          <span>Last contact: {new Date(brand.lastContacted).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredBrands.length === 0 && (
              <Card className="bg-white border-[#E5E0D8] rounded-xl">
                <CardContent className="p-8 text-center">
                  <div className="text-4xl mb-3">🏢</div>
                  <div className="text-gray-500">No brands found</div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Brand Details */}
        <div>
          {selectedBrand ? (
            <Card className="bg-white border-[#E5E0D8] rounded-xl sticky top-8">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">{selectedBrand.name}</h2>
                  <button
                    onClick={() => deleteBrand(selectedBrand.id)}
                    className="text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Website</label>
                    <a href={`https://${selectedBrand.website}`} target="_blank" className="text-violet-400 hover:underline">
                      {selectedBrand.website}
                    </a>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Industry</label>
                    <div>{selectedBrand.industry}</div>
                  </div>

                  <div className="border-t border-[#E5E0D8] pt-4">
                    <label className="text-xs text-gray-500 block mb-2">Contact</label>
                    <div className="font-medium">{selectedBrand.contactName}</div>
                    <div className="text-sm text-gray-500">{selectedBrand.contactRole}</div>
                    <div className="text-sm text-violet-400">{selectedBrand.contactEmail}</div>
                  </div>

                  {selectedBrand.tags.length > 0 && (
                    <div>
                      <label className="text-xs text-gray-500 block mb-2">Tags</label>
                      <div className="flex flex-wrap gap-2">
                        {selectedBrand.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 rounded-lg text-xs">{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedBrand.notes && (
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Notes</label>
                      <div className="text-sm text-gray-700">{selectedBrand.notes}</div>
                    </div>
                  )}

                  <div className="border-t border-[#E5E0D8] pt-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 bg-gray-100 rounded-xl">
                        <div className="text-2xl font-bold">{selectedBrand.dealsCount}</div>
                        <div className="text-xs text-gray-500">Deals</div>
                      </div>
                      <div className="p-3 bg-gray-100 rounded-xl">
                        <div className="text-2xl font-bold text-emerald-400">${selectedBrand.totalValue.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Total Value</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1 bg-violet-600 hover:bg-violet-500">
                      Create Deal
                    </Button>
                    <Button variant="outline" className="border-[#E5E0D8]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white border-[#E5E0D8] rounded-xl">
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-3">👈</div>
                <div className="text-gray-500">Select a brand to view details</div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Add Brand Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-lg bg-white border-[#E5E0D8] rounded-2xl max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Add New Brand</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Brand Name *</label>
                    <Input
                      value={newBrand.name}
                      onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
                      placeholder="Nike"
                      className="bg-gray-100 border-[#E5E0D8] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Website</label>
                    <Input
                      value={newBrand.website}
                      onChange={(e) => setNewBrand({ ...newBrand, website: e.target.value })}
                      placeholder="nike.com"
                      className="bg-gray-100 border-[#E5E0D8] rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-500 mb-1">Industry</label>
                  <select
                    value={newBrand.industry}
                    onChange={(e) => setNewBrand({ ...newBrand, industry: e.target.value })}
                    className="w-full h-10 px-3 bg-gray-100 border border-[#E5E0D8] rounded-xl text-gray-900"
                  >
                    <option value="">Select industry...</option>
                    {industries.map((ind) => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>

                <div className="border-t border-[#E5E0D8] pt-4">
                  <h3 className="text-sm font-medium mb-3">Contact Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Contact Name</label>
                      <Input
                        value={newBrand.contactName}
                        onChange={(e) => setNewBrand({ ...newBrand, contactName: e.target.value })}
                        placeholder="Sarah Johnson"
                        className="bg-gray-100 border-[#E5E0D8] rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Role</label>
                      <Input
                        value={newBrand.contactRole}
                        onChange={(e) => setNewBrand({ ...newBrand, contactRole: e.target.value })}
                        placeholder="Influencer Manager"
                        className="bg-gray-100 border-[#E5E0D8] rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm text-gray-500 mb-1">Email</label>
                    <Input
                      type="email"
                      value={newBrand.contactEmail}
                      onChange={(e) => setNewBrand({ ...newBrand, contactEmail: e.target.value })}
                      placeholder="sarah@nike.com"
                      className="bg-gray-100 border-[#E5E0D8] rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-500 mb-1">Tags (comma separated)</label>
                  <Input
                    value={newBrand.tags}
                    onChange={(e) => setNewBrand({ ...newBrand, tags: e.target.value })}
                    placeholder="sportswear, premium, fashion"
                    className="bg-gray-100 border-[#E5E0D8] rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-500 mb-1">Notes</label>
                  <textarea
                    value={newBrand.notes}
                    onChange={(e) => setNewBrand({ ...newBrand, notes: e.target.value })}
                    placeholder="Any notes about this brand..."
                    rows={3}
                    className="w-full bg-gray-100 border border-[#E5E0D8] rounded-xl p-3 text-gray-900 placeholder:text-gray-500 resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1 border-[#E5E0D8]">
                  Cancel
                </Button>
                <Button onClick={addBrand} className="flex-1 bg-violet-600 hover:bg-violet-500">
                  Add Brand
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
