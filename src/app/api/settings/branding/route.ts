import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// In a real app, this would be stored in a database
// For now, we use in-memory storage per user session
const brandingStorage = new Map<string, BrandingSettings>()

interface BrandingSettings {
  companyName: string
  logo: string | null
  primaryColor: string
  accentColor: string
  emailFooter: string
  contractFooter: string
  customDomain: string | null
  hideContractGenBranding: boolean
  customEmailSender: string | null
  contractWatermark: string | null
}

const defaultBranding: BrandingSettings = {
  companyName: '',
  logo: null,
  primaryColor: '#7c3aed',
  accentColor: '#c026d3',
  emailFooter: '',
  contractFooter: '',
  customDomain: null,
  hideContractGenBranding: false,
  customEmailSender: null,
  contractWatermark: null,
}

// Helper to get user ID from session
async function getUserId(): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('session')
    if (sessionCookie?.value) {
      // In production, validate and decode the session
      return sessionCookie.value
    }
    // For demo purposes, use a default user
    return 'demo-user'
  } catch {
    return 'demo-user'
  }
}

// Validate branding settings
function validateBranding(data: Partial<BrandingSettings>): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Validate company name length
  if (data.companyName && data.companyName.length > 100) {
    errors.push('Company name must be less than 100 characters')
  }

  // Validate colors are valid hex
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  if (data.primaryColor && !hexRegex.test(data.primaryColor)) {
    errors.push('Primary color must be a valid hex color')
  }
  if (data.accentColor && !hexRegex.test(data.accentColor)) {
    errors.push('Accent color must be a valid hex color')
  }

  // Validate logo size (base64 encoded images can be large)
  if (data.logo && data.logo.length > 500000) { // ~375KB after base64 encoding
    errors.push('Logo file is too large. Maximum size is 2MB')
  }

  // Validate footers length
  if (data.emailFooter && data.emailFooter.length > 1000) {
    errors.push('Email footer must be less than 1000 characters')
  }
  if (data.contractFooter && data.contractFooter.length > 1000) {
    errors.push('Contract footer must be less than 1000 characters')
  }

  // Validate custom domain format
  if (data.customDomain) {
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/
    if (!domainRegex.test(data.customDomain)) {
      errors.push('Invalid custom domain format')
    }
  }

  // Validate custom email sender format
  if (data.customEmailSender) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.customEmailSender)) {
      errors.push('Invalid email sender format')
    }
  }

  // Validate watermark length
  if (data.contractWatermark && data.contractWatermark.length > 50) {
    errors.push('Contract watermark must be less than 50 characters')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const branding = brandingStorage.get(userId) || defaultBranding

    return NextResponse.json({
      success: true,
      data: branding,
    })
  } catch (error) {
    console.error('[Branding API] GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch branding settings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validate input
    const validation = validateBranding(body)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.errors.join(', ') },
        { status: 400 }
      )
    }

    // Merge with existing settings
    const existingBranding = brandingStorage.get(userId) || defaultBranding
    const updatedBranding: BrandingSettings = {
      ...existingBranding,
      ...body,
    }

    // Save to storage
    brandingStorage.set(userId, updatedBranding)

    // In production, save to database:
    // await db.branding.upsert({
    //   where: { userId },
    //   create: { userId, ...updatedBranding },
    //   update: updatedBranding,
    // })

    return NextResponse.json({
      success: true,
      data: updatedBranding,
    })
  } catch (error) {
    console.error('[Branding API] POST error:', error)
    return NextResponse.json(
      { error: 'Failed to save branding settings' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserId()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Reset to default branding
    brandingStorage.set(userId, defaultBranding)

    return NextResponse.json({
      success: true,
      message: 'Branding settings reset to default',
    })
  } catch (error) {
    console.error('[Branding API] DELETE error:', error)
    return NextResponse.json(
      { error: 'Failed to reset branding settings' },
      { status: 500 }
    )
  }
}
