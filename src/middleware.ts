import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const PROTECTED_ROUTES = ['/dashboard']
const AUTH_ROUTES = ['/login', '/signup']

// Create intl middleware
const intlMiddleware = createIntlMiddleware(routing)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // First, handle i18n routing
  const response = intlMiddleware(request)

  // Get the pathname without locale prefix for auth checks
  const pathnameWithoutLocale = pathname.replace(/^\/(en|ru|es|de|fr|zh|ja|ko|pt|ar)/, '') || '/'

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Check for demo session cookie (works without Supabase)
  const demoSession = request.cookies.get('demo-session')?.value
  const isDemoMode = !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')

  // Demo mode - use cookie-based session
  if (isDemoMode) {
    const isAuthenticated = !!demoSession

    // Protect dashboard routes
    if (PROTECTED_ROUTES.some(route => pathnameWithoutLocale.startsWith(route))) {
      if (!isAuthenticated) {
        const locale = pathname.match(/^\/(en|ru|es|de|fr|zh|ja|ko|pt|ar)/)?.[1] || 'en'
        return NextResponse.redirect(new URL(`/${locale}/login`, request.url))
      }
    }

    // Redirect authenticated users away from auth pages
    if (AUTH_ROUTES.some(route => pathnameWithoutLocale.startsWith(route))) {
      if (isAuthenticated) {
        const locale = pathname.match(/^\/(en|ru|es|de|fr|zh|ja|ko|pt|ar)/)?.[1] || 'en'
        return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url))
      }
    }

    return response
  }

  // Real Supabase mode
  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protected routes - redirect to login if not authenticated
  if (PROTECTED_ROUTES.some(route => pathnameWithoutLocale.startsWith(route))) {
    if (!user) {
      const locale = pathname.match(/^\/(en|ru|es|de|fr|zh|ja|ko|pt|ar)/)?.[1] || 'en'
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url))
    }
  }

  // Auth routes - redirect to dashboard if already authenticated
  if (AUTH_ROUTES.some(route => pathnameWithoutLocale.startsWith(route))) {
    if (user) {
      const locale = pathname.match(/^\/(en|ru|es|de|fr|zh|ja|ko|pt|ar)/)?.[1] || 'en'
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - /api (API routes)
    // - /_next (Next.js internals)
    // - /static (static files)
    // - .*\\..*  (files with extensions like .png, .css)
    '/((?!api|_next|static|.*\\..*).*)',
  ],
}
