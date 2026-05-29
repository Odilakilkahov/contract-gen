"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

type CookiePreferences = {
  necessary: boolean
  analytics: boolean
  marketing: boolean
}

const COOKIE_CONSENT_KEY = "cookie-consent"

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!stored) {
      setIsVisible(true)
    }
  }, [])

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(prefs))
    setIsVisible(false)
    setShowSettings(false)
  }

  const acceptAll = () => {
    saveConsent({ necessary: true, analytics: true, marketing: true })
  }

  const acceptNecessary = () => {
    saveConsent({ necessary: true, analytics: false, marketing: false })
  }

  const saveSettings = () => {
    saveConsent(preferences)
  }

  if (!isVisible) return null

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-[#E5E0D8] shadow-lg shadow-black/5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-[#444]">
              Мы используем cookies для улучшения работы сайта. Выберите, какие cookies вы хотите разрешить.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowSettings(true)}
              className="h-10 px-4 border-[#E5E0D8] bg-white hover:bg-[#f5f5f5] text-[#444] rounded-xl"
            >
              Настройки
            </Button>
            <Button
              variant="outline"
              onClick={acceptNecessary}
              className="h-10 px-4 border-[#E5E0D8] bg-white hover:bg-[#f5f5f5] text-[#444] rounded-xl"
            >
              Только необходимые
            </Button>
            <Button
              onClick={acceptAll}
              className="h-10 px-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-xl font-semibold shadow-lg shadow-violet-500/20"
            >
              Принять все
            </Button>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl">
            <div className="p-6 border-b border-[#E5E0D8]">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[#1a1a1a]">Настройки cookies</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 text-[#666] hover:text-[#1a1a1a] transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="mt-2 text-sm text-[#666]">
                Выберите, какие категории cookies вы хотите разрешить.
              </p>
            </div>

            <div className="p-6 space-y-4">
              {/* Necessary */}
              <div className="flex items-start justify-between gap-4 p-4 bg-[#FDF9F3] rounded-xl">
                <div className="flex-1">
                  <h3 className="font-medium text-[#1a1a1a]">Необходимые</h3>
                  <p className="mt-1 text-sm text-[#666]">
                    Эти cookies необходимы для работы сайта и не могут быть отключены.
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    className="w-5 h-5 rounded border-[#E5E0D8] bg-violet-600 text-violet-600 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Analytics */}
              <div className="flex items-start justify-between gap-4 p-4 bg-[#FDF9F3] rounded-xl">
                <div className="flex-1">
                  <h3 className="font-medium text-[#1a1a1a]">Аналитика</h3>
                  <p className="mt-1 text-sm text-[#666]">
                    Помогают нам понять, как посетители используют сайт.
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                    className="w-5 h-5 rounded border-[#E5E0D8] bg-white text-violet-600 focus:ring-violet-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Marketing */}
              <div className="flex items-start justify-between gap-4 p-4 bg-[#FDF9F3] rounded-xl">
                <div className="flex-1">
                  <h3 className="font-medium text-[#1a1a1a]">Маркетинг</h3>
                  <p className="mt-1 text-sm text-[#666]">
                    Используются для показа релевантной рекламы.
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                    className="w-5 h-5 rounded border-[#E5E0D8] bg-white text-violet-600 focus:ring-violet-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-[#E5E0D8] flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowSettings(false)}
                className="h-10 px-4 border-[#E5E0D8] bg-white hover:bg-[#f5f5f5] text-[#444] rounded-xl"
              >
                Отмена
              </Button>
              <Button
                onClick={saveSettings}
                className="h-10 px-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-xl font-semibold shadow-lg shadow-violet-500/20"
              >
                Сохранить настройки
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
