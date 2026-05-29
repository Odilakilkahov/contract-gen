"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppStore } from "@/lib/store"

const socialPlatforms = [
  { id: "instagram", name: "Instagram", icon: "📸", color: "from-pink-500 to-purple-500" },
  { id: "tiktok", name: "TikTok", icon: "🎵", color: "from-cyan-500 to-pink-500" },
  { id: "youtube", name: "YouTube", icon: "▶️", color: "from-red-500 to-red-600" },
  { id: "twitter", name: "Twitter/X", icon: "🐦", color: "from-blue-400 to-blue-500" },
]

const defaultStats = {
  instagram: { followers: "", engagement: "", avgLikes: "" },
  tiktok: { followers: "", engagement: "", avgViews: "" },
  youtube: { followers: "", engagement: "", avgViews: "" },
  twitter: { followers: "", engagement: "", avgLikes: "" },
}

export default function MediaKitPage() {
  const user = useAppStore((state) => state.user)
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit")
  const [profile, setProfile] = useState({
    name: user?.name || "",
    bio: "",
    location: "",
    email: user?.email || "",
    website: "",
    niches: [] as string[],
  })
  const [stats, setStats] = useState(defaultStats)
  const [collaborations, setCollaborations] = useState<string[]>([])
  const [newBrand, setNewBrand] = useState("")

  const allNiches = ["Lifestyle", "Fashion", "Beauty", "Tech", "Gaming", "Fitness", "Food", "Travel", "Parenting", "Finance", "Entertainment", "Education"]

  const toggleNiche = (niche: string) => {
    setProfile(prev => ({
      ...prev,
      niches: prev.niches.includes(niche)
        ? prev.niches.filter(n => n !== niche)
        : [...prev.niches, niche]
    }))
  }

  const addBrand = () => {
    if (newBrand && !collaborations.includes(newBrand)) {
      setCollaborations([...collaborations, newBrand])
      setNewBrand("")
    }
  }

  const removeBrand = (brand: string) => {
    setCollaborations(collaborations.filter(b => b !== brand))
  }

  const totalFollowers = Object.values(stats).reduce((sum, platform) => {
    return sum + (parseInt(platform.followers?.replace(/,/g, "") || "0") || 0)
  }, 0)

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Media Kit Builder</h1>
          <p className="text-zinc-500">Create a professional media kit to share with brands</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={activeTab === "edit" ? "default" : "outline"}
            onClick={() => setActiveTab("edit")}
            className={activeTab === "edit" ? "bg-violet-600" : "border-white/10"}
          >
            Edit
          </Button>
          <Button
            variant={activeTab === "preview" ? "default" : "outline"}
            onClick={() => setActiveTab("preview")}
            className={activeTab === "preview" ? "bg-violet-600" : "border-white/10"}
          >
            Preview
          </Button>
        </div>
      </div>

      {activeTab === "edit" ? (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Profile Info */}
          <Card className="bg-white/[0.02] border-white/5 rounded-2xl">
            <CardContent className="p-6">
              <h2 className="font-semibold mb-4">Profile Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Display Name</label>
                  <Input
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    placeholder="Your name or handle"
                    className="bg-white/5 border-white/10 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Bio</label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    placeholder="Tell brands about yourself..."
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder:text-zinc-500 resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">Location</label>
                    <Input
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      placeholder="City, Country"
                      className="bg-white/5 border-white/10 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">Website</label>
                    <Input
                      value={profile.website}
                      onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                      placeholder="yoursite.com"
                      className="bg-white/5 border-white/10 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Niches */}
          <Card className="bg-white/[0.02] border-white/5 rounded-2xl">
            <CardContent className="p-6">
              <h2 className="font-semibold mb-4">Content Niches</h2>
              <div className="flex flex-wrap gap-2">
                {allNiches.map((niche) => (
                  <button
                    key={niche}
                    onClick={() => toggleNiche(niche)}
                    className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${
                      profile.niches.includes(niche)
                        ? "bg-violet-500/20 border-violet-500/50 text-white"
                        : "bg-white/5 border-white/10 text-zinc-400 hover:border-white/20"
                    }`}
                  >
                    {niche}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Social Stats */}
          {socialPlatforms.map((platform) => (
            <Card key={platform.id} className="bg-white/[0.02] border-white/5 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">{platform.icon}</span>
                  <h2 className="font-semibold">{platform.name}</h2>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">Followers</label>
                    <Input
                      value={stats[platform.id as keyof typeof stats].followers}
                      onChange={(e) => setStats({
                        ...stats,
                        [platform.id]: { ...stats[platform.id as keyof typeof stats], followers: e.target.value }
                      })}
                      placeholder="50,000"
                      className="bg-white/5 border-white/10 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">Engagement %</label>
                    <Input
                      value={stats[platform.id as keyof typeof stats].engagement}
                      onChange={(e) => setStats({
                        ...stats,
                        [platform.id]: { ...stats[platform.id as keyof typeof stats], engagement: e.target.value }
                      })}
                      placeholder="4.5%"
                      className="bg-white/5 border-white/10 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">Avg Likes/Views</label>
                    <Input
                      value={(stats[platform.id as keyof typeof stats] as any).avgLikes || (stats[platform.id as keyof typeof stats] as any).avgViews || ""}
                      onChange={(e) => setStats({
                        ...stats,
                        [platform.id]: {
                          ...stats[platform.id as keyof typeof stats],
                          ...(platform.id === "youtube" || platform.id === "tiktok"
                            ? { avgViews: e.target.value }
                            : { avgLikes: e.target.value })
                        }
                      })}
                      placeholder="2,500"
                      className="bg-white/5 border-white/10 rounded-lg text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Brand Collaborations */}
          <Card className="bg-white/[0.02] border-white/5 rounded-2xl lg:col-span-2">
            <CardContent className="p-6">
              <h2 className="font-semibold mb-4">Past Brand Collaborations</h2>
              <div className="flex gap-2 mb-4">
                <Input
                  value={newBrand}
                  onChange={(e) => setNewBrand(e.target.value)}
                  placeholder="Add brand name..."
                  className="bg-white/5 border-white/10 rounded-xl"
                  onKeyDown={(e) => e.key === "Enter" && addBrand()}
                />
                <Button onClick={addBrand} className="bg-violet-600 hover:bg-violet-500">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {collaborations.map((brand) => (
                  <span
                    key={brand}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm"
                  >
                    {brand}
                    <button onClick={() => removeBrand(brand)} className="ml-1 text-zinc-500 hover:text-white">
                      ×
                    </button>
                  </span>
                ))}
                {collaborations.length === 0 && (
                  <span className="text-zinc-500 text-sm">No brands added yet</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Preview Mode */
        <div className="max-w-3xl mx-auto">
          <Card className="bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-transparent border-violet-500/20 rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-4xl font-bold">
                  {profile.name.charAt(0).toUpperCase() || "?"}
                </div>
                <h1 className="text-3xl font-bold mb-2">{profile.name || "Your Name"}</h1>
                <p className="text-zinc-400 max-w-md mx-auto">{profile.bio || "Your bio will appear here"}</p>
                {profile.location && (
                  <p className="text-sm text-zinc-500 mt-2">📍 {profile.location}</p>
                )}
              </div>

              {/* Niches */}
              {profile.niches.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {profile.niches.map((niche) => (
                    <span key={niche} className="px-3 py-1 bg-violet-500/20 text-violet-300 rounded-full text-sm">
                      {niche}
                    </span>
                  ))}
                </div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="p-4 bg-white/5 rounded-xl text-center">
                  <div className="text-2xl font-bold text-violet-400">{formatNumber(totalFollowers)}</div>
                  <div className="text-xs text-zinc-500">Total Followers</div>
                </div>
                {socialPlatforms.map((platform) => {
                  const platformStats = stats[platform.id as keyof typeof stats]
                  const followers = parseInt(platformStats.followers?.replace(/,/g, "") || "0")
                  if (followers === 0) return null
                  return (
                    <div key={platform.id} className="p-4 bg-white/5 rounded-xl text-center">
                      <div className="text-lg mb-1">{platform.icon}</div>
                      <div className="text-xl font-bold">{formatNumber(followers)}</div>
                      <div className="text-xs text-zinc-500">{platformStats.engagement || "—"} eng.</div>
                    </div>
                  )
                })}
              </div>

              {/* Brand Collaborations */}
              {collaborations.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm text-zinc-400 text-center mb-3">WORKED WITH</h3>
                  <div className="flex flex-wrap justify-center gap-3">
                    {collaborations.map((brand) => (
                      <span key={brand} className="px-4 py-2 bg-white/5 rounded-lg text-sm font-medium">
                        {brand}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact */}
              <div className="text-center pt-6 border-t border-white/10">
                <p className="text-sm text-zinc-400 mb-2">For collaborations:</p>
                <p className="font-medium">{profile.email || user?.email}</p>
                {profile.website && (
                  <p className="text-sm text-violet-400 mt-1">{profile.website}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-3 mt-6">
            <Button className="bg-violet-600 hover:bg-violet-500">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PDF
            </Button>
            <Button variant="outline" className="border-white/10">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share Link
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
