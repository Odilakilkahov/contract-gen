"use client"

import { useState, Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { CONTRACT_TEMPLATES, useAppStore } from "@/lib/store"
import { useUsageStore, getPlanName } from "@/lib/usage-store"

const STEPS = [
  { id: 1, name: "Template", description: "Choose contract type" },
  { id: 2, name: "Details", description: "Fill in the specifics" },
  { id: 3, name: "Review", description: "Review and generate" },
]

function NewContractContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const addContract = useAppStore((state) => state.addContract)

  // Usage tracking
  const {
    canCreateContract,
    contractsThisMonth,
    getLimit,
    incrementUsage,
    plan,
    getUsagePercentage,
    resetIfNewMonth
  } = useUsageStore()

  // Reset if new month on component mount
  useEffect(() => {
    resetIfNewMonth()
  }, [])

  const preselectedTemplate = searchParams.get("template")
  const [currentStep, setCurrentStep] = useState(preselectedTemplate ? 2 : 1)
  const [selectedTemplate, setSelectedTemplate] = useState(
    CONTRACT_TEMPLATES.find((t) => t.id === preselectedTemplate) || null
  )
  const [isGenerating, setIsGenerating] = useState(false)

  const [formData, setFormData] = useState({
    // Parties
    creatorName: "",
    creatorEmail: "",
    brandName: "",
    brandContact: "",
    brandEmail: "",

    // Deal Terms
    platform: "instagram",
    deliverables: "",
    compensation: "",
    paymentTerms: "net30",

    // Timeline
    startDate: "",
    endDate: "",
    contentDeadline: "",

    // Rights
    exclusivity: "none",
    usageRights: "social_only",
    usageDuration: "1_year",

    // Additional
    revisions: "2",
    disclosureRequirements: true,
    notes: "",
  })

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.brandName?.trim()) {
      errors.brandName = "Название бренда обязательно"
    }
    if (!formData.creatorName?.trim()) {
      errors.creatorName = "Имя инфлюенсера обязательно"
    }
    if (!formData.compensation || parseFloat(formData.compensation.replace(/[^0-9.-]/g, '')) <= 0) {
      errors.compensation = "Укажите корректную сумму"
    }
    if (!formData.deliverables?.trim() || formData.deliverables.length < 10) {
      errors.deliverables = "Опишите deliverables подробнее (минимум 10 символов)"
    }
    if (!formData.contentDeadline) {
      errors.contentDeadline = "Укажите дедлайн"
    }
    if (formData.creatorEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.creatorEmail)) {
      errors.creatorEmail = "Некорректный email"
    }
    if (formData.brandEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.brandEmail)) {
      errors.brandEmail = "Некорректный email"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleTemplateSelect = (template: typeof CONTRACT_TEMPLATES[number]) => {
    setSelectedTemplate(template)
    setCurrentStep(2)
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleGenerate = async () => {
    setIsGenerating(true)

    try {
      // Call AI generation API
      const response = await fetch("/api/generate-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: selectedTemplate?.id,
          ...formData,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to generate contract")
      }

      const newContract = {
        id: Date.now().toString(),
        title: `${formData.brandName} ${selectedTemplate?.name || "Contract"}`,
        type: selectedTemplate?.id || "custom",
        status: "draft" as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        parties: {
          creator: formData.creatorName,
          brand: formData.brandName,
        },
        content: data.contract,
      }

      addContract(newContract)

      // Increment usage counter
      incrementUsage()

      // Store in localStorage for the detail page
      localStorage.setItem(`contract_${newContract.id}`, JSON.stringify(newContract))

      router.push(`/dashboard/contracts/${newContract.id}`)
    } catch (error) {
      console.error("Generation error:", error)
      alert("Failed to generate contract. Please try again.")
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FDF9F3]">
      {/* Header */}
      <div className="border-b border-[#E5E0D8] bg-[#FDF9F3]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-lg font-semibold">New Contract</h1>
                <p className="text-sm text-gray-500">
                  {selectedTemplate ? selectedTemplate.name : "Select a template to get started"}
                </p>
              </div>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center gap-2">
              {STEPS.map((step, i) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      currentStep >= step.id
                        ? "bg-purple-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      step.id
                    )}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`w-12 h-0.5 mx-1 ${currentStep > step.id ? "bg-purple-500" : "bg-gray-200"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Usage Limit Exceeded */}
        {!canCreateContract() && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center mb-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Monthly Limit Reached
            </h3>
            <p className="text-red-600 mb-4">
              You have used all {getLimit()} free contracts this month. Upgrade to create unlimited contracts.
            </p>
            <Link href="/dashboard/pricing">
              <Button className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 text-white px-8">
                Upgrade to Unlimited
              </Button>
            </Link>
          </div>
        )}

        {/* Usage Banner for Free Plan */}
        {plan === "free" && canCreateContract() && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-blue-800">
                  {contractsThisMonth} of {getLimit()} contracts used this month
                </p>
                <p className="text-sm text-blue-600">
                  Limit resets on the 1st of each month
                </p>
              </div>
              <Link href="/dashboard/pricing">
                <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                  Upgrade
                </Button>
              </Link>
            </div>
            {/* Progress bar */}
            <div className="mt-3 h-2 bg-blue-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${getUsagePercentage()}%` }}
              />
            </div>
          </div>
        )}

        {/* Step 1: Template Selection */}
        {currentStep === 1 && canCreateContract() && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Choose a Template</h2>
              <p className="text-gray-500">Select the type of contract that best fits your deal</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {CONTRACT_TEMPLATES.map((template) => (
                <Card
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className={`bg-white border-[#E5E0D8] hover:border-purple-500/50 cursor-pointer transition-all ${
                    selectedTemplate?.id === template.id ? "border-purple-500 ring-1 ring-purple-500" : ""
                  }`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{template.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{template.name}</h3>
                        <p className="text-sm text-gray-500">{template.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Contract Details */}
        {currentStep === 2 && canCreateContract() && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Contract Details</h2>
              <p className="text-gray-500">Fill in the specifics of your {selectedTemplate?.name.toLowerCase()}</p>
            </div>

            {/* Legal Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-amber-800">Важное уведомление</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    Контракты генерируются с помощью AI и не являются юридической консультацией.
                    Рекомендуем проверить документ у квалифицированного юриста перед подписанием.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {/* Parties Section */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs">1</span>
                  Parties
                </h3>
                <div className="grid grid-cols-2 gap-6 p-4 rounded-xl bg-gray-50 border border-[#E5E0D8]">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-500">Creator (You)</h4>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5">Full Name *</label>
                      <Input
                        value={formData.creatorName}
                        onChange={(e) => handleInputChange("creatorName", e.target.value)}
                        placeholder="John Doe"
                        className={`bg-gray-100 border-[#E5E0D8] ${validationErrors.creatorName ? "border-red-500" : ""}`}
                      />
                      {validationErrors.creatorName && (
                        <p className="text-xs text-red-500 mt-1">{validationErrors.creatorName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5">Email</label>
                      <Input
                        type="email"
                        value={formData.creatorEmail}
                        onChange={(e) => handleInputChange("creatorEmail", e.target.value)}
                        placeholder="john@example.com"
                        className={`bg-gray-100 border-[#E5E0D8] ${validationErrors.creatorEmail ? "border-red-500" : ""}`}
                      />
                      {validationErrors.creatorEmail && (
                        <p className="text-xs text-red-500 mt-1">{validationErrors.creatorEmail}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-500">Brand</h4>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5">Company Name *</label>
                      <Input
                        value={formData.brandName}
                        onChange={(e) => handleInputChange("brandName", e.target.value)}
                        placeholder="Nike, Inc."
                        className={`bg-gray-100 border-[#E5E0D8] ${validationErrors.brandName ? "border-red-500" : ""}`}
                      />
                      {validationErrors.brandName && (
                        <p className="text-xs text-red-500 mt-1">{validationErrors.brandName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5">Contact Email</label>
                      <Input
                        type="email"
                        value={formData.brandEmail}
                        onChange={(e) => handleInputChange("brandEmail", e.target.value)}
                        placeholder="partnerships@nike.com"
                        className={`bg-gray-100 border-[#E5E0D8] ${validationErrors.brandEmail ? "border-red-500" : ""}`}
                      />
                      {validationErrors.brandEmail && (
                        <p className="text-xs text-red-500 mt-1">{validationErrors.brandEmail}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Deal Terms Section */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs">2</span>
                  Deal Terms
                </h3>
                <div className="p-4 rounded-xl bg-gray-50 border border-[#E5E0D8] space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5">Platform</label>
                      <select
                        value={formData.platform}
                        onChange={(e) => handleInputChange("platform", e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-gray-100 border border-[#E5E0D8] text-gray-900 text-sm"
                      >
                        <option value="instagram">Instagram</option>
                        <option value="tiktok">TikTok</option>
                        <option value="youtube">YouTube</option>
                        <option value="twitter">Twitter/X</option>
                        <option value="multiple">Multiple Platforms</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5">Compensation *</label>
                      <Input
                        value={formData.compensation}
                        onChange={(e) => handleInputChange("compensation", e.target.value)}
                        placeholder="$2,500"
                        className={`bg-gray-100 border-[#E5E0D8] ${validationErrors.compensation ? "border-red-500" : ""}`}
                      />
                      {validationErrors.compensation && (
                        <p className="text-xs text-red-500 mt-1">{validationErrors.compensation}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5">Deliverables *</label>
                    <textarea
                      value={formData.deliverables}
                      onChange={(e) => handleInputChange("deliverables", e.target.value)}
                      placeholder="1 Instagram Reel, 3 Instagram Stories, 1 static feed post..."
                      rows={3}
                      className={`w-full px-3 py-2 rounded-lg bg-gray-100 border text-gray-900 text-sm placeholder:text-gray-500 resize-none ${validationErrors.deliverables ? "border-red-500" : "border-[#E5E0D8]"}`}
                    />
                    {validationErrors.deliverables && (
                      <p className="text-xs text-red-500 mt-1">{validationErrors.deliverables}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5">Payment Terms</label>
                      <select
                        value={formData.paymentTerms}
                        onChange={(e) => handleInputChange("paymentTerms", e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-gray-100 border border-[#E5E0D8] text-gray-900 text-sm"
                      >
                        <option value="upfront">100% Upfront</option>
                        <option value="50_50">50% Upfront / 50% on Delivery</option>
                        <option value="net15">Net 15</option>
                        <option value="net30">Net 30</option>
                        <option value="net60">Net 60</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5">Revisions Allowed</label>
                      <select
                        value={formData.revisions}
                        onChange={(e) => handleInputChange("revisions", e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-gray-100 border border-[#E5E0D8] text-gray-900 text-sm"
                      >
                        <option value="0">No revisions</option>
                        <option value="1">1 revision</option>
                        <option value="2">2 revisions</option>
                        <option value="3">3 revisions</option>
                        <option value="unlimited">Unlimited</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline Section */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs">3</span>
                  Timeline
                </h3>
                <div className="p-4 rounded-xl bg-gray-50 border border-[#E5E0D8]">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5">Start Date</label>
                      <Input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange("startDate", e.target.value)}
                        className="bg-gray-100 border-[#E5E0D8]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5">Content Deadline *</label>
                      <Input
                        type="date"
                        value={formData.contentDeadline}
                        onChange={(e) => handleInputChange("contentDeadline", e.target.value)}
                        className={`bg-gray-100 border-[#E5E0D8] ${validationErrors.contentDeadline ? "border-red-500" : ""}`}
                      />
                      {validationErrors.contentDeadline && (
                        <p className="text-xs text-red-500 mt-1">{validationErrors.contentDeadline}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5">End Date</label>
                      <Input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange("endDate", e.target.value)}
                        className="bg-gray-100 border-[#E5E0D8]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Rights & Exclusivity */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs">4</span>
                  Rights & Exclusivity
                </h3>
                <div className="p-4 rounded-xl bg-gray-50 border border-[#E5E0D8]">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5">Exclusivity</label>
                      <select
                        value={formData.exclusivity}
                        onChange={(e) => handleInputChange("exclusivity", e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-gray-100 border border-[#E5E0D8] text-gray-900 text-sm"
                      >
                        <option value="none">No exclusivity</option>
                        <option value="category">Category exclusive</option>
                        <option value="full">Full exclusivity</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5">Usage Rights</label>
                      <select
                        value={formData.usageRights}
                        onChange={(e) => handleInputChange("usageRights", e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-gray-100 border border-[#E5E0D8] text-gray-900 text-sm"
                      >
                        <option value="social_only">Social media only</option>
                        <option value="digital">All digital</option>
                        <option value="all">All media (incl. print/TV)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5">Usage Duration</label>
                      <select
                        value={formData.usageDuration}
                        onChange={(e) => handleInputChange("usageDuration", e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-gray-100 border border-[#E5E0D8] text-gray-900 text-sm"
                      >
                        <option value="campaign">Campaign duration only</option>
                        <option value="6_months">6 months</option>
                        <option value="1_year">1 year</option>
                        <option value="perpetual">Perpetual</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* FTC Disclosure */}
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-400 mb-1">FTC Disclosure Included</h4>
                    <p className="text-sm text-gray-500">
                      Your contract will automatically include required FTC disclosure clauses (#ad, #sponsored) to keep you compliant and avoid $43K+ penalties.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(1)}
                className="border-[#E5E0D8] text-gray-700 hover:bg-gray-100"
              >
                Back
              </Button>
              <Button
                onClick={() => {
                  if (validateForm()) {
                    setCurrentStep(3)
                  }
                }}
                className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600"
              >
                Continue to Review
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Generate */}
        {currentStep === 3 && canCreateContract() && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Review & Generate</h2>
              <p className="text-gray-500">Review your contract details before AI generates the document</p>
            </div>

            <Card className="bg-white border-[#E5E0D8] mb-6">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#E5E0D8]">
                  <div className="text-4xl">{selectedTemplate?.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold">{formData.brandName} {selectedTemplate?.name}</h3>
                    <p className="text-gray-500">{formData.creatorName} × {formData.brandName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                  <div>
                    <span className="text-gray-500">Platform:</span>
                    <span className="ml-2 capitalize">{formData.platform}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Compensation:</span>
                    <span className="ml-2">{formData.compensation || "Not specified"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Payment Terms:</span>
                    <span className="ml-2">{formData.paymentTerms.replace("_", " ").toUpperCase()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Revisions:</span>
                    <span className="ml-2">{formData.revisions}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Exclusivity:</span>
                    <span className="ml-2 capitalize">{formData.exclusivity.replace("_", " ")}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Usage Rights:</span>
                    <span className="ml-2 capitalize">{formData.usageRights.replace("_", " ")}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">Deliverables:</span>
                    <span className="ml-2">{formData.deliverables || "Not specified"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-purple-400 mb-1">AI-Powered Generation</h4>
                  <p className="text-sm text-gray-500">
                    Our AI will create a professionally worded, legally-sound contract based on your inputs. You can edit any section after generation.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(2)}
                className="border-[#E5E0D8] text-gray-700 hover:bg-gray-100"
              >
                Back
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 min-w-[180px]"
              >
                {isGenerating ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate Contract
                  </span>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function NewContractPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FDF9F3] flex items-center justify-center">
        <div className="text-center">
          <svg className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    }>
      <NewContractContent />
    </Suspense>
  )
}
