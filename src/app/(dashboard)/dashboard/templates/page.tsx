"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CONTRACT_TEMPLATES } from "@/lib/store"

interface Template {
  id: string
  name: string
  description: string
  icon: string
  category: string
  fields: readonly string[]
  content?: string
}

const categories = [
  { id: "all", name: "All Templates" },
  { id: "social", name: "Social Media" },
  { id: "partnership", name: "Partnerships" },
  { id: "content", name: "Content" },
  { id: "affiliate", name: "Affiliate" },
  { id: "legal", name: "Legal" },
]

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)
  const [showComingSoon, setShowComingSoon] = useState(false)

  const filteredTemplates = selectedCategory === "all"
    ? CONTRACT_TEMPLATES
    : CONTRACT_TEMPLATES.filter(t => t.category === selectedCategory)

  const handleCreateTemplate = () => {
    setShowComingSoon(true)
    setTimeout(() => setShowComingSoon(false), 3000)
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Contract Templates</h1>
          <p className="text-gray-500">Choose from 15+ professionally crafted templates</p>
        </div>
        <Button
          variant="outline"
          className="border-[#E5E0D8] text-gray-700"
          onClick={handleCreateTemplate}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Custom Template
        </Button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat.id
                ? "bg-violet-100 text-violet-700"
                : "bg-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-200"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            className="bg-white border-[#E5E0D8] hover:border-violet-500/50 transition-all group"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-2xl">
                  {template.icon}
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 capitalize">
                  {template.category}
                </span>
              </div>

              <h3 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-violet-600 transition-colors">
                {template.name}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {template.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {template.fields.slice(0, 4).map((field) => (
                  <span
                    key={field}
                    className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-500 capitalize"
                  >
                    {field.replace("_", " ")}
                  </span>
                ))}
                {template.fields.length > 4 && (
                  <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-500">
                    +{template.fields.length - 4} more
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <Link href={`/dashboard/contracts/new?template=${template.id}`} className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-700 hover:to-fuchsia-600">
                    Use Template
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="border-[#E5E0D8] text-gray-500 hover:text-gray-900"
                  onClick={() => setPreviewTemplate(template as Template)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pro Templates Banner */}
      <Card className="mt-8 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border-violet-500/20">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold mb-1 text-gray-900">Unlock Pro Templates</h3>
              <p className="text-sm text-gray-500">
                Get access to advanced templates with AI clause suggestions and custom branding
              </p>
            </div>
          </div>
          <Link href="/dashboard/pricing">
            <Button className="bg-violet-600 text-white hover:bg-violet-700">
              Upgrade to Pro
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Preview Modal */}
      {previewTemplate && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setPreviewTemplate(null)}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-xl">
                  {previewTemplate.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{previewTemplate.name}</h2>
                  <span className="text-sm text-gray-500 capitalize">{previewTemplate.category}</span>
                </div>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-gray-600 mb-4">{previewTemplate.description}</p>

            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Included Fields:</h3>
              <div className="flex flex-wrap gap-2">
                {previewTemplate.fields.map((field) => (
                  <span
                    key={field}
                    className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-600 capitalize"
                  >
                    {field.replace("_", " ")}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Template Preview:</h3>
              <p className="text-sm text-gray-500">
                This template includes professionally written clauses covering all standard terms
                for {previewTemplate.category} contracts. Fields will be auto-populated based on
                your input during contract creation.
              </p>
            </div>

            <div className="flex gap-3">
              <Link href={`/dashboard/contracts/new?template=${previewTemplate.id}`} className="flex-1">
                <Button className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-700 hover:to-fuchsia-600">
                  Use This Template
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => setPreviewTemplate(null)}
                className="border-[#E5E0D8]"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Coming Soon Toast */}
      {showComingSoon && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50">
          <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-medium">Coming Soon</p>
            <p className="text-sm text-gray-400">Custom template creation is under development.</p>
          </div>
        </div>
      )}
    </div>
  )
}
