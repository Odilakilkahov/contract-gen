"use client"

import { useState } from "react"
import Link from "next/link"

// ─── Inline SVG illustrations ────────────────────────────────────────────────

function IllustrationContract() {
  return (
    <div className="relative w-full max-w-sm">
      {/* Shadow layer */}
      <div className="absolute inset-0 translate-x-3 translate-y-3 bg-[#E8E0D4] rounded-2xl" />

      {/* Main contract document */}
      <div className="relative bg-white rounded-2xl border border-[#E5E0D8] shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-[#7DD3C0] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/30 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <div className="text-white font-semibold text-sm">Influencer Agreement</div>
              <div className="text-white/70 text-xs">ID: CG-2026-0847</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Parties */}
          <div>
            <div className="text-[#7DD3C0] font-semibold text-[10px] uppercase tracking-wider mb-2">Стороны</div>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-500">Бренд:</span>
                <span className="font-medium text-gray-800">Nike Inc.</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Креатор:</span>
                <span className="font-medium text-gray-800">@fitness_anna</span>
              </div>
            </div>
          </div>

          <div className="border-t border-dashed border-gray-200" />

          {/* Terms */}
          <div>
            <div className="text-[#FFB347] font-semibold text-[10px] uppercase tracking-wider mb-2">Условия</div>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-500">Гонорар:</span>
                <span className="font-bold text-[#7DD3C0]">$3,500</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Контент:</span>
                <span className="font-medium text-gray-800">3 Reels + Stories</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Дедлайн:</span>
                <span className="font-medium text-gray-800">15 июня 2026</span>
              </div>
            </div>
          </div>

          <div className="border-t border-dashed border-gray-200" />

          {/* Signature */}
          <div>
            <div className="text-gray-400 font-semibold text-[10px] uppercase tracking-wider mb-2">Подпись</div>
            <div className="bg-[#F8F5F0] rounded-lg p-3 border border-dashed border-[#E5E0D8]">
              <svg viewBox="0 0 120 30" className="w-24 h-6">
                <path
                  d="M5 20 Q15 5 25 18 Q35 28 45 15 Q55 5 65 20 Q75 30 85 12 L95 18"
                  stroke="#7DD3C0"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
              <div className="text-[10px] text-gray-400 mt-1">Anna Petrova • 28 мая 2026</div>
            </div>
          </div>
        </div>

        {/* Footer badge */}
        <div className="absolute -bottom-3 -right-3 w-14 h-14 bg-[#7DD3C0] rounded-full flex items-center justify-center shadow-lg border-4 border-white">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      {/* Floating price tag */}
      <div className="absolute -bottom-2 -left-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5">
        <span className="text-orange-200">💰</span>
        $3,500 / бренд
      </div>
    </div>
  )
}

function IllustrationFast() {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-24 h-24">
      <circle cx="60" cy="60" r="56" fill="#FFD54F" fillOpacity="0.15" />
      <circle cx="60" cy="60" r="40" fill="#FFD54F" fillOpacity="0.25" />
      {/* Lightning bolt */}
      <path d="M68 24 L44 64 H60 L52 96 L80 52 H64 Z" fill="#FFD54F" stroke="#E6BE00" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

function IllustrationShield() {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-24 h-24">
      <circle cx="60" cy="60" r="56" fill="#7DD3C0" fillOpacity="0.15" />
      <circle cx="60" cy="60" r="40" fill="#7DD3C0" fillOpacity="0.25" />
      {/* Shield */}
      <path d="M60 28 L84 38 L84 60 C84 74 72 84 60 90 C48 84 36 74 36 60 L36 38 Z" fill="#7DD3C0" stroke="#5BB8A8" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M50 60 L57 67 L72 52" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IllustrationClear() {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-24 h-24">
      <circle cx="60" cy="60" r="56" fill="#FF8A65" fillOpacity="0.15" />
      <circle cx="60" cy="60" r="40" fill="#FF8A65" fillOpacity="0.25" />
      {/* Document with star */}
      <rect x="36" y="30" width="48" height="60" rx="8" fill="#FF8A65" />
      <rect x="44" y="42" width="32" height="4" rx="2" fill="white" fillOpacity="0.7" />
      <rect x="44" y="52" width="24" height="4" rx="2" fill="white" fillOpacity="0.5" />
      <rect x="44" y="62" width="28" height="4" rx="2" fill="white" fillOpacity="0.5" />
      {/* Star badge */}
      <circle cx="72" cy="76" r="12" fill="white" />
      <path d="M72 68 L73.8 73.5 H79.5 L74.8 76.8 L76.6 82.3 L72 79 L67.4 82.3 L69.2 76.8 L64.5 73.5 H70.2 Z" fill="#FF8A65" />
    </svg>
  )
}

