"use client"

import Link from "next/link"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#FDF9F3] text-[#1a1a1a] flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

        <div className="relative w-full max-w-md">
          {children}
        </div>
      </div>

      {/* Right side - Hero */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-[#FDF9F3]" />

        {/* Animated orbs */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-violet-400/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-fuchsia-400/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />

        {/* Content */}
        <div className="relative flex flex-col justify-center px-16">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-xl font-semibold tracking-tight text-[#1a1a1a]">ContractGen</span>
            </Link>
          </div>

          <h2 className="text-4xl font-bold tracking-tight mb-4 text-[#1a1a1a]">
            Contracts that<br />
            <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              protect your deals
            </span>
          </h2>

          <p className="text-lg text-[#666] mb-10 max-w-md">
            Generate professional influencer contracts in minutes.
            AI-powered and trusted by 5,000+ creators.
          </p>

          {/* Feature list */}
          <div className="space-y-4">
            {[
              { icon: "⚡", text: "AI-powered contract generation" },
              { icon: "✍️", text: "Built-in e-signatures" },
              { icon: "🛡️", text: "FTC compliant templates" },
              { icon: "📊", text: "Track all your deals" },
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-[#444]">
                <span className="text-lg">{feature.icon}</span>
                <span className="text-[15px]">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="mt-12 p-6 rounded-2xl bg-white/80 border border-[#E5E0D8] max-w-md shadow-sm">
            <p className="text-[15px] text-[#444] mb-4 leading-relaxed">
              "ContractGen saved me hours of back-and-forth with brands.
              Now I close deals in minutes, not days."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-sm font-semibold">
                S
              </div>
              <div>
                <div className="text-sm font-medium text-[#1a1a1a]">Sarah Chen</div>
                <div className="text-xs text-[#666]">250K followers • YouTube</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
