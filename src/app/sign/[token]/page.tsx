"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ContractData {
  title: string
  brand: string
  creator: string
  creatorEmail: string
  value: string
  deliverables: string[]
  timeline: string
  content: string
  status: "pending" | "signed" | "expired"
}

interface SignatureData {
  signatureImage: string // base64 PNG
  signatureType: "drawn" | "typed"
  signedAt: string // ISO timestamp
  signerName: string
  signerIP: string
  userAgent: string
  signatureId: string
}

const SIGNATURE_FONTS = [
  { name: "Dancing Script", css: "'Dancing Script', cursive" },
  { name: "Great Vibes", css: "'Great Vibes', cursive" },
  { name: "Allura", css: "'Allura', cursive" },
  { name: "Pacifico", css: "'Pacifico', cursive" },
]

const mockContracts: Record<string, ContractData> = {
  "test-token": {
    title: "Instagram Sponsored Post Agreement",
    brand: "Nike",
    creator: "John Doe",
    creatorEmail: "john@example.com",
    value: "$2,500",
    deliverables: [
      "1 Instagram Feed Post",
      "2 Instagram Stories with swipe-up link",
      "Content usage rights for 6 months",
    ],
    timeline: "Content due by June 15, 2026",
    status: "pending",
    content: `
INFLUENCER MARKETING AGREEMENT

This Agreement is entered into as of the date of last signature below ("Effective Date"), by and between:

BRAND: Nike, Inc. ("Brand")
CREATOR: John Doe ("Creator")

1. SERVICES
Creator agrees to create and publish the following content:
- 1 Instagram Feed Post featuring Brand's products
- 2 Instagram Stories with Brand mention and swipe-up link

2. COMPENSATION
Brand agrees to pay Creator $2,500 USD within 30 days of content publication.

3. CONTENT REQUIREMENTS
- All content must include #ad or #sponsored disclosure
- Content must be approved by Brand before publication
- Creator retains creative control within Brand guidelines

4. USAGE RIGHTS
Brand is granted non-exclusive rights to use, reproduce, and distribute the content for 6 months from publication date.

5. TIMELINE
- Content submission for approval: June 10, 2026
- Publication date: June 15, 2026

6. CONFIDENTIALITY
Creator agrees to keep all campaign details confidential until publication.

7. TERMINATION
Either party may terminate this agreement with 14 days written notice.

By signing below, both parties agree to the terms outlined in this agreement.
    `.trim(),
  },
  "gymshark-2026": {
    title: "TikTok Ambassador Agreement",
    brand: "Gymshark",
    creator: "Jane Smith",
    creatorEmail: "jane@example.com",
    value: "$5,000/month",
    deliverables: [
      "4 TikTok videos per month",
      "Exclusive brand partnership",
      "Event appearances (2 per quarter)",
    ],
    timeline: "3-month contract starting July 1, 2026",
    status: "pending",
    content: `
AMBASSADOR AGREEMENT

This Agreement is entered into by and between:

BRAND: Gymshark Ltd ("Brand")
AMBASSADOR: Jane Smith ("Ambassador")

1. TERM
This agreement is for 3 months, starting July 1, 2026.

2. DELIVERABLES
- 4 TikTok videos per month featuring Gymshark products
- Attendance at 2 brand events per quarter
- Exclusive partnership (no competing fitness brands)

3. COMPENSATION
$5,000 USD per month, paid on the 1st of each month.
Plus: Free product allocation ($500/month value)

4. CONTENT GUIDELINES
- All content must align with Gymshark brand values
- Content requires approval 48 hours before posting
- Must use provided hashtags and mentions

5. EXCLUSIVITY
Ambassador agrees not to promote competing fitness apparel brands.

By signing, both parties agree to these terms.
    `.trim(),
  },
}

// Generate unique signature ID
function generateSignatureId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 10)
  return `SIG-${timestamp}-${random}`.toUpperCase()
}

