"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useUsageStore } from "@/lib/usage-store"

interface TeamMember {
  id: string
  name: string
  email: string
  role: "Admin" | "Member" | "Viewer"
  avatar: string
  joinedAt: string
}

const roleColors = {
  Admin: { bg: "bg-violet-100", text: "text-violet-700" },
  Member: { bg: "bg-blue-100", text: "text-blue-700" },
  Viewer: { bg: "bg-gray-100", text: "text-gray-600" },
}

const initialTeam: TeamMember[] = [
  {
    id: "1",
    name: "You",
    email: "you@example.com",
    role: "Admin",
    avatar: "Y",
    joinedAt: "Owner"
  },
]

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>(initialTeam)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<"Member" | "Viewer">("Member")
  const [showInvite, setShowInvite] = useState(false)
  const [inviteSent, setInviteSent] = useState(false)
  const plan = useUsageStore((state) => state.plan)

  const isAgency = plan === "agency"
  const maxMembers = 5

  const handleInvite = () => {
    if (!inviteEmail || !inviteEmail.includes("@")) return

    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      role: inviteRole,
      avatar: inviteEmail[0].toUpperCase(),
      joinedAt: "Invited",
    }

    setTeam([...team, newMember])
    setInviteEmail("")
    setShowInvite(false)
    setInviteSent(true)

    setTimeout(() => setInviteSent(false), 3000)
  }

  const handleRemoveMember = (id: string) => {
    if (id === "1") return // Can't remove owner
    setTeam(team.filter(m => m.id !== id))
  }

  const handleRoleChange = (id: string, newRole: "Member" | "Viewer") => {
    if (id === "1") return // Can't change owner role
    setTeam(team.map(m => m.id === id ? { ...m, role: newRole } : m))
  }

  // Non-agency plan: show upgrade prompt
  if (!isAgency) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Team</h1>
          <p className="text-gray-500">Collaborate with your team on contracts</p>
        </div>

        <Card className="bg-white border border-[#E5E0D8] shadow-sm max-w-lg mx-auto text-center">
          <CardContent className="p-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-2">Team Collaboration</h2>
            <p className="text-gray-500 mb-6">
              Invite up to 5 team members to collaborate on contracts, proposals, and workflows with the Agency plan.
            </p>

            <div className="bg-[#FDF9F3] rounded-lg p-4 mb-6">
              <h3 className="font-medium text-gray-900 mb-2">What you get:</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Up to 5 team members
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Role-based permissions
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Shared contract templates
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Team activity tracking
                </li>
              </ul>
            </div>

            <Link href="/dashboard/pricing">
              <Button className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 w-full">
                Upgrade to Agency - $49/mo
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Agency plan: show team management
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Team</h1>
          <p className="text-gray-500">Manage your team members and permissions</p>
        </div>
        <Button
          onClick={() => setShowInvite(true)}
          disabled={team.length >= maxMembers}
          className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Invite Member
        </Button>
      </div>

      {/* Success Toast */}
      {inviteSent && (
        <div className="fixed top-4 right-4 bg-emerald-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Invitation sent successfully!
        </div>
      )}

      {/* Invite Form */}
      {showInvite && (
        <Card className="bg-white border border-[#E5E0D8] shadow-sm mb-6">
          <CardHeader className="border-b border-[#E5E0D8]">
            <CardTitle className="text-lg font-semibold">Invite Team Member</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <Input
                  type="email"
                  placeholder="colleague@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full border-[#E5E0D8]"
                />
              </div>
              <div className="w-full md:w-40">
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as "Member" | "Viewer")}
                  className="w-full h-10 px-3 border border-[#E5E0D8] rounded-md bg-white text-gray-900"
                >
                  <option value="Member">Member</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
              <div className="flex items-end gap-2">
                <Button onClick={handleInvite} className="bg-violet-600 hover:bg-violet-500">
                  Send Invite
                </Button>
                <Button variant="outline" onClick={() => setShowInvite(false)} className="border-[#E5E0D8]">
                  Cancel
                </Button>
              </div>
            </div>
            <div className="mt-4 p-3 bg-[#FDF9F3] rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Member:</strong> Can create and edit contracts, proposals, and invoices.
                <br />
                <strong>Viewer:</strong> Can view all content but cannot make changes.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Members List */}
      <Card className="bg-white border border-[#E5E0D8] shadow-sm">
        <CardHeader className="border-b border-[#E5E0D8]">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Team Members</CardTitle>
            <span className="text-sm text-gray-500">{team.length}/{maxMembers} members</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-[#E5E0D8]">
            {team.map((member) => {
              const roleStyle = roleColors[member.role]
              const isOwner = member.id === "1"

              return (
                <div key={member.id} className="flex items-center justify-between p-6 hover:bg-[#FDF9F3] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-semibold text-lg">
                      {member.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{member.name}</p>
                        {isOwner && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Owner</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{member.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">{member.joinedAt}</span>

                    {isOwner ? (
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${roleStyle.bg} ${roleStyle.text}`}>
                        {member.role}
                      </span>
                    ) : (
                      <select
                        value={member.role}
                        onChange={(e) => handleRoleChange(member.id, e.target.value as "Member" | "Viewer")}
                        className={`px-3 py-1 rounded-full text-sm font-medium border-0 cursor-pointer ${roleStyle.bg} ${roleStyle.text}`}
                      >
                        <option value="Member">Member</option>
                        <option value="Viewer">Viewer</option>
                      </select>
                    )}

                    {!isOwner && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Team Stats */}
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <Card className="bg-white border border-[#E5E0D8] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Available Seats</p>
                <p className="text-xl font-bold text-gray-900">{maxMembers - team.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-[#E5E0D8] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Members</p>
                <p className="text-xl font-bold text-gray-900">{team.filter(m => m.joinedAt !== "Invited").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-[#E5E0D8] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending Invites</p>
                <p className="text-xl font-bold text-gray-900">{team.filter(m => m.joinedAt === "Invited").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
