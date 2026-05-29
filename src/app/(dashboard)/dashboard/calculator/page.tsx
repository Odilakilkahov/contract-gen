"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const platforms = [
  { id: "instagram", name: "Instagram", icon: "📸", rates: { post: 0.01, story: 0.005, reel: 0.02 } },
  { id: "tiktok", name: "TikTok", icon: "🎵", rates: { post: 0.008, story: 0.003, reel: 0.015 } },
  { id: "youtube", name: "YouTube", icon: "▶️", rates: { post: 0.05, story: 0.01, reel: 0.025 } },
  { id: "twitter", name: "Twitter/X", icon: "🐦", rates: { post: 0.005, story: 0.002, reel: 0.008 } },
]

const contentTypes = [
  { id: "post", name: "Feed Post", multiplier: 1 },
  { id: "story", name: "Story", multiplier: 0.5 },
  { id: "reel", name: "Reel/Short", multiplier: 2 },
  { id: "video", name: "Long Video", multiplier: 5 },
]

const engagementRates = [
  { label: "Low (<1%)", multiplier: 0.7 },
  { label: "Average (1-3%)", multiplier: 1 },
  { label: "Good (3-6%)", multiplier: 1.3 },
  { label: "Excellent (6%+)", multiplier: 1.8 },
]

const niches = [
  { name: "Lifestyle", multiplier: 1 },
  { name: "Fashion", multiplier: 1.2 },
  { name: "Beauty", multiplier: 1.3 },
  { name: "Tech", multiplier: 1.4 },
  { name: "Finance", multiplier: 1.6 },
  { name: "Gaming", multiplier: 0.9 },
  { name: "Fitness", multiplier: 1.1 },
  { name: "Food", multiplier: 1 },
  { name: "Travel", multiplier: 1.2 },
  { name: "Parenting", multiplier: 1.1 },
]