// Signature Canvas Component
function SignatureCanvas({
  onSignatureChange,
}: {
  onSignatureChange: (dataUrl: string | null) => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasDrawn, setHasDrawn] = useState(false)

  const getCoordinates = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current
      if (!canvas) return { x: 0, y: 0 }

      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height

      if ("touches" in e) {
        const touch = e.touches[0]
        return {
          x: (touch.clientX - rect.left) * scaleX,
          y: (touch.clientY - rect.top) * scaleY,
        }
      }

      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      }
    },
    []
  )

  const startDrawing = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      e.preventDefault()
      const canvas = canvasRef.current
      const ctx = canvas?.getContext("2d")
      if (!ctx) return

      setIsDrawing(true)
      const { x, y } = getCoordinates(e)
      ctx.beginPath()
      ctx.moveTo(x, y)
    },
    [getCoordinates]
  )

  const draw = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      e.preventDefault()
      if (!isDrawing) return

      const canvas = canvasRef.current
      const ctx = canvas?.getContext("2d")
      if (!ctx) return

      const { x, y } = getCoordinates(e)
      ctx.lineTo(x, y)
      ctx.stroke()
      setHasDrawn(true)
    },
    [isDrawing, getCoordinates]
  )

  const stopDrawing = useCallback(() => {
    if (isDrawing && hasDrawn) {
      const canvas = canvasRef.current
      if (canvas) {
        onSignatureChange(canvas.toDataURL("image/png"))
      }
    }
    setIsDrawing(false)
  }, [isDrawing, hasDrawn, onSignatureChange])

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx || !canvas) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasDrawn(false)
    onSignatureChange(null)
  }, [onSignatureChange])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx) return

    // Set up canvas for drawing
    ctx.strokeStyle = "#1a1a1a"
    ctx.lineWidth = 2.5
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
  }, [])

  return (
    <div className="space-y-3">
      <div className="relative border-2 border-dashed border-gray-300 rounded-xl bg-white overflow-hidden">
        <canvas
          ref={canvasRef}
          width={600}
          height={200}
          className="w-full h-40 cursor-crosshair touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        {!hasDrawn && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-gray-400 text-sm">Draw your signature here</span>
          </div>
        )}
        <div className="absolute bottom-2 left-4 right-4 border-t border-gray-300" />
      </div>
      <div className="flex justify-end">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={clearCanvas}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Clear
        </Button>
      </div>
    </div>
  )
}

