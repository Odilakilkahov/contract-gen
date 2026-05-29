"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SignatureRequest {
  id: string
  contractId: string
  title: string
  brand: string
  recipientEmail: string
  recipientName: string
  status: "draft" | "sent" | "viewed" | "signed" | "declined" | "expired"
  sentAt?: string
  viewedAt?: string
  signedAt?: string
  expiresAt: string
  signerIp?: string
}

const initialRequests: SignatureRequest[] = [
  {
    id: "sig-1",
    contractId: "2",
    title: "Gymshark Ambassador Q2",
    brand: "Gymshark",
    recipientEmail: "partnerships@gymshark.com",
    recipientName: "Sarah Miller",
    status: "viewed",
    sentAt: "2026-05-24T10:30:00",
    viewedAt: "2026-05-25T14:22:00",
    expiresAt: "2026-06-07",
  },
  {
    id: "sig-2",
    contractId: "4",
    title: "Samsung UGC License",
    brand: "Samsung",
    recipientEmail: "influencer.team@samsung.com",
    recipientName: "John Park",
    status: "sent",
    sentAt: "2026-05-22T09:15:00",
    expiresAt: "2026-06-05",
  },
  {
    id: "sig-3",
    contractId: "1",
    title: "Nike Sponsored Post",
    brand: "Nike",
    recipientEmail: "brand@nike.com",
    recipientName: "Alex Johnson",
    status: "signed",
    sentAt: "2026-05-20T11:00:00",
    viewedAt: "2026-05-20T15:30:00",
    signedAt: "2026-05-21T09:45:00",
    expiresAt: "2026-06-03",
    signerIp: "192.168.1.xxx",
  },
  {
    id: "sig-4",
    contractId: "5",
    title: "Adobe Tutorial Series",
    brand: "Adobe",
    recipientEmail: "creators@adobe.com",
    recipientName: "Emily Chen",
    status: "signed",
    sentAt: "2026-05-15T08:00:00",
    viewedAt: "2026-05-15T10:00:00",
    signedAt: "2026-05-15T10:15:00",
    expiresAt: "2026-05-29",
    signerIp: "10.0.0.xxx",
  },
]

const statusConfig = {
  draft: { bg: "bg-zinc-500/20", text: "text-gray-500", icon: "📝", label: "Draft" },
  sent: { bg: "bg-blue-500/20", text: "text-blue-400", icon: "📤", label: "Sent" },
  viewed: { bg: "bg-amber-500/20", text: "text-amber-400", icon: "👁️", label: "Viewed" },
  signed: { bg: "bg-emerald-500/20", text: "text-emerald-400", icon: "✅", label: "Signed" },
  declined: { bg: "bg-red-500/20", text: "text-red-400", icon: "❌", label: "Declined" },
  expired: { bg: "bg-zinc-500/20", text: "text-gray-500", icon: "⏰", label: "Expired" },
}

