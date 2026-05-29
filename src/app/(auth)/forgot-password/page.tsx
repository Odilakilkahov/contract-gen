"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      // Even if email doesn't exist, show success for security
      setSubmitted(true)
    } catch (error) {
      // Still show success for security (don't reveal if email exists)
      setSubmitted(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <Link href="/login" className="inline-flex items-center gap-2 text-[#666] hover:text-[#1a1a1a] transition-colors mb-8">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to login
      </Link>

      {!submitted ? (
        <>
          <h1 className="text-3xl font-bold mb-2 text-[#1a1a1a]">Reset password</h1>
          <p className="text-[#666] mb-8">Enter your email and we'll send you a reset link</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#444] mb-2">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-white border-[#E5E0D8] text-[#1a1a1a] placeholder:text-[#999] rounded-xl"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-700 hover:to-fuchsia-600 rounded-xl font-semibold"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        </>
      ) : (
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2 text-[#1a1a1a]">Check your email</h1>
          <p className="text-[#666] mb-6">
            We sent a password reset link to <span className="text-[#1a1a1a] font-medium">{email}</span>
          </p>
          <Link href="/login">
            <Button variant="outline" className="border-[#E5E0D8] text-[#1a1a1a] hover:bg-[#f5f5f5]">Back to login</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