export default function CalculatorPage() {
  const [followers, setFollowers] = useState("")
  const [platform, setPlatform] = useState("instagram")
  const [contentType, setContentType] = useState("post")
  const [engagement, setEngagement] = useState(1)
  const [niche, setNiche] = useState("Lifestyle")
  const [exclusivity, setExclusivity] = useState(false)
  const [usageRights, setUsageRights] = useState(false)

  const calculateRate = () => {
    const followerCount = parseInt(followers.replace(/,/g, "")) || 0
    if (followerCount === 0) return { min: 0, max: 0, recommended: 0 }

    const platformData = platforms.find(p => p.id === platform)
    const contentData = contentTypes.find(c => c.id === contentType)
    const nicheData = niches.find(n => n.name === niche)

    const baseRate = followerCount * (platformData?.rates.post || 0.01)
    const contentMultiplier = contentData?.multiplier || 1
    const nicheMultiplier = nicheData?.multiplier || 1

    let rate = baseRate * contentMultiplier * engagement * nicheMultiplier

    if (exclusivity) rate *= 1.5
    if (usageRights) rate *= 1.3

    const min = Math.round(rate * 0.7)
    const max = Math.round(rate * 1.3)
    const recommended = Math.round(rate)

    return { min, max, recommended }
  }

  const rates = calculateRate()

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`
    return `$${num}`
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-2">Rate Calculator</h1>
        <p className="text-zinc-500">Calculate how much to charge for sponsored content</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Calculator Form */}
        <div className="space-y-6">
          {/* Followers */}
          <Card className="bg-white/[0.02] border-white/5 rounded-2xl">
            <CardContent className="p-6">
              <label className="block text-sm font-medium mb-3">Follower Count</label>
              <Input
                type="text"
                placeholder="e.g. 50,000"
                value={followers}
                onChange={(e) => setFollowers(e.target.value.replace(/[^0-9,]/g, ""))}
                className="h-12 bg-white/5 border-white/10 rounded-xl text-lg"
              />
            </CardContent>
          </Card>

          {/* Platform */}
          <Card className="bg-white/[0.02] border-white/5 rounded-2xl">
            <CardContent className="p-6">
              <label className="block text-sm font-medium mb-3">Platform</label>
              <div className="grid grid-cols-2 gap-2">
                {platforms.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPlatform(p.id)}
                    className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                      platform === p.id
                        ? "bg-violet-500/20 border-violet-500/50 text-white"
                        : "bg-white/5 border-white/10 text-zinc-400 hover:border-white/20"
                    }`}
                  >
                    <span className="text-xl">{p.icon}</span>
                    <span className="text-sm font-medium">{p.name}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Content Type */}
          <Card className="bg-white/[0.02] border-white/5 rounded-2xl">
            <CardContent className="p-6">
              <label className="block text-sm font-medium mb-3">Content Type</label>
              <div className="grid grid-cols-2 gap-2">
                {contentTypes.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setContentType(c.id)}
                    className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                      contentType === c.id
                        ? "bg-violet-500/20 border-violet-500/50 text-white"
                        : "bg-white/5 border-white/10 text-zinc-400 hover:border-white/20"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Engagement Rate */}
          <Card className="bg-white/[0.02] border-white/5 rounded-2xl">
            <CardContent className="p-6">
              <label className="block text-sm font-medium mb-3">Engagement Rate</label>
              <div className="grid grid-cols-2 gap-2">
                {engagementRates.map((e) => (
                  <button
                    key={e.label}
                    onClick={() => setEngagement(e.multiplier)}
                    className={`p-3 rounded-xl border text-sm transition-all ${
                      engagement === e.multiplier
                        ? "bg-violet-500/20 border-violet-500/50 text-white"
                        : "bg-white/5 border-white/10 text-zinc-400 hover:border-white/20"
                    }`}
                  >
                    {e.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Niche */}
          <Card className="bg-white/[0.02] border-white/5 rounded-2xl">
            <CardContent className="p-6">
              <label className="block text-sm font-medium mb-3">Your Niche</label>
              <div className="flex flex-wrap gap-2">
                {niches.map((n) => (
                  <button
                    key={n.name}
                    onClick={() => setNiche(n.name)}
                    className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${
                      niche === n.name
                        ? "bg-violet-500/20 border-violet-500/50 text-white"
                        : "bg-white/5 border-white/10 text-zinc-400 hover:border-white/20"
                    }`}
                  >
                    {n.name}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Extras */}
          <Card className="bg-white/[0.02] border-white/5 rounded-2xl">
            <CardContent className="p-6">
              <label className="block text-sm font-medium mb-3">Additional Options</label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exclusivity}
                    onChange={(e) => setExclusivity(e.target.checked)}
                    className="w-5 h-5 rounded border-white/20 bg-white/5 text-violet-500"
                  />
                  <div>
                    <div className="text-sm font-medium">Exclusivity (+50%)</div>
                    <div className="text-xs text-zinc-500">Can't work with competitors</div>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={usageRights}
                    onChange={(e) => setUsageRights(e.target.checked)}
                    className="w-5 h-5 rounded border-white/20 bg-white/5 text-violet-500"
                  />
                  <div>
                    <div className="text-sm font-medium">Usage Rights (+30%)</div>
                    <div className="text-xs text-zinc-500">Brand can use in their ads</div>
                  </div>
                </label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:sticky lg:top-8 space-y-6">
          <Card className="bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-transparent border-violet-500/20 rounded-2xl overflow-hidden">
            <CardContent className="p-8">
              <h2 className="text-lg font-semibold mb-6">Your Rate Estimate</h2>

              {parseInt(followers.replace(/,/g, "")) > 0 ? (
                <>
                  <div className="text-center mb-8">
                    <div className="text-sm text-zinc-400 mb-2">Recommended Rate</div>
                    <div className="text-5xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                      {formatNumber(rates.recommended)}
                    </div>
                    <div className="text-sm text-zinc-500 mt-2">per {contentTypes.find(c => c.id === contentType)?.name}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 rounded-xl bg-white/5 text-center">
                      <div className="text-xs text-zinc-500 mb-1">Minimum</div>
                      <div className="text-xl font-semibold text-zinc-300">{formatNumber(rates.min)}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 text-center">
                      <div className="text-xs text-zinc-500 mb-1">Maximum</div>
                      <div className="text-xl font-semibold text-zinc-300">{formatNumber(rates.max)}</div>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-zinc-500">Platform</span>
                      <span>{platforms.find(p => p.id === platform)?.name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-zinc-500">Content Type</span>
                      <span>{contentTypes.find(c => c.id === contentType)?.name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-zinc-500">Niche</span>
                      <span>{niche}</span>
                    </div>
                    {exclusivity && (
                      <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="text-zinc-500">Exclusivity</span>
                        <span className="text-emerald-400">+50%</span>
                      </div>
                    )}
                    {usageRights && (
                      <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="text-zinc-500">Usage Rights</span>
                        <span className="text-emerald-400">+30%</span>
                      </div>
                    )}
                  </div>

                  <Button className="w-full mt-6 h-12 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-xl font-medium">
                    Create Contract with This Rate
                  </Button>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🧮</div>
                  <div className="text-zinc-400">Enter your follower count to see your rate</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="bg-white/[0.02] border-white/5 rounded-2xl">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">💡 Pro Tips</h3>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>• Always negotiate up from your minimum rate</li>
                <li>• Charge more for quick turnaround times</li>
                <li>• Add 20% for revision rounds beyond 2</li>
                <li>• Bundle deals for multiple posts at discount</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
