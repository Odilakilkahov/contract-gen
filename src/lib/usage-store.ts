import { create } from "zustand"
import { persist } from "zustand/middleware"

export type PlanType = "free" | "creator" | "agency"

interface UsageState {
  contractsThisMonth: number
  lastResetDate: string
  plan: PlanType

  // Getters
  getLimit: () => number
  canCreateContract: () => boolean
  getUsagePercentage: () => number
  getRemainingContracts: () => number

  // Actions
  incrementUsage: () => void
  resetIfNewMonth: () => void
  setPlan: (plan: PlanType) => void
}

const LIMITS: Record<PlanType, number> = {
  free: 3,
  creator: Infinity,
  agency: Infinity,
}

const PLAN_NAMES: Record<PlanType, string> = {
  free: "Free",
  creator: "Creator",
  agency: "Agency",
}

export const getPlanName = (plan: PlanType): string => PLAN_NAMES[plan]

export const useUsageStore = create<UsageState>()(
  persist(
    (set, get) => ({
      contractsThisMonth: 0,
      lastResetDate: new Date().toISOString().slice(0, 7), // YYYY-MM
      plan: "free",

      getLimit: () => LIMITS[get().plan],

      canCreateContract: () => {
        const state = get()
        state.resetIfNewMonth()
        if (state.plan !== "free") return true
        return state.contractsThisMonth < LIMITS.free
      },

      getUsagePercentage: () => {
        const state = get()
        const limit = LIMITS[state.plan]
        if (limit === Infinity) return 0
        return Math.min((state.contractsThisMonth / limit) * 100, 100)
      },

      getRemainingContracts: () => {
        const state = get()
        const limit = LIMITS[state.plan]
        if (limit === Infinity) return Infinity
        return Math.max(limit - state.contractsThisMonth, 0)
      },

      incrementUsage: () => {
        set((state) => ({
          contractsThisMonth: state.contractsThisMonth + 1,
        }))
      },

      resetIfNewMonth: () => {
        const currentMonth = new Date().toISOString().slice(0, 7)
        if (get().lastResetDate !== currentMonth) {
          set({
            contractsThisMonth: 0,
            lastResetDate: currentMonth,
          })
        }
      },

      setPlan: (plan) => set({ plan }),
    }),
    { name: "contractgen-usage" }
  )
)
