"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

const steps = [
  {
    id: 1,
    title: "Welcome to ContractGen! 👋",
    description: "Create professional influencer contracts in minutes with AI assistance.",
    emoji: "🎉",
  },
  {
    id: 2,
    title: "Create Your First Contract",
    description: "Use our AI to generate legally-sound contracts tailored to your needs.",
    emoji: "📝",
  },
  {
    id: 3,
    title: "Get E-Signatures",
    description: "Send contracts for signing and track their status in real-time.",
    emoji: "✍️",
  },
  {
    id: 4,
    title: "Manage Everything",
    description: "Track contracts, analytics, invoices, and team members all in one place.",
    emoji: "📊",
  },
]

interface OnboardingProps {
  onComplete: () => void
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const router = useRouter()

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  const step = steps[currentStep]

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        {/* Progress */}
        <div className="flex gap-1 p-4 bg-gray-50 dark:bg-gray-900">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i <= currentStep
                  ? "bg-gradient-to-r from-violet-500 to-fuchsia-500"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-violet-900/30 dark:to-fuchsia-900/30 rounded-full flex items-center justify-center shadow-inner">
            <span className="text-6xl">{step.emoji}</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {step.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-sm mx-auto">
            {step.description}
          </p>

          <div className="flex gap-3 justify-center">
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
            >
              Skip
            </Button>
            <Button
              onClick={handleNext}
              className="px-8 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white"
            >
              {currentStep === steps.length - 1 ? "Get Started" : "Next"}
            </Button>
          </div>
        </div>

        {/* Step indicator */}
        <div className="pb-6 text-center">
          <span className="text-sm text-gray-400">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
      </div>
    </div>
  )
}

// Hook to manage onboarding state
export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("contractgen-onboarding-completed")
    if (!hasSeenOnboarding) {
      setShowOnboarding(true)
    }
    setIsLoading(false)
  }, [])

  const completeOnboarding = () => {
    localStorage.setItem("contractgen-onboarding-completed", "true")
    localStorage.setItem("contractgen-onboarding-date", new Date().toISOString())
    setShowOnboarding(false)
  }

  const resetOnboarding = () => {
    localStorage.removeItem("contractgen-onboarding-completed")
    localStorage.removeItem("contractgen-onboarding-date")
    setShowOnboarding(true)
  }

  return { showOnboarding, completeOnboarding, resetOnboarding, isLoading }
}