function LogoYouTube() {
  return (
    <svg viewBox="0 0 90 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-7">
      <rect x="0" y="2" width="28" height="20" rx="6" fill="#C4B8A8" />
      <path d="M19 12 L13 8.5 V15.5 Z" fill="#FDF9F3" />
      <text x="34" y="18" fontFamily="Inter, sans-serif" fontSize="14" fontWeight="600" fill="#C4B8A8">YouTube</text>
    </svg>
  )
}

function LogoTikTok() {
  return (
    <svg viewBox="0 0 80 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-7">
      <path d="M14 4 C14 4 14 14 8 14 C5 14 4 11 4 9 C4 6 6 4 9 4 L9 8 C7.5 8 7 9 7 9.5 C7 11 8 11 8.5 11 C11 11 11 7 11 4 H14 Z" fill="#C4B8A8" />
      <path d="M14 9 C15 9.5 16.5 10 18 10 L18 7 C17 7 15.5 6.5 14 5.5 L14 9 Z" fill="#C4B8A8" />
      <text x="22" y="18" fontFamily="Inter, sans-serif" fontSize="14" fontWeight="600" fill="#C4B8A8">TikTok</text>
    </svg>
  )
}

function LogoInstagram() {
  return (
    <svg viewBox="0 0 100 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-7">
      <rect x="2" y="2" width="20" height="20" rx="6" stroke="#C4B8A8" strokeWidth="2" fill="none" />
      <circle cx="12" cy="12" r="4" stroke="#C4B8A8" strokeWidth="2" fill="none" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="#C4B8A8" />
      <text x="28" y="18" fontFamily="Inter, sans-serif" fontSize="14" fontWeight="600" fill="#C4B8A8">Instagram</text>
    </svg>
  )
}

function LogoTwitch() {
  return (
    <svg viewBox="0 0 80 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-7">
      <path d="M4 4 L4 18 L8 18 L8 22 L12 18 L16 18 L20 14 L20 4 Z" stroke="#C4B8A8" strokeWidth="2" fill="none" strokeLinejoin="round" />
      <rect x="9" y="8" width="2" height="6" rx="1" fill="#C4B8A8" />
      <rect x="13" y="8" width="2" height="6" rx="1" fill="#C4B8A8" />
      <text x="24" y="18" fontFamily="Inter, sans-serif" fontSize="14" fontWeight="600" fill="#C4B8A8">Twitch</text>
    </svg>
  )
}

