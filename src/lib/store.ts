import { create } from 'zustand'

interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
  // Subscription fields (Paddle)
  paddleCustomerId?: string
  paddleSubscriptionId?: string
  subscriptionStatus?: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete' | 'paused' | null
  plan?: 'free' | 'creator' | 'agency'
  planExpiresAt?: string
}

interface Contract {
  id: string
  title: string
  type: string
  status: 'draft' | 'pending_signature' | 'signed' | 'expired'
  created_at: string
  updated_at: string
  parties: {
    creator: string
    brand: string
  }
  content?: string
}

interface AppState {
  user: User | null
  contracts: Contract[]
  isLoading: boolean
  setUser: (user: User | null) => void
  setContracts: (contracts: Contract[]) => void
  addContract: (contract: Contract) => void
  updateContract: (id: string, updates: Partial<Contract>) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  contracts: [],
  isLoading: false,
  setUser: (user) => set({ user }),
  setContracts: (contracts) => set({ contracts }),
  addContract: (contract) => set((state) => ({
    contracts: [contract, ...state.contracts]
  })),
  updateContract: (id, updates) => set((state) => ({
    contracts: state.contracts.map((c) =>
      c.id === id ? { ...c, ...updates } : c
    )
  })),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null, contracts: [] }),
}))

// Contract templates
export const CONTRACT_TEMPLATES = [
  {
    id: 'sponsored-post',
    name: 'Sponsored Post',
    icon: '📱',
    description: 'Instagram, TikTok, YouTube sponsored content',
    category: 'social',
    fields: ['platform', 'deliverables', 'payment', 'timeline', 'exclusivity', 'usage_rights']
  },
  {
    id: 'brand-ambassador',
    name: 'Brand Ambassador',
    icon: '🤝',
    description: 'Long-term partnership agreement',
    category: 'partnership',
    fields: ['duration', 'monthly_deliverables', 'compensation', 'exclusivity', 'termination']
  },
  {
    id: 'ugc-license',
    name: 'UGC License',
    icon: '🎬',
    description: 'User-generated content rights transfer',
    category: 'content',
    fields: ['content_type', 'usage_rights', 'duration', 'payment', 'attribution']
  },
  {
    id: 'affiliate-deal',
    name: 'Affiliate Deal',
    icon: '💰',
    description: 'Commission-based partnership',
    category: 'affiliate',
    fields: ['commission_rate', 'tracking', 'payment_terms', 'exclusivity', 'duration']
  },
  {
    id: 'product-review',
    name: 'Product Review',
    icon: '⭐',
    description: 'Honest review agreement',
    category: 'content',
    fields: ['product', 'review_type', 'timeline', 'compensation', 'disclosure']
  },
  {
    id: 'event-appearance',
    name: 'Event Appearance',
    icon: '🎤',
    description: 'Live or virtual event participation',
    category: 'event',
    fields: ['event_details', 'duration', 'responsibilities', 'compensation', 'travel']
  },
  {
    id: 'whitelisting',
    name: 'Whitelisting',
    icon: '📊',
    description: 'Paid advertising permissions',
    category: 'advertising',
    fields: ['platforms', 'ad_types', 'duration', 'budget', 'approval_process']
  },
  {
    id: 'nda',
    name: 'NDA Agreement',
    icon: '🔒',
    description: 'Non-disclosure agreement',
    category: 'legal',
    fields: ['confidential_info', 'duration', 'exceptions', 'penalties']
  }
] as const

export type ContractTemplate = typeof CONTRACT_TEMPLATES[number]

// Governing Law Options
export const GOVERNING_LAW_OPTIONS = [
  { id: 'russia', name: 'Россия (законодательство РФ)', label: 'the laws of the Russian Federation' },
  { id: 'us-california', name: 'USA - California', label: 'the laws of the State of California, United States' },
  { id: 'us-new-york', name: 'USA - New York', label: 'the laws of the State of New York, United States' },
  { id: 'us-delaware', name: 'USA - Delaware', label: 'the laws of the State of Delaware, United States' },
  { id: 'uk', name: 'United Kingdom', label: 'the laws of England and Wales, United Kingdom' },
  { id: 'eu-germany', name: 'EU - Germany', label: 'the laws of the Federal Republic of Germany' },
] as const

export type GoverningLaw = typeof GOVERNING_LAW_OPTIONS[number]
