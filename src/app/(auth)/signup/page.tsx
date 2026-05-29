"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppStore } from "@/lib/store"
import { supabase, isSupabaseConfigured } from "@/lib/supabase-client"

export default function SignupPage() {
  const router = useRouter()
  const setUser = useAppStore((state) => state.setUser)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [ageConfirmed, setAgeConfirmed] = useState(false)
  const [dataConsent, setDataConsent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters")
      setIsLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (!ageConfirmed) {
      setError("You must confirm that you are 18 years or older")
      setIsLoading(false)
      return
    }

    if (!dataConsent) {
      setError("You must consent to personal data processing")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.error || "Signup failed")
        setIsLoading(false)
        return
      }

      setUser({
        id: data.user?.id || "demo-user",
        email: formData.email,
        name: formData.name,
      })

      router.push("/dashboard")
    } catch (err) {
      setError("Network error. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-[#666] hover:text-[#1a1a1a] transition-colors mb-8">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to home
        </Link>

        <h1 className="text-3xl font-bold mb-2 text-[#1a1a1a]">Create your account</h1>
        <p className="text-[#666]">Start creating professional contracts in minutes</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-[#444] mb-2">
            Full Name
          </label>
          <Input
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="h-12 bg-white border-[#E5E0D8] text-[#1a1a1a] placeholder:text-[#999] rounded-xl"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#444] mb-2">
            Email
          </label>
          <Input
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="h-12 bg-white border-[#E5E0D8] text-[#1a1a1a] placeholder:text-[#999] rounded-xl"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#444] mb-2">
            Password
          </label>
          <Input
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="h-12 bg-white border-[#E5E0D8] text-[#1a1a1a] placeholder:text-[#999] rounded-xl"
          />
          <p className="mt-1 text-xs text-[#999]">At least 8 characters</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#444] mb-2">
            Confirm Password
          </label>
          <Input
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="h-12 bg-white border-[#E5E0D8] text-[#1a1a1a] placeholder:text-[#999] rounded-xl"
          />
        </div>

        {/* Age Gate Checkbox */}
        <div className="flex items-start gap-3 text-sm p-4 bg-[#FDF9F3] rounded-xl border border-[#E5E0D8]">
          <input
            type="checkbox"
            id="ageConfirm"
            checked={ageConfirmed}
            onChange={(e) => setAgeConfirmed(e.target.checked)}
            className="mt-0.5 w-5 h-5 rounded border-[#E5E0D8] bg-white text-violet-600 focus:ring-violet-500 cursor-pointer"
            required
          />
          <label htmlFor="ageConfirm" className="text-[#444] cursor-pointer leading-relaxed">
            Регистрируясь, я подтверждаю что мне есть 18 лет и я принимаю{" "}
            <Link href="/terms" className="text-violet-600 hover:text-violet-500 font-medium">
              Условия использования
            </Link>
            {" "}и{" "}
            <Link href="/privacy" className="text-violet-600 hover:text-violet-500 font-medium">
              Политику конфиденциальности
            </Link>
          </label>
        </div>

        {/* Personal Data Consent Checkbox */}
        <div className="flex items-start gap-3 text-sm p-4 bg-[#FDF9F3] rounded-xl border border-[#E5E0D8]">
          <input
            type="checkbox"
            id="dataConsent"
            checked={dataConsent}
            onChange={(e) => setDataConsent(e.target.checked)}
            className="mt-0.5 w-5 h-5 rounded border-[#E5E0D8] bg-white text-violet-600 focus:ring-violet-500 cursor-pointer"
            required
          />
          <label htmlFor="dataConsent" className="text-[#444] cursor-pointer leading-relaxed">
            Я даю согласие на обработку персональных данных в соответствии с{" "}
            <Link href="/privacy" className="text-violet-600 hover:text-violet-500 font-medium">
              Политикой конфиденциальности
            </Link>
          </label>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/20 rounded-xl font-semibold"
        >
          {isLoading ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            "Create Account"
          )}
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E5E0D8]" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[#FDF9F3] px-4 text-[#999]">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={async () => {
              if (!isSupabaseConfigured()) {
                // Demo mode - use API to set cookie
                const response = await fetch("/api/auth/signup", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email: 'demo@google.com', password: 'demo', name: 'Google User', rememberMe: true }),
                })
                const data = await response.json()
                if (data.success) {
                  setUser({ id: data.user?.id || 'demo-google', email: 'demo@google.com', name: 'Google User' })
                  router.push('/dashboard')
                }
                return
              }
              const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: `${window.location.origin}/dashboard` }
              })
              if (error) setError(error.message)
            }}
            className="h-12 border-[#E5E0D8] bg-white hover:bg-[#f5f5f5] text-[#1a1a1a] rounded-xl"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={async () => {
              if (!isSupabaseConfigured()) {
                // Demo mode - use API to set cookie
                const response = await fetch("/api/auth/signup", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email: 'demo@github.com', password: 'demo', name: 'GitHub User', rememberMe: true }),
                })
                const data = await response.json()
                if (data.success) {
                  setUser({ id: data.user?.id || 'demo-github', email: 'demo@github.com', name: 'GitHub User' })
                  router.push('/dashboard')
                }
                return
              }
              const { error } = await supabase.auth.signInWithOAuth({
                provider: 'github',
                options: { redirectTo: `${window.location.origin}/dashboard` }
              })
              if (error) setError(error.message)
            }}
            className="h-12 border-[#E5E0D8] bg-white hover:bg-[#f5f5f5] text-[#1a1a1a] rounded-xl"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </Button>
        </div>
      </form>

      <p className="mt-8 text-center text-sm text-[#666]">
        Already have an account?{" "}
        <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium">
          Sign in
        </Link>
      </p>
    </div>
  )
}
