"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const faqs = [
  {
    q: "How do I create my first contract?",
    a: "Click 'New Contract' in the sidebar, choose a template, fill in the details, and our AI will generate a professional contract for you.",
    keywords: ["create", "contract", "first", "new", "start"]
  },
  {
    q: "Are the contracts legally binding?",
    a: "Yes, our contracts include all necessary legal clauses and e-signatures are compliant with ESIGN Act and eIDAS regulations.",
    keywords: ["legal", "binding", "law", "signature", "esign", "valid"]
  },
  {
    q: "What's included in the free plan?",
    a: "The free plan includes 3 contracts per month, basic templates, and email support.",
    keywords: ["free", "plan", "pricing", "cost", "tier", "included"]
  },
  {
    q: "How does FTC compliance work?",
    a: "Our AI automatically includes required FTC disclosure clauses (#ad, #sponsored) in all influencer contracts.",
    keywords: ["ftc", "compliance", "disclosure", "ad", "sponsored", "legal"]
  },
  {
    q: "How do I send a contract for signature?",
    a: "Open the contract, click 'Send for Signature', enter the recipient's email, and they'll receive a secure link to sign.",
    keywords: ["send", "signature", "sign", "email", "recipient"]
  },
  {
    q: "Can I edit a contract after creating it?",
    a: "Yes, you can edit any draft contract. Signed contracts cannot be edited, but you can create a new version.",
    keywords: ["edit", "modify", "change", "update", "draft"]
  },
  {
    q: "How do I create an invoice?",
    a: "Go to the Invoices page, click 'New Invoice', fill in the details, and send it to your client.",
    keywords: ["invoice", "payment", "billing", "create", "send"]
  },
  {
    q: "What payment methods are supported?",
    a: "We support Stripe for payments. Your clients can pay via credit card, debit card, or bank transfer.",
    keywords: ["payment", "stripe", "card", "bank", "transfer", "pay"]
  },
]

const quickLinks = [
  { title: "Getting Started", icon: "🚀", desc: "Learn the basics", href: "/dashboard/contracts/new" },
  { title: "Templates", icon: "📄", desc: "Browse templates", href: "/dashboard/templates" },
  { title: "E-Signatures", icon: "✍️", desc: "Signing contracts", href: "/dashboard/signatures" },
]

export default function HelpPage() {
  const [search, setSearch] = useState("")

  const filteredFaqs = search.trim()
    ? faqs.filter(faq =>
        faq.q.toLowerCase().includes(search.toLowerCase()) ||
        faq.a.toLowerCase().includes(search.toLowerCase()) ||
        faq.keywords.some(k => k.includes(search.toLowerCase()))
      )
    : faqs

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Help Center</h1>
        <p className="text-gray-500">Find answers and get support</p>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <Input
          placeholder="Search for help..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-12 pl-12 bg-white border-[#E5E0D8] rounded-xl"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Quick Links */}
      {!search && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {quickLinks.map((item, i) => (
            <Link key={i} href={item.href}>
              <Card className="bg-white border-[#E5E0D8] hover:border-purple-500/50 cursor-pointer transition-colors h-full">
                <CardContent className="p-5 text-center">
                  <span className="text-3xl">{item.icon}</span>
                  <h3 className="font-medium mt-3">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* FAQs */}
      <h2 className="text-lg font-semibold mb-4">
        {search ? `Search results (${filteredFaqs.length})` : "Frequently Asked Questions"}
      </h2>
      <div className="space-y-3 mb-8">
        {filteredFaqs.map((faq, i) => (
          <Card key={i} className="bg-white border-[#E5E0D8]">
            <CardContent className="p-5">
              <h3 className="font-medium mb-2">{faq.q}</h3>
              <p className="text-sm text-gray-500">{faq.a}</p>
            </CardContent>
          </Card>
        ))}
        {filteredFaqs.length === 0 && (
          <Card className="bg-white border-[#E5E0D8]">
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-3">🔍</div>
              <div className="text-gray-500 mb-2">No results found for "{search}"</div>
              <Button variant="outline" onClick={() => setSearch("")} className="border-[#E5E0D8]">
                Clear search
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Contact */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10 border-purple-500/20">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <h3 className="font-semibold mb-1">Still need help?</h3>
            <p className="text-sm text-gray-500">Our support team is here for you</p>
          </div>
          <a href="mailto:support@contractgen.io">
            <Button className="bg-white text-zinc-900 hover:bg-zinc-200">
              Contact Support
            </Button>
          </a>
        </CardContent>
      </Card>
    </div>
  )
}
