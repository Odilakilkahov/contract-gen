import { createClient } from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, rememberMe } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password required" },
        { status: 400 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const isDemoMode = !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')

    if (isDemoMode) {
      // Demo mode: create demo session cookie
      const userId = `demo-${Date.now()}`
      const userName = name || email.split("@")[0]

      const response = NextResponse.json({
        success: true,
        user: {
          id: userId,
          email,
          name: userName,
        },
        message: "Demo mode - account created successfully",
      })

      // Set demo session cookie
      const maxAge = rememberMe ? 30 * 24 * 60 * 60 : undefined // 30 days or session
      response.cookies.set("demo-session", JSON.stringify({
        id: userId,
        email,
        name: userName,
        createdAt: new Date().toISOString(),
      }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge,
        path: "/",
      })

      return response
    }

    // Real Supabase auth
    const supabase = createClient()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    })

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      user: data.user,
      message: "Check your email for confirmation",
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to sign up" },
      { status: 500 }
    )
  }
}