export default function SignaturesPage() {
  const [requests, setRequests] = useState<SignatureRequest[]>(initialRequests)
  const [showSendModal, setShowSendModal] = useState(false)
  const [newRequest, setNewRequest] = useState({
    email: "",
    name: "",
    contractId: "",
    message: "",
  })

  const pendingCount = requests.filter(r => ["sent", "viewed"].includes(r.status)).length
  const signedCount = requests.filter(r => r.status === "signed").length

  const resendRequest = (id: string) => {
    setRequests(requests.map(r =>
      r.id === id ? { ...r, sentAt: new Date().toISOString(), status: "sent" as const } : r
    ))
    alert("Signature request resent!")
  }

  const cancelRequest = (id: string) => {
    setRequests(requests.map(r =>
      r.id === id ? { ...r, status: "expired" as const } : r
    ))
  }

  const getDaysUntilExpiry = (date: string) => {
    const diff = new Date(date).getTime() - new Date().getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">E-Signatures</h1>
          <p className="text-gray-500">Send and track legally binding signatures</p>
        </div>
        <Button
          onClick={() => setShowSendModal(true)}
          className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Request Signature
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white border-[#E5E0D8] rounded-xl">
          <CardContent className="p-5">
            <div className="text-sm text-gray-500 mb-1">Pending</div>
            <div className="text-3xl font-bold text-amber-400">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-[#E5E0D8] rounded-xl">
          <CardContent className="p-5">
            <div className="text-sm text-gray-500 mb-1">Signed</div>
            <div className="text-3xl font-bold text-emerald-400">{signedCount}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-[#E5E0D8] rounded-xl">
          <CardContent className="p-5">
            <div className="text-sm text-gray-500 mb-1">Avg. Time to Sign</div>
            <div className="text-3xl font-bold">1.2 days</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-[#E5E0D8] rounded-xl">
          <CardContent className="p-5">
            <div className="text-sm text-gray-500 mb-1">Completion Rate</div>
            <div className="text-3xl font-bold text-violet-400">94%</div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Signatures */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Awaiting Signature</h2>
        <div className="space-y-3">
          {requests.filter(r => ["sent", "viewed"].includes(r.status)).map((request) => {
            const status = statusConfig[request.status]
            const daysLeft = getDaysUntilExpiry(request.expiresAt)

            return (
              <Card key={request.id} className="bg-white border-[#E5E0D8] rounded-xl hover:border-gray-300 transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${status.bg} flex items-center justify-center flex-shrink-0`}>
                      <span className="text-xl">{status.icon}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold truncate">{request.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${status.bg} ${status.text}`}>
                          {status.label}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mb-2">
                        Sent to {request.recipientName} ({request.recipientEmail})
                      </div>

                      {/* Timeline */}
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-gray-500">Sent {request.sentAt && formatDateTime(request.sentAt)}</span>
                        </div>
                        {request.viewedAt && (
                          <>
                            <div className="w-6 h-px bg-gray-100" />
                            <div className="flex items-center gap-1.5">
                              <div className="w-2 h-2 rounded-full bg-amber-500" />
                              <span className="text-gray-500">Viewed {formatDateTime(request.viewedAt)}</span>
                            </div>
                          </>
                        )}
                        <div className="w-6 h-px bg-gray-100" />
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-zinc-600" />
                          <span className="text-gray-500">Waiting for signature</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className={`text-sm font-medium mb-2 ${daysLeft <= 3 ? "text-red-400" : "text-gray-500"}`}>
                        {daysLeft > 0 ? `Expires in ${daysLeft} days` : "Expired"}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => resendRequest(request.id)}
                          className="border-[#E5E0D8] text-gray-500"
                        >
                          Resend
                        </Button>
                        <Link href={`/dashboard/contracts/${request.contractId}`}>
                          <Button size="sm" className="bg-violet-600 hover:bg-violet-500">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {requests.filter(r => ["sent", "viewed"].includes(r.status)).length === 0 && (
            <Card className="bg-white border-[#E5E0D8] rounded-xl">
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-3">✅</div>
                <div className="text-gray-500">No pending signatures</div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Completed Signatures */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Completed Signatures</h2>
        <Card className="bg-white border-[#E5E0D8] rounded-xl overflow-hidden">
          <div className="divide-y divide-[#E5E0D8]">
            {requests.filter(r => r.status === "signed").map((request) => (
              <div key={request.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{request.title}</div>
                  <div className="text-sm text-gray-500">{request.brand}</div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-700">
                    Signed by {request.recipientName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {request.signedAt && formatDateTime(request.signedAt)}
                  </div>
                </div>

                <Link href={`/dashboard/contracts/${request.contractId}`}>
                  <Button size="sm" variant="outline" className="border-[#E5E0D8]">
                    View
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Signature Info */}
      <Card className="mt-8 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border-violet-500/20 rounded-xl">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Legally Binding E-Signatures</h3>
              <p className="text-sm text-gray-500 mb-4">
                All signatures comply with ESIGN Act (US), eIDAS (EU), and international e-signature laws.
                Each signature includes a complete audit trail with timestamps, IP addresses, and document hashes.
              </p>
              <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  ESIGN Act Compliant
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  eIDAS Compliant
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  256-bit Encryption
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Full Audit Trail
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Send Signature Modal */}
      {showSendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-white border-[#E5E0D8] rounded-2xl">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Request Signature</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Recipient Name</label>
                  <Input
                    value={newRequest.name}
                    onChange={(e) => setNewRequest({ ...newRequest, name: e.target.value })}
                    placeholder="John Smith"
                    className="bg-gray-100 border-[#E5E0D8] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Recipient Email</label>
                  <Input
                    type="email"
                    value={newRequest.email}
                    onChange={(e) => setNewRequest({ ...newRequest, email: e.target.value })}
                    placeholder="john@brand.com"
                    className="bg-gray-100 border-[#E5E0D8] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Personal Message (optional)</label>
                  <textarea
                    value={newRequest.message}
                    onChange={(e) => setNewRequest({ ...newRequest, message: e.target.value })}
                    placeholder="Hi, please review and sign the attached contract..."
                    rows={3}
                    className="w-full bg-gray-100 border border-[#E5E0D8] rounded-xl p-3 text-gray-900 placeholder:text-gray-500 resize-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowSendModal(false)}
                  className="flex-1 border-[#E5E0D8]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    alert("Signature request sent!")
                    setShowSendModal(false)
                  }}
                  className="flex-1 bg-violet-600 hover:bg-violet-500"
                >
                  Send Request
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
