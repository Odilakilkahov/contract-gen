import { createClient } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const response = NextResponse.json({ success: true })

    // Always clear demo session cookie
    response.cookies.delete("demo-session")

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const isDemoMode = !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')

    // If Supabase is configured, also sign out from Supabase
    if (!isDemoMode) {
      const supabase = createClient()
      await supabase.auth.signOut()
    }

    return response
  } catch (error) {
    console.error("Logout error:", error)
    // Still clear the cookie even if there's an error
    const response = NextResponse.json(
      { success: false, error: "Failed to log out completely" },
      { status: 500 }
    )
    response.cookies.delete("demo-session")
    return response
  }
}
