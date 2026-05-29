"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useBrandingStore, type BrandingSettings, getContrastColor } from "@/lib/branding-store"
import { useAppStore } from "@/lib/store"

// Textarea component (inline since we don't have it in ui folder)
function Textarea({
  className = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`flex min-h-[80px] w-full rounded-lg border border-[#E5E0D8] bg-gray-50 px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-900 dark:border-gray-700 ${className}`}
      {...props}
    />
  )
}

// Color preset options
const COLOR_PRESETS = [
  { name: "Purple", primary: "#7c3aed", accent: "#c026d3" },
  { name: "Blue", primary: "#2563eb", accent: "#0ea5e9" },
  { name: "Green", primary: "#059669", accent: "#10b981" },
  { name: "Orange", primary: "#ea580c", accent: "#f59e0b" },
  { name: "Red", primary: "#dc2626", accent: "#f43f5e" },
  { name: "Pink", primary: "#db2777", accent: "#ec4899" },
  { name: "Teal", primary: "#0d9488", accent: "#14b8a6" },
  { name: "Indigo", primary: "#4f46e5", accent: "#6366f1" },
]

export default function BrandingPage() {
  const router = useRouter()
  const user = useAppStore((state) => state.user)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    companyName,
    logo,
    primaryColor,
    accentColor,
    emailFooter,
    contractFooter,
    customDomain,
    hideContractGenBranding,
    customEmailSender,
    contractWatermark,
    setBranding,
    isSaving,
    setSaving,
  } = useBrandingStore()

  const [localSettings, setLocalSettings] = useState<BrandingSettings>({
    companyName,
    logo,
    primaryColor,
    accentColor,
    emailFooter,
    contractFooter,
    customDomain,
    hideContractGenBranding,
    customEmailSender,
    contractWatermark,
  })

  const [saveSuccess, setSaveSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if user has Agency plan
  const isAgencyPlan = user?.plan === "agency"

  // Sync local state with store on mount
  useEffect(() => {
    setLocalSettings({
      companyName,
      logo,
      primaryColor,
      accentColor,
      emailFooter,
      contractFooter,
      customDomain,
      hideContractGenBranding,
      customEmailSender,
      contractWatermark,
    })
  }, [companyName, logo, primaryColor, accentColor, emailFooter, contractFooter, customDomain, hideContractGenBranding, customEmailSender, contractWatermark])

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("Logo file must be less than 2MB")
      return
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file")
      return
    }

    setError(null)

    const reader = new FileReader()
    reader.onload = () => {
      setLocalSettings((prev) => ({ ...prev, logo: reader.result as string }))
    }
    reader.onerror = () => {
      setError("Failed to read file")
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveLogo = () => {
    setLocalSettings((prev) => ({ ...prev, logo: null }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleColorPreset = (primary: string, accent: string) => {
    setLocalSettings((prev) => ({
      ...prev,
      primaryColor: primary,
      accentColor: accent,
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSaveSuccess(false)

    try {
      const response = await fetch("/api/settings/branding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(localSettings),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to save branding settings")
      }

      setBranding(localSettings)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  // Redirect non-agency users
  if (!isAgencyPlan) {
    return (
      <div className="p-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">White-Label Branding</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Customize contracts with your brand identity.
          </p>
        </div>

        <Card className="bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-950/30 dark:to-fuchsia-950/30 border-violet-200 dark:border-violet-800">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
              Agency Plan Required
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              White-label branding is available exclusively for Agency plan
              subscribers. Remove ContractGen branding and use your own logo,
              colors, and custom footers.
            </p>
            <Button
              onClick={() => router.push("/dashboard/pricing")}
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
              Upgrade to Agency
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">White-Label Branding</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Customize contracts and emails with your brand identity.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Company Info */}
        <Card className="bg-white dark:bg-gray-900 border-[#E5E0D8] dark:border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-violet-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Company Name</Label>
              <Input
                value={localSettings.companyName}
                onChange={(e) =>
                  setLocalSettings((prev) => ({
                    ...prev,
                    companyName: e.target.value,
                  }))
                }
                placeholder="Your Agency Name"
                className="mt-1.5"
              />
              <p className="text-xs text-gray-500 mt-1">
                This will appear on contracts and emails instead of ContractGen
              </p>
            </div>

            <div>
              <Label>Logo</Label>
              <div className="flex items-center gap-4 mt-2">
                {localSettings.logo ? (
                  <div className="relative group">
                    <img
                      src={localSettings.logo}
                      alt="Logo"
                      className="h-16 max-w-[200px] object-contain rounded-lg border border-gray-200 dark:border-gray-700 p-2 bg-white dark:bg-gray-800"
                    />
                    <button
                      onClick={handleRemoveLogo}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="h-16 w-32 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
                <div>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="w-auto"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended: 200x50px, PNG or SVG (max 2MB)
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Colors */}
        <Card className="bg-white dark:bg-gray-900 border-[#E5E0D8] dark:border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-violet-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                />
              </svg>
              Brand Colors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Color Presets */}
            <div>
              <Label className="mb-2">Quick Presets</Label>
              <div className="flex flex-wrap gap-2">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() =>
                      handleColorPreset(preset.primary, preset.accent)
                    }
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      localSettings.primaryColor === preset.primary
                        ? "ring-2 ring-offset-2 ring-gray-400"
                        : "hover:scale-105"
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${preset.primary}, ${preset.accent})`,
                      color: "white",
                    }}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Colors */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Primary Color</Label>
                <div className="flex gap-2 mt-1.5">
                  <input
                    type="color"
                    value={localSettings.primaryColor}
                    onChange={(e) =>
                      setLocalSettings((prev) => ({
                        ...prev,
                        primaryColor: e.target.value,
                      }))
                    }
                    className="h-10 w-16 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer"
                  />
                  <Input
                    value={localSettings.primaryColor}
                    onChange={(e) =>
                      setLocalSettings((prev) => ({
                        ...prev,
                        primaryColor: e.target.value,
                      }))
                    }
                    className="flex-1 font-mono"
                    placeholder="#7c3aed"
                  />
                </div>
              </div>
              <div>
                <Label>Accent Color</Label>
                <div className="flex gap-2 mt-1.5">
                  <input
                    type="color"
                    value={localSettings.accentColor}
                    onChange={(e) =>
                      setLocalSettings((prev) => ({
                        ...prev,
                        accentColor: e.target.value,
                      }))
                    }
                    className="h-10 w-16 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer"
                  />
                  <Input
                    value={localSettings.accentColor}
                    onChange={(e) =>
                      setLocalSettings((prev) => ({
                        ...prev,
                        accentColor: e.target.value,
                      }))
                    }
                    className="flex-1 font-mono"
                    placeholder="#c026d3"
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <p className="text-sm text-gray-500 mb-3">Preview:</p>
              <div className="flex flex-wrap gap-3">
                <button
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-transform hover:scale-105"
                  style={{
                    backgroundColor: localSettings.primaryColor,
                    color: getContrastColor(localSettings.primaryColor),
                  }}
                >
                  Primary Button
                </button>
                <button
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-transform hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${localSettings.primaryColor}, ${localSettings.accentColor})`,
                    color: "white",
                  }}
                >
                  Gradient Button
                </button>
                <span
                  className="px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: `${localSettings.primaryColor}20`,
                    color: localSettings.primaryColor,
                  }}
                >
                  Badge
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* White-label Options */}
        <Card className="bg-white dark:bg-gray-900 border-[#E5E0D8] dark:border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-violet-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
              White-Label Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
              <input
                type="checkbox"
                checked={localSettings.hideContractGenBranding}
                onChange={(e) =>
                  setLocalSettings((prev) => ({
                    ...prev,
                    hideContractGenBranding: e.target.checked,
                  }))
                }
                className="w-5 h-5 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
              />
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  Hide ContractGen Branding
                </div>
                <div className="text-sm text-gray-500">
                  Remove "Generated by ContractGen" from PDFs and emails
                </div>
              </div>
            </label>

            <div>
              <Label>Contract Watermark (Optional)</Label>
              <Input
                value={localSettings.contractWatermark || ""}
                onChange={(e) =>
                  setLocalSettings((prev) => ({
                    ...prev,
                    contractWatermark: e.target.value || null,
                  }))
                }
                placeholder="CONFIDENTIAL"
                className="mt-1.5"
              />
              <p className="text-xs text-gray-500 mt-1">
                Add a diagonal watermark text to all contract PDFs
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Custom Footers */}
        <Card className="bg-white dark:bg-gray-900 border-[#E5E0D8] dark:border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-violet-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Custom Footers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Contract Footer Text</Label>
              <Textarea
                value={localSettings.contractFooter}
                onChange={(e) =>
                  setLocalSettings((prev) => ({
                    ...prev,
                    contractFooter: e.target.value,
                  }))
                }
                placeholder="Text that appears at the bottom of every contract PDF&#10;e.g., Your Agency Name | www.youragency.com | contact@youragency.com"
                rows={3}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Email Footer Text</Label>
              <Textarea
                value={localSettings.emailFooter}
                onChange={(e) =>
                  setLocalSettings((prev) => ({
                    ...prev,
                    emailFooter: e.target.value,
                  }))
                }
                placeholder="Text that appears at the bottom of all emails&#10;e.g., Your Agency Name, Inc. | 123 Business St, City | Unsubscribe"
                rows={3}
                className="mt-1.5"
              />
            </div>
          </CardContent>
        </Card>

        {/* Custom Domain */}
        <Card className="bg-white dark:bg-gray-900 border-[#E5E0D8] dark:border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-violet-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
              Custom Domain
              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded">
                Coming Soon
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label>Custom Domain</Label>
              <Input
                value={localSettings.customDomain || ""}
                onChange={(e) =>
                  setLocalSettings((prev) => ({
                    ...prev,
                    customDomain: e.target.value || null,
                  }))
                }
                placeholder="contracts.youragency.com"
                disabled
                className="mt-1.5 opacity-50"
              />
              <p className="text-sm text-gray-500 mt-2">
                Host your contract portal on your own domain. Contact support
                for setup assistance.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Email Sender */}
        <Card className="bg-white dark:bg-gray-900 border-[#E5E0D8] dark:border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-violet-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Email Sender
              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded">
                Coming Soon
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label>Custom Email Sender</Label>
              <Input
                value={localSettings.customEmailSender || ""}
                onChange={(e) =>
                  setLocalSettings((prev) => ({
                    ...prev,
                    customEmailSender: e.target.value || null,
                  }))
                }
                placeholder="contracts@youragency.com"
                disabled
                className="mt-1.5 opacity-50"
              />
              <p className="text-sm text-gray-500 mt-2">
                Send emails from your own domain. Requires DNS verification.
                Contact support for setup.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
          <div>
            {saveSuccess && (
              <span className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Branding settings saved successfully
              </span>
            )}
          </div>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 min-w-[140px]"
          >
            {isSaving ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              "Save Branding Settings"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