// Typed Signature Component
function TypedSignature({
  name,
  onNameChange,
  selectedFont,
  onFontChange,
  onSignatureChange,
}: {
  name: string
  onNameChange: (name: string) => void
  selectedFont: number
  onFontChange: (index: number) => void
  onSignatureChange: (dataUrl: string | null) => void
}) {
  const previewRef = useRef<HTMLDivElement>(null)

  // Generate signature image from typed name
  const generateSignatureImage = useCallback(() => {
    if (!name.trim()) {
      onSignatureChange(null)
      return
    }

    const canvas = document.createElement("canvas")
    canvas.width = 600
    canvas.height = 200
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw signature text
    const font = SIGNATURE_FONTS[selectedFont]
    ctx.font = `48px ${font.css}`
    ctx.fillStyle = "#1a1a1a"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(name, canvas.width / 2, canvas.height / 2)

    // Draw signature line
    ctx.strokeStyle = "#d1d5db"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(50, canvas.height - 30)
    ctx.lineTo(canvas.width - 50, canvas.height - 30)
    ctx.stroke()

    onSignatureChange(canvas.toDataURL("image/png"))
  }, [name, selectedFont, onSignatureChange])

  useEffect(() => {
    generateSignatureImage()
  }, [generateSignatureImage])

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-gray-600 mb-2">Type your name</label>
        <Input
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Enter your full name"
          className="h-12 rounded-xl"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-2">Choose signature style</label>
        <div className="grid grid-cols-2 gap-2">
          {SIGNATURE_FONTS.map((font, index) => (
            <button
              key={font.name}
              type="button"
              onClick={() => onFontChange(index)}
              className={`p-4 border-2 rounded-xl text-center transition-all ${
                selectedFont === index
                  ? "border-violet-500 bg-violet-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <span
                style={{ fontFamily: font.css }}
                className="text-2xl text-gray-800"
              >
                {name || "Your Name"}
              </span>
              <span className="block text-xs text-gray-500 mt-1">{font.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Signature Preview */}
      <div className="border-2 border-dashed border-gray-300 rounded-xl bg-white p-6">
        <div className="text-center">
          <span className="text-xs text-gray-500 uppercase tracking-wide">Signature Preview</span>
        </div>
        <div
          ref={previewRef}
          className="h-20 flex items-center justify-center border-b border-gray-300 mt-4"
        >
          {name ? (
            <span
              style={{ fontFamily: SIGNATURE_FONTS[selectedFont].css }}
              className="text-4xl text-gray-800"
            >
              {name}
            </span>
          ) : (
            <span className="text-gray-400 text-sm">Your signature will appear here</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SignContractPage() {
  const params = useParams()
  const token = params.token as string

  const [step, setStep] = useState<"loading" | "not-found" | "review" | "sign" | "complete">("loading")
  const [contract, setContract] = useState<ContractData | null>(null)
  const [agreed, setAgreed] = useState(false)
  const [signerName, setSignerName] = useState("")
  const [signatureData, setSignatureData] = useState<SignatureData | null>(null)

  // Signature input state
  const [signatureMode, setSignatureMode] = useState<"draw" | "type">("draw")
  const [drawnSignature, setDrawnSignature] = useState<string | null>(null)
  const [typedName, setTypedName] = useState("")
  const [selectedFont, setSelectedFont] = useState(0)
  const [typedSignature, setTypedSignature] = useState<string | null>(null)

  // Get current signature based on mode
  const currentSignature = signatureMode === "draw" ? drawnSignature : typedSignature

  useEffect(() => {
    // Simulate API call to fetch contract by token
    const fetchContract = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const data = mockContracts[token]
      if (data) {
        if (data.status === "signed") {
          setStep("complete")
        } else if (data.status === "expired") {
          setStep("not-found")
        } else {
          setStep("review")
        }
        setContract(data)
      } else {
        setStep("not-found")
      }
    }

    fetchContract()
  }, [token])

  // Load Google Fonts for typed signatures
  useEffect(() => {
    const link = document.createElement("link")
    link.href =
      "https://fonts.googleapis.com/css2?family=Allura&family=Dancing+Script:wght@400;700&family=Great+Vibes&family=Pacifico&display=swap"
    link.rel = "stylesheet"
    document.head.appendChild(link)
    return () => {
      document.head.removeChild(link)
    }
  }, [])

  const handleSign = async () => {
    if (!currentSignature || !signerName || !agreed) return

    // Collect signature metadata
    const signedAt = new Date().toISOString()
    const signatureId = generateSignatureId()

    // Get IP address (in production, this would come from server)
    let signerIP = "Unknown"
    try {
      const ipResponse = await fetch("https://api.ipify.org?format=json")
      const ipData = await ipResponse.json()
      signerIP = ipData.ip
    } catch {
      // Use placeholder if IP fetch fails
      signerIP = "Unable to determine"
    }

    const newSignatureData: SignatureData = {
      signatureImage: currentSignature,
      signatureType: signatureMode === "draw" ? "drawn" : "typed",
      signedAt,
      signerName,
      signerIP,
      userAgent: navigator.userAgent,
      signatureId,
    }

    setSignatureData(newSignatureData)

    // Simulate API call to save signature
    await new Promise((resolve) => setTimeout(resolve, 800))
    setStep("complete")
  }

  const handleDownloadPDF = () => {
    // In production, this would generate a real PDF
    // For now, we'll create a simple printable version
    window.print()
  }

  if (step === "loading") {
    return (
      <div className="min-h-screen bg-[#FDF9F3] text-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading contract...</p>
        </div>
      </div>
    )
  }

  if (step === "not-found") {
    return (
      <div className="min-h-screen bg-[#FDF9F3] text-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md rounded-2xl text-center">
          <CardContent className="p-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Contract Not Found</h1>
            <p className="text-gray-500 mb-6">
              This signing link is invalid or has expired. Please contact the sender for a new link.
            </p>
            <p className="text-xs text-gray-400">Token: {token}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === "complete") {
    return (
      <div className="min-h-screen bg-[#FDF9F3] text-gray-900">
        {/* Header */}
        <header className="border-b border-[#E5E0D8] bg-white/95 backdrop-blur-xl sticky top-0 z-50 print:hidden">
          <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <span className="font-semibold text-gray-900">ContractGen</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Contract Signed
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Success Banner */}
          <Card className="rounded-2xl mb-8 bg-emerald-50 border-emerald-200">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center">
                <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Contract Successfully Signed!</h1>
              <p className="text-gray-600 mb-6">
                Thank you for signing. A confirmation email has been sent to your email address.
              </p>
            </CardContent>
          </Card>

          {/* Signature Details */}
          <Card className="rounded-2xl mb-6">
            <CardContent className="p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Signature Details</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 border border-[#E5E0D8] rounded-xl">
                  <div className="text-sm text-gray-500 mb-1">Signed by</div>
                  <div className="font-medium text-gray-900">{signatureData?.signerName || signerName || contract?.creator}</div>
                </div>
                <div className="p-4 bg-gray-50 border border-[#E5E0D8] rounded-xl">
                  <div className="text-sm text-gray-500 mb-1">Signed on</div>
                  <div className="font-medium text-gray-900">
                    {signatureData?.signedAt
                      ? new Date(signatureData.signedAt).toLocaleDateString("en-US", {
                          dateStyle: "full",
                        })
                      : new Date().toLocaleDateString("en-US", { dateStyle: "full" })}
                  </div>
                </div>
                <div className="p-4 bg-gray-50 border border-[#E5E0D8] rounded-xl">
                  <div className="text-sm text-gray-500 mb-1">Signature ID</div>
                  <div className="font-mono text-sm text-gray-900">{signatureData?.signatureId || "N/A"}</div>
                </div>
                <div className="p-4 bg-gray-50 border border-[#E5E0D8] rounded-xl">
                  <div className="text-sm text-gray-500 mb-1">Signature Type</div>
                  <div className="font-medium text-gray-900 capitalize">{signatureData?.signatureType || "Electronic"}</div>
                </div>
              </div>

              {/* Display Signature */}
              {signatureData?.signatureImage && (
                <div className="mt-6">
                  <div className="text-sm text-gray-500 mb-2">Your Signature</div>
                  <div className="border border-[#E5E0D8] rounded-xl bg-white p-4 flex items-center justify-center">
                    <img
                      src={signatureData.signatureImage}
                      alt="Your signature"
                      className="max-h-24 object-contain"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Signed Contract Preview */}
          <Card className="rounded-2xl mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">{contract?.title}</h2>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                  Signed
                </span>
              </div>
              <div className="bg-gray-50 border border-[#E5E0D8] rounded-xl p-6 max-h-80 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">{contract?.content}</pre>

                {/* Signature Block */}
                <div className="mt-8 pt-6 border-t border-gray-300">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <div className="text-sm text-gray-500 mb-2">Creator Signature</div>
                      {signatureData?.signatureImage && (
                        <img
                          src={signatureData.signatureImage}
                          alt="Signature"
                          className="max-h-16 object-contain mb-2"
                        />
                      )}
                      <div className="border-t border-gray-400 pt-2">
                        <div className="font-medium text-gray-900">{signatureData?.signerName}</div>
                        <div className="text-sm text-gray-500">
                          {signatureData?.signedAt &&
                            new Date(signatureData.signedAt).toLocaleDateString("en-US", {
                              dateStyle: "medium",
                            })}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-2">Brand Signature</div>
                      <div className="h-16 flex items-end mb-2">
                        <span className="text-gray-400 italic text-sm">Awaiting signature</span>
                      </div>
                      <div className="border-t border-gray-400 pt-2">
                        <div className="font-medium text-gray-400">{contract?.brand}</div>
                        <div className="text-sm text-gray-400">Pending</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Audit Trail */}
          <Card className="rounded-2xl mb-6">
            <CardContent className="p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Audit Trail</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Document signed by {signatureData?.signerName}</div>
                    <div className="text-sm text-gray-500">
                      {signatureData?.signedAt &&
                        new Date(signatureData.signedAt).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                    </div>
                    <div className="text-xs text-gray-400 mt-1 font-mono">
                      IP: {signatureData?.signerIP} | ID: {signatureData?.signatureId}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Document viewed</div>
                    <div className="text-sm text-gray-500">
                      {signatureData?.signedAt &&
                        new Date(new Date(signatureData.signedAt).getTime() - 60000).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Signing link sent</div>
                    <div className="text-sm text-gray-500">
                      {signatureData?.signedAt &&
                        new Date(new Date(signatureData.signedAt).getTime() - 3600000).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Download Button */}
          <Button onClick={handleDownloadPDF} className="w-full h-12 rounded-xl font-medium print:hidden">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download Signed Contract (PDF)
          </Button>
        </main>

        {/* Footer */}
        <footer className="border-t border-[#E5E0D8] py-6 mt-12 print:hidden">
          <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500">
            <p>Powered by ContractGen - Secure E-Signatures</p>
          </div>
        </footer>
      </div>
    )
  }

  if (!contract) return null

  return (
    <div className="min-h-screen bg-[#FDF9F3] text-gray-900">
      {/* Header */}
      <header className="border-b border-[#E5E0D8] bg-white/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <span className="font-semibold text-gray-900">ContractGen</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Secure & Encrypted
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Contract Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <span>From {contract.brand}</span>
            <span>-</span>
            <span>To: {contract.creator}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{contract.title}</h1>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-violet-100 text-violet-600 rounded-full text-sm font-medium">
              {contract.brand}
            </span>
            <span className="text-emerald-600 font-semibold">{contract.value}</span>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-4 mb-8">
          <div className={`flex items-center gap-2 ${step === "review" ? "text-violet-600" : "text-emerald-600"}`}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === "review" ? "bg-violet-100 border-2 border-violet-500" : "bg-emerald-100"
              }`}
            >
              {step === "review" ? "1" : <span className="text-emerald-600">&#10003;</span>}
            </div>
            <span className="font-medium">Review</span>
          </div>
          <div className="flex-1 h-px bg-gray-200" />
          <div className={`flex items-center gap-2 ${step === "sign" ? "text-violet-600" : "text-gray-400"}`}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === "sign" ? "bg-violet-100 border-2 border-violet-500" : "bg-gray-100"
              }`}
            >
              2
            </div>
            <span className="font-medium">Sign</span>
          </div>
        </div>

        {step === "review" && (
          <>
            {/* Key Terms */}
            <Card className="rounded-2xl mb-6">
              <CardContent className="p-6">
                <h2 className="font-semibold text-gray-900 mb-4">Key Terms</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 border border-[#E5E0D8] rounded-xl">
                    <div className="text-sm text-gray-500 mb-1">Compensation</div>
                    <div className="text-xl font-bold text-emerald-600">{contract.value}</div>
                  </div>
                  <div className="p-4 bg-gray-50 border border-[#E5E0D8] rounded-xl">
                    <div className="text-sm text-gray-500 mb-1">Timeline</div>
                    <div className="font-medium text-gray-900">{contract.timeline}</div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-sm text-gray-500 mb-2">Deliverables</div>
                  <ul className="space-y-2">
                    {contract.deliverables.map((d, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-violet-500" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-700">{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Full Contract */}
            <Card className="rounded-2xl mb-6">
              <CardContent className="p-6">
                <h2 className="font-semibold text-gray-900 mb-4">Full Contract</h2>
                <div className="bg-gray-50 border border-[#E5E0D8] rounded-xl p-6 max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">{contract.content}</pre>
                </div>
              </CardContent>
            </Card>

            <Button onClick={() => setStep("sign")} className="w-full h-12 rounded-xl font-medium">
              Continue to Sign
            </Button>
          </>
        )}

        {step === "sign" && (
          <Card className="rounded-2xl">
            <CardContent className="p-6">
              <h2 className="font-semibold text-gray-900 mb-6">Sign Contract</h2>

              <div className="space-y-6">
                {/* Legal Name Input */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Your Full Legal Name</label>
                  <Input
                    value={signerName}
                    onChange={(e) => setSignerName(e.target.value)}
                    placeholder="Enter your full legal name"
                    className="h-12 rounded-xl"
                  />
                </div>

                {/* Signature Mode Toggle */}
                <div>
                  <label className="block text-sm text-gray-600 mb-3">Choose Signature Method</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSignatureMode("draw")}
                      className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                        signatureMode === "draw"
                          ? "border-violet-500 bg-violet-50 text-violet-700"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                      Draw Signature
                    </button>
                    <button
                      type="button"
                      onClick={() => setSignatureMode("type")}
                      className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                        signatureMode === "type"
                          ? "border-violet-500 bg-violet-50 text-violet-700"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Type Signature
                    </button>
                  </div>
                </div>

                {/* Signature Input Area */}
                <div>
                  <label className="block text-sm text-gray-600 mb-3">Your Signature</label>
                  {signatureMode === "draw" ? (
                    <SignatureCanvas onSignatureChange={setDrawnSignature} />
                  ) : (
                    <TypedSignature
                      name={typedName}
                      onNameChange={setTypedName}
                      selectedFont={selectedFont}
                      onFontChange={setSelectedFont}
                      onSignatureChange={setTypedSignature}
                    />
                  )}
                </div>

                {/* Agreement Checkbox */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-5 h-5 mt-0.5 rounded border-gray-300 bg-white text-violet-500 focus:ring-violet-500"
                  />
                  <span className="text-sm text-gray-600">
                    I have read and agree to the terms of this contract. I understand that my signature above
                    constitutes a legally binding electronic signature with the same legal effect as a handwritten
                    signature.
                  </span>
                </label>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep("review")} className="flex-1 h-12 rounded-xl">
                    Back
                  </Button>
                  <Button
                    onClick={handleSign}
                    disabled={!currentSignature || !signerName || !agreed}
                    className="flex-1 h-12 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    Sign Contract
                  </Button>
                </div>
              </div>

              {/* Legal Info */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="text-sm text-blue-700">
                    <p className="font-medium mb-1">Legal Compliance</p>
                    <p>
                      Electronic signatures are legally binding under the ESIGN Act (US), UETA, and eIDAS regulation
                      (EU). Your signature, IP address, timestamp, and browser information will be recorded as part of
                      the audit trail for legal verification.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E5E0D8] py-6 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>Powered by ContractGen - Secure E-Signatures</p>
        </div>
      </footer>
    </div>
  )
}
