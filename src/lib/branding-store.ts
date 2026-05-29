import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface BrandingSettings {
  companyName: string
  logo: string | null
  primaryColor: string
  accentColor: string
  emailFooter: string
  contractFooter: string
  customDomain: string | null
  // Additional white-label options
  hideContractGenBranding: boolean
  customEmailSender: string | null
  contractWatermark: string | null
}

interface BrandingState extends BrandingSettings {
  isLoaded: boolean
  isSaving: boolean
  setBranding: (branding: Partial<BrandingSettings>) => void
  resetBranding: () => void
  setLoaded: (loaded: boolean) => void
  setSaving: (saving: boolean) => void
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

export const useBrandingStore = create<BrandingState>()(
  persist(
    (set) => ({
      ...defaultBranding,
      isLoaded: false,
      isSaving: false,
      setBranding: (branding) => set((state) => ({ ...state, ...branding })),
      resetBranding: () => set({ ...defaultBranding, isLoaded: true }),
      setLoaded: (isLoaded) => set({ isLoaded }),
      setSaving: (isSaving) => set({ isSaving }),
    }),
    {
      name: 'branding-storage',
      partialize: (state) => ({
        companyName: state.companyName,
        logo: state.logo,
        primaryColor: state.primaryColor,
        accentColor: state.accentColor,
        emailFooter: state.emailFooter,
        contractFooter: state.contractFooter,
        customDomain: state.customDomain,
        hideContractGenBranding: state.hideContractGenBranding,
        customEmailSender: state.customEmailSender,
        contractWatermark: state.contractWatermark,
      }),
    }
  )
)

// Helper to get CSS variables from branding
export function getBrandingCSSVars(branding: Partial<BrandingSettings>) {
  return {
    '--brand-primary': branding.primaryColor || '#7c3aed',
    '--brand-accent': branding.accentColor || '#c026d3',
  } as React.CSSProperties
}

// Helper to convert hex to RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

// Helper to determine if text should be light or dark based on background
export function getContrastColor(hexColor: string): 'white' | 'black' {
  const rgb = hexToRgb(hexColor)
  if (!rgb) return 'white'

  // Calculate relative luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
  return luminance > 0.5 ? 'black' : 'white'
}