function PlatformBadge({ name, icon }: { name: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white/90 backdrop-blur rounded-full border border-[#E8E0D4] hover:border-[#D0C8BC] hover:shadow-md transition-all cursor-default group">
      <span className="w-5 h-5 flex items-center justify-center group-hover:scale-110 transition-transform">{icon}</span>
      <span className="text-sm font-medium text-gray-700 whitespace-nowrap">{name}</span>
    </div>
  )
}

// Official platform icons
const PlatformIcons = {
  YouTube: (
    <svg viewBox="0 0 24 24" fill="#FF0000" className="w-5 h-5">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  TikTok: (
    <svg viewBox="0 0 24 24" fill="#000000" className="w-5 h-5">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  ),
  Instagram: (
    <svg viewBox="0 0 24 24" fill="url(#instagram-gradient)" className="w-5 h-5">
      <defs>
        <linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFDC80"/>
          <stop offset="25%" stopColor="#F77737"/>
          <stop offset="50%" stopColor="#E1306C"/>
          <stop offset="75%" stopColor="#C13584"/>
          <stop offset="100%" stopColor="#833AB4"/>
        </linearGradient>
      </defs>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  ),
  Twitch: (
    <svg viewBox="0 0 24 24" fill="#9146FF" className="w-5 h-5">
      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
    </svg>
  ),
  Twitter: (
    <svg viewBox="0 0 24 24" fill="#000000" className="w-5 h-5">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  Telegram: (
    <svg viewBox="0 0 24 24" fill="#26A5E4" className="w-5 h-5">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  ),
  Pinterest: (
    <svg viewBox="0 0 24 24" fill="#E60023" className="w-5 h-5">
      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
    </svg>
  ),
  LinkedIn: (
    <svg viewBox="0 0 24 24" fill="#0A66C2" className="w-5 h-5">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  Snapchat: (
    <svg viewBox="0 0 24 24" fill="#FFFC00" className="w-5 h-5">
      <path stroke="#000" strokeWidth="0.5" d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301a.42.42 0 0 1 .45.045.534.534 0 0 1 .195.435c0 .255-.12.51-.36.615-1.035.57-1.425.99-1.455 1.335.06.27.45.57 1.065.855.12.06.285.105.45.165.39.12.855.255 1.155.51.225.195.33.435.33.72 0 .165-.03.33-.09.51-.12.495-.885 1.425-3.9 1.695l-.27.015c-.06.195-.12.45-.195.675-.045.21-.18.315-.435.315-.135 0-.3-.045-.45-.075-.285-.045-.705-.09-1.2-.09-.525 0-.975.045-1.29.09-.435.06-.645.09-.81.09-.105 0-.345-.06-.45-.315-.045-.12-.12-.315-.195-.585-.045-.195-.12-.405-.165-.57-3.135-.285-3.9-1.275-4.02-1.755a.93.93 0 0 1-.075-.39c0-.285.12-.525.33-.72.3-.255.765-.39 1.155-.51a4.07 4.07 0 0 0 .45-.165c.63-.285 1.005-.585 1.065-.855-.03-.345-.435-.765-1.455-1.335a.72.72 0 0 1-.36-.615.56.56 0 0 1 .195-.435.45.45 0 0 1 .45-.045c.375.18.72.301 1.035.301.195 0 .33-.045.405-.09a9.89 9.89 0 0 1-.03-.51c-.015-.63-.033-1.215-.033-1.83 0-1.065.21-1.965.63-2.73C7.932 1.274 10.326.793 12.206.793z"/>
    </svg>
  ),
  Discord: (
    <svg viewBox="0 0 24 24" fill="#5865F2" className="w-5 h-5">
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/>
    </svg>
  ),
  Podcasts: (
    <svg viewBox="0 0 24 24" fill="#8B5CF6" className="w-5 h-5">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 3.6a8.4 8.4 0 110 16.8 8.4 8.4 0 010-16.8zm0 2.4a6 6 0 100 12 6 6 0 000-12zm0 2.4a3.6 3.6 0 110 7.2 3.6 3.6 0 010-7.2zm0 1.2a2.4 2.4 0 100 4.8 2.4 2.4 0 000-4.8zm0 .6a1.8 1.8 0 110 3.6 1.8 1.8 0 010-3.6z"/>
    </svg>
  ),
  Blogs: (
    <svg viewBox="0 0 24 24" fill="#FF6B35" className="w-5 h-5">
      <path d="M19.5 3h-15A1.5 1.5 0 003 4.5v15A1.5 1.5 0 004.5 21h15a1.5 1.5 0 001.5-1.5v-15A1.5 1.5 0 0019.5 3zM6 6h12v2H6V6zm0 4h12v2H6v-2zm0 4h8v2H6v-2z"/>
    </svg>
  ),
}

// ─── FAQ accordion ────────────────────────────────────────────────────────────

const faqs = [
  {
    q: "Нужен ли мне юрист для использования ContractGen?",
    a: "Нет. Наши шаблоны разработаны юристами, специализирующимися на медиа-праве. Ты отвечаешь на вопросы — ИИ собирает корректный контракт автоматически.",
  },
  {
    q: "Контракты имеют юридическую силу?",
    a: "Да. Электронные подписи признаются в большинстве юрисдикций согласно законам об ЭЦП. Контракты содержат все необходимые клаузулы для защиты обеих сторон.",
  },
  {
    q: "Какие типы контрактов доступны?",
    a: "Спонсорские посты, UGC-контент, амбассадорство, NDA, лицензирование контента, совместные проекты и другие — более 8 шаблонов.",
  },
  {
    q: "Можно ли редактировать готовый контракт?",
    a: "Конечно. После генерации ты можешь редактировать любой раздел, добавлять свои клаузулы и сохранять изменённый шаблон для будущего использования.",
  },
  {
    q: "Как работает e-подпись?",
    a: "Ты отправляешь ссылку бренду. Они подписывают прямо в браузере — без скачивания и регистрации. Ты получаешь уведомление в реальном времени.",
  },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="border border-[#E8E0D4] rounded-2xl overflow-hidden transition-all duration-200"
      style={{ background: open ? "#FFFCF7" : "#FDF9F3" }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 cursor-pointer"
      >
        <span
          className="text-[#1A1A1A] font-medium text-[15px] leading-snug"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {q}
        </span>
        <span
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            background: open ? "#7DD3C0" : "#E8E0D4",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2V12M2 7H12" stroke={open ? "white" : "#8A7E72"} strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      {open && (
        <div
          className="px-6 pb-5 text-[14px] leading-relaxed"
          style={{ color: "#4A4A4A", fontFamily: "var(--font-inter)" }}
        >
          {a}
        </div>
      )}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div
      className="min-h-screen antialiased"
      style={{ background: "#FDF9F3", color: "#1A1A1A", fontFamily: "var(--font-inter)" }}
    >

      {/* ── NAV ── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 border-b"
        style={{ background: "rgba(253,249,243,0.92)", backdropFilter: "blur(12px)", borderColor: "#E8E0D4" }}
      >
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105"
              style={{ background: "#7DD3C0" }}
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span
              className="font-semibold text-[15px]"
              style={{ fontFamily: "var(--font-fraunces)", color: "#1A1A1A" }}
            >
              ContractGen
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {[
              { label: "Возможности", href: "#features" },
              { label: "Как это работает", href: "#how" },
              { label: "Цены", href: "#pricing" },
              { label: "FAQ", href: "#faq" },
            ].map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="px-4 py-2 text-[13px] rounded-lg transition-colors"
                style={{ color: "#4A4A4A" }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = "#F0EBE2"
                  ;(e.currentTarget as HTMLElement).style.color = "#1A1A1A"
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = "transparent"
                  ;(e.currentTarget as HTMLElement).style.color = "#4A4A4A"
                }}
              >
                {label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="h-9 px-4 text-[13px] rounded-lg flex items-center transition-colors"
              style={{ color: "#4A4A4A" }}
            >
              Войти
            </Link>
            <Link
              href="/signup"
              className="h-9 px-5 text-[13px] font-semibold rounded-lg flex items-center transition-all hover:scale-[1.03]"
              style={{ background: "#7DD3C0", color: "white" }}
            >
              Начать бесплатно
            </Link>
          </div>
        </nav>
      </header>

      {/* ── HERO ── */}
      <section className="pt-28 pb-16 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left: copy */}
            <div>
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[12px] font-medium mb-8"
                style={{ background: "#FFD54F22", border: "1px solid #FFD54F88", color: "#8A6800" }}
              >
                <span className="w-2 h-2 rounded-full" style={{ background: "#FFD54F" }} />
                ИИ-генерация · Без юриста · FTC-совместимо
              </div>

              <h1
                className="text-5xl sm:text-6xl leading-[1.1] mb-6"
                style={{ fontFamily: "var(--font-fraunces)", fontWeight: 600, color: "#1A1A1A" }}
              >
                Контракты{" "}
                <span
                  className="relative inline-block"
                  style={{ color: "#7DD3C0" }}
                >
                  за 2 минуты
                  {/* underline squiggle */}
                  <svg
                    viewBox="0 0 200 12"
                    className="absolute -bottom-2 left-0 w-full"
                    preserveAspectRatio="none"
                    fill="none"
                  >
                    <path d="M2 8 Q30 2 60 8 Q90 14 120 8 Q150 2 180 8 Q195 11 198 8" stroke="#7DD3C0" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6" />
                  </svg>
                </span>
                .{" "}
                <br />
                <span style={{ color: "#FF8A65" }}>Без юриста.</span>
              </h1>

              <p
                className="text-lg leading-relaxed mb-10 max-w-lg"
                style={{ color: "#4A4A4A" }}
              >
                Опиши сделку — ИИ соберёт юридически грамотный контракт.
                Отправь на e-подпись прямо из браузера. Работает для YouTube, TikTok, Instagram и Twitch.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4 mb-10">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 h-13 px-7 text-[15px] font-semibold rounded-xl transition-all hover:scale-[1.03] hover:shadow-lg"
                  style={{ background: "#7DD3C0", color: "white", boxShadow: "0 4px 20px #7DD3C044" }}
                >
                  Создать контракт бесплатно
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="/signup?demo=true"
                  className="inline-flex items-center gap-2 h-13 px-6 text-[15px] font-medium rounded-xl border transition-all hover:scale-[1.02]"
                  style={{ borderColor: "#E8E0D4", color: "#4A4A4A", background: "white" }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Watch Demo
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-5 text-[13px]" style={{ color: "#8A7E72" }}>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="#7DD3C0" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Бесплатный тариф
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="#7DD3C0" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Без карты
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="#7DD3C0" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  5 000+ креаторов
                </span>
              </div>
            </div>

            {/* Right: illustration */}
            <div className="relative flex justify-center">
              {/* Background blob */}
              <div
                className="absolute inset-0 rounded-3xl"
                style={{ background: "radial-gradient(ellipse at 60% 40%, #7DD3C022 0%, transparent 70%)" }}
              />
              {/* Floating accent chips */}
              <div
                className="absolute -top-4 -left-4 px-4 py-2 rounded-2xl text-[13px] font-semibold shadow-md"
                style={{ background: "#FFD54F", color: "#5A4500" }}
              >
                ✅ Подписано!
              </div>
              <div
                className="absolute -bottom-4 -right-4 px-4 py-2 rounded-2xl text-[13px] font-semibold shadow-md"
                style={{ background: "#FF8A65", color: "white" }}
              >
                💰 $3 500 / бренд
              </div>
              <div className="relative w-[280px] sm:w-[320px]">
                <IllustrationContract />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section className="py-10 border-y overflow-hidden" style={{ borderColor: "#E8E0D4" }}>
        <div className="max-w-5xl mx-auto px-6">
          <p
            className="text-center text-[12px] uppercase tracking-widest mb-8"
            style={{ color: "#C4B8A8", fontFamily: "var(--font-inter)" }}
          >
            Работает с любыми платформами
          </p>
        </div>
        {/* Infinite scroll marquee */}
        <div className="relative">
          <div className="flex animate-marquee gap-12 sm:gap-16">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-8 sm:gap-10 shrink-0">
                <PlatformBadge name="YouTube" icon={PlatformIcons.YouTube} />
                <PlatformBadge name="TikTok" icon={PlatformIcons.TikTok} />
                <PlatformBadge name="Instagram" icon={PlatformIcons.Instagram} />
                <PlatformBadge name="Twitch" icon={PlatformIcons.Twitch} />
                <PlatformBadge name="X" icon={PlatformIcons.Twitter} />
                <PlatformBadge name="Telegram" icon={PlatformIcons.Telegram} />
                <PlatformBadge name="Pinterest" icon={PlatformIcons.Pinterest} />
                <PlatformBadge name="LinkedIn" icon={PlatformIcons.LinkedIn} />
                <PlatformBadge name="Snapchat" icon={PlatformIcons.Snapchat} />
                <PlatformBadge name="Discord" icon={PlatformIcons.Discord} />
                <PlatformBadge name="Podcasts" icon={PlatformIcons.Podcasts} />
                <PlatformBadge name="Blogs" icon={PlatformIcons.Blogs} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3 BENEFITS ── */}
      <section id="features" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2
              className="text-4xl sm:text-5xl mb-4"
              style={{ fontFamily: "var(--font-fraunces)", fontWeight: 600, color: "#1A1A1A" }}
            >
              Почему ContractGen?
            </h2>
            <p className="text-[17px] max-w-xl mx-auto" style={{ color: "#4A4A4A" }}>
              Три причины, по которым 5 000+ инфлюенсеров выбрали нас.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <IllustrationFast />,
                accent: "#FFD54F",
                accentText: "#5A4500",
                tag: "Быстро",
                title: "2 минуты вместо 2 часов",
                desc: "Ответь на несколько вопросов. ИИ соберёт полный контракт со всеми клаузулами — быстрее, чем сделать кофе.",
              },
              {
                icon: <IllustrationShield />,
                accent: "#7DD3C0",
                accentText: "#1A5C52",
                tag: "Защищает",
                title: "Юридическая защита с первого дня",
                desc: "Все шаблоны разработаны медиа-юристами. FTC-требования, права на контент, сроки оплаты — всё уже включено.",
              },
              {
                icon: <IllustrationClear />,
                accent: "#FF8A65",
                accentText: "#5A1E00",
                tag: "Понятно",
                title: "Без юридического птичьего языка",
                desc: "Контракты написаны просто и ясно. Бренд понимает условия — сделка закрывается быстрее.",
              },
            ].map((b, i) => (
              <div
                key={i}
                className="p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{ background: "white", borderColor: "#E8E0D4", boxShadow: "0 2px 12px #1A1A1A08" }}
              >
                <div className="mb-6">{b.icon}</div>
                <div
                  className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide mb-3"
                  style={{ background: b.accent + "22", color: b.accentText }}
                >
                  {b.tag}
                </div>
                <h3
                  className="text-[22px] mb-3 leading-snug"
                  style={{ fontFamily: "var(--font-fraunces)", fontWeight: 600, color: "#1A1A1A" }}
                >
                  {b.title}
                </h3>
                <p className="text-[14px] leading-relaxed" style={{ color: "#4A4A4A" }}>
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="py-24" style={{ background: "#F5F0E8" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2
              className="text-4xl sm:text-5xl mb-4"
              style={{ fontFamily: "var(--font-fraunces)", fontWeight: 600, color: "#1A1A1A" }}
            >
              Как это работает
            </h2>
            <p className="text-[17px]" style={{ color: "#4A4A4A" }}>
              Три шага — и контракт готов к подписанию.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* connector line on desktop */}
            <div
              className="hidden md:block absolute top-10 left-[calc(33%-16px)] right-[calc(33%-16px)] h-[2px]"
              style={{ background: "linear-gradient(90deg, #7DD3C0, #FFD54F, #FF8A65)" }}
            />

            {[
              {
                step: "01",
                color: "#7DD3C0",
                title: "Опиши сделку",
                desc: "Введи детали: бренд, платформа, контент, оплата. Занимает меньше минуты.",
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                ),
              },
              {
                step: "02",
                color: "#FFD54F",
                title: "Получи контракт",
                desc: "ИИ генерирует полный документ со всеми клаузулами. Можно редактировать.",
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
              },
              {
                step: "03",
                color: "#FF8A65",
                title: "Подпиши и закрой",
                desc: "Отправь ссылку бренду. E-подпись в браузере — без скачиваний.",
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                ),
              },
            ].map((s, i) => (
              <div key={i} className="relative flex flex-col items-center text-center">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 z-10 shadow-md"
                  style={{ background: s.color, color: s.color === "#FFD54F" ? "#5A4500" : "white" }}
                >
                  {s.icon}
                </div>
                <div
                  className="absolute top-1.5 right-8 text-[11px] font-bold"
                  style={{ color: s.color, fontFamily: "var(--font-fraunces)" }}
                >
                  {s.step}
                </div>
                <h3
                  className="text-[20px] mb-2"
                  style={{ fontFamily: "var(--font-fraunces)", fontWeight: 600, color: "#1A1A1A" }}
                >
                  {s.title}
                </h3>
                <p className="text-[14px] leading-relaxed" style={{ color: "#4A4A4A" }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTRACT EXAMPLES ── */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2
              className="text-4xl sm:text-5xl mb-4"
              style={{ fontFamily: "var(--font-fraunces)", fontWeight: 600, color: "#1A1A1A" }}
            >
              Готовые шаблоны
            </h2>
            <p className="text-[17px]" style={{ color: "#4A4A4A" }}>
              Выбирай подходящий — и настраивай под себя.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Спонсорский пост", tag: "Популярный", color: "#7DD3C0", tagBg: "#7DD3C022", tagText: "#1A5C52" },
              { title: "UGC-контент", tag: "Новый", color: "#FF8A65", tagBg: "#FF8A6522", tagText: "#5A1E00" },
              { title: "Амбассадор бренда", tag: "Долгосрок", color: "#FFD54F", tagBg: "#FFD54F22", tagText: "#5A4500" },
              { title: "NDA", tag: "Базовый", color: "#C4B8A8", tagBg: "#C4B8A822", tagText: "#5A5248" },
              { title: "Лицензирование", tag: "", color: "#7DD3C0", tagBg: "", tagText: "" },
              { title: "Ревью / обзор", tag: "", color: "#FF8A65", tagBg: "", tagText: "" },
              { title: "Совместный проект", tag: "", color: "#FFD54F", tagBg: "", tagText: "" },
              { title: "Эксклюзивность", tag: "", color: "#C4B8A8", tagBg: "", tagText: "" },
            ].map((tmpl, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl border cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg group"
                style={{ background: "white", borderColor: "#E8E0D4" }}
              >
                {/* mini doc preview */}
                <div
                  className="w-full h-24 rounded-xl mb-4 flex flex-col gap-2 p-3 transition-all"
                  style={{ background: tmpl.color + "18" }}
                >
                  <div className="w-full h-2.5 rounded-full" style={{ background: tmpl.color }} />
                  <div className="w-3/4 h-2 rounded-full" style={{ background: tmpl.color + "66" }} />
                  <div className="w-full h-2 rounded-full" style={{ background: tmpl.color + "44" }} />
                  <div className="w-2/3 h-2 rounded-full" style={{ background: tmpl.color + "44" }} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-medium" style={{ color: "#1A1A1A" }}>
                    {tmpl.title}
                  </span>
                  {tmpl.tag && (
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: tmpl.tagBg, color: tmpl.tagText }}
                    >
                      {tmpl.tag}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24" style={{ background: "#F5F0E8" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2
              className="text-4xl sm:text-5xl mb-4"
              style={{ fontFamily: "var(--font-fraunces)", fontWeight: 600, color: "#1A1A1A" }}
            >
              Что говорят креаторы
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Алина К.",
                handle: "@alinacreates",
                platform: "YouTube · 480K",
                avatar: "AK",
                avatarColor: "#7DD3C0",
                text: "Раньше тратила 2–3 часа на каждый контракт с юристом. Теперь делаю за 5 минут. Уже закрыла 14 сделок через ContractGen.",
                stars: 5,
              },
              {
                name: "Максим Р.",
                handle: "@maxtech_",
                platform: "TikTok · 1.2M",
                avatar: "MR",
                avatarColor: "#FF8A65",
                text: "Бренды стали серьёзнее относиться к условиям — вижу разницу. Контракты выглядят профессионально, и это меняет переговоры.",
                stars: 5,
              },
              {
                name: "Диана Ю.",
                handle: "@dianabeauty",
                platform: "Instagram · 220K",
                avatar: "ДЮ",
                avatarColor: "#FFD54F",
                text: "E-подпись — это просто магия. Раньше контракты терялись в почте неделями. Теперь подписываем за 10 минут.",
                stars: 5,
              },
            ].map((t, i) => (
              <div
                key={i}
                className="p-7 rounded-3xl border"
                style={{ background: "white", borderColor: "#E8E0D4" }}
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-5">
                  {Array.from({ length: t.stars }).map((_, si) => (
                    <svg key={si} className="w-4 h-4" viewBox="0 0 20 20" fill="#FFD54F">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-[14px] leading-relaxed mb-6" style={{ color: "#4A4A4A" }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold"
                    style={{ background: t.avatarColor + "33", color: t.avatarColor }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold" style={{ color: "#1A1A1A" }}>
                      {t.name}
                    </div>
                    <div className="text-[12px]" style={{ color: "#8A7E72" }}>
                      {t.handle} · {t.platform}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2
              className="text-4xl sm:text-5xl mb-4"
              style={{ fontFamily: "var(--font-fraunces)", fontWeight: 600, color: "#1A1A1A" }}
            >
              Частые вопросы
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24" style={{ background: "#F5F0E8" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2
              className="text-4xl sm:text-5xl mb-4"
              style={{ fontFamily: "var(--font-fraunces)", fontWeight: 600, color: "#1A1A1A" }}
            >
              Простые цены
            </h2>
            <p className="text-[17px]" style={{ color: "#4A4A4A" }}>
              Начни бесплатно. Расти когда нужно.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Старт",
                price: "0 ₽",
                period: "навсегда",
                desc: "Попробовать без риска",
                features: ["3 контракта в месяц", "Базовые шаблоны", "Email-поддержка"],
                cta: "Начать бесплатно",
                highlight: false,
                ctaHref: "/signup",
              },
              {
                name: "Про",
                price: "1 490 ₽",
                period: "/ месяц",
                desc: "Для активных инфлюенсеров",
                features: [
                  "Безлимитные контракты",
                  "Все 8+ шаблонов",
                  "E-подписи",
                  "ИИ-клаузулы",
                  "Приоритетная поддержка",
                ],
                cta: "Начать пробный период",
                highlight: true,
                ctaHref: "/signup",
              },
              {
                name: "Агентство",
                price: "5 990 ₽",
                period: "/ месяц",
                desc: "Для команд и агентств",
                features: [
                  "Всё из Про",
                  "5 участников команды",
                  "White-label",
                  "API доступ",
                  "Персональный менеджер",
                ],
                cta: "Связаться с нами",
                highlight: false,
                ctaHref: "/dashboard/help",
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className="relative rounded-3xl border p-7 flex flex-col transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: plan.highlight ? "linear-gradient(135deg, #7DD3C0 0%, #5BC4A8 100%)" : "white",
                  borderColor: plan.highlight ? "#5BC4A8" : "#E8E0D4",
                  boxShadow: plan.highlight ? "0 20px 60px #7DD3C030" : "0 2px 12px #1A1A1A08",
                  transform: plan.highlight ? "scale(1.03)" : undefined,
                }}
              >
                {plan.highlight && (
                  <div
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[12px] font-bold"
                    style={{ background: "#7DD3C0", color: "white" }}
                  >
                    Самый популярный
                  </div>
                )}
                <div className="mb-6">
                  <h3
                    className="text-[18px] font-semibold mb-1"
                    style={{ fontFamily: "var(--font-fraunces)", color: plan.highlight ? "white" : "#1A1A1A" }}
                  >
                    {plan.name}
                  </h3>
                  <p className="text-[13px]" style={{ color: plan.highlight ? "rgba(255,255,255,0.85)" : "#8A7E72" }}>
                    {plan.desc}
                  </p>
                </div>
                <div className="mb-7">
                  <span
                    className="text-4xl font-bold"
                    style={{ fontFamily: "var(--font-fraunces)", color: plan.highlight ? "white" : "#1A1A1A" }}
                  >
                    {plan.price}
                  </span>
                  <span className="text-[14px] ml-1" style={{ color: plan.highlight ? "rgba(255,255,255,0.85)" : "#8A7E72" }}>
                    {plan.period}
                  </span>
                </div>
                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-[14px]" style={{ color: plan.highlight ? "white" : "#4A4A4A" }}>
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke={plan.highlight ? "white" : "#7DD3C0"} viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.ctaHref}
                  className="w-full h-11 rounded-xl font-semibold text-[14px] flex items-center justify-center transition-all hover:scale-[1.02]"
                  style={
                    plan.highlight
                      ? { background: "white", color: "#1A1A1A" }
                      : { background: "#F5F0E8", color: "#1A1A1A" }
                  }
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          {/* decorative squiggles */}
          <div className="flex justify-center gap-4 mb-8">
            <div className="w-3 h-3 rounded-full" style={{ background: "#FFD54F" }} />
            <div className="w-3 h-3 rounded-full" style={{ background: "#7DD3C0" }} />
            <div className="w-3 h-3 rounded-full" style={{ background: "#FF8A65" }} />
          </div>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl mb-6 leading-tight"
            style={{ fontFamily: "var(--font-fraunces)", fontWeight: 600, color: "#1A1A1A" }}
          >
            Первый контракт — прямо сейчас.
          </h2>
          <p className="text-[18px] mb-10 max-w-xl mx-auto" style={{ color: "#4A4A4A" }}>
            Присоединяйся к 5 000+ инфлюенсерам, которые закрывают сделки быстро и без юристов.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 h-14 px-10 text-[16px] font-semibold rounded-2xl transition-all hover:scale-[1.04] hover:shadow-xl"
            style={{ background: "#7DD3C0", color: "white", boxShadow: "0 6px 30px #7DD3C044" }}
          >
            Создать контракт бесплатно
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <p className="mt-5 text-[13px]" style={{ color: "#8A7E72" }}>
            Без кредитной карты · Гарантия возврата 30 дней · Отмена в любой момент
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-12 border-t" style={{ borderColor: "#E8E0D4", background: "#FDF9F3" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center"
                style={{ background: "#7DD3C0" }}
              >
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span
                className="font-semibold text-[15px]"
                style={{ fontFamily: "var(--font-fraunces)", color: "#1A1A1A" }}
              >
                ContractGen
              </span>
              <span className="text-[13px] ml-2" style={{ color: "#8A7E72" }}>
                © 2026
              </span>
            </div>
            <div className="flex items-center gap-6 text-[13px]" style={{ color: "#8A7E72" }}>
              <Link href="/terms" className="hover:text-[#1A1A1A] transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-[#1A1A1A] transition-colors">Privacy</Link>
              <a
                href="https://twitter.com/contractgen"
                target="_blank"
                rel="noopener"
                className="hover:text-[#1A1A1A] transition-colors"
              >
                Twitter
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
