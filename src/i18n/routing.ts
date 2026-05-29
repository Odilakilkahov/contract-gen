import { defineRouting } from 'next-intl/routing'

export const locales = ['en', 'ru', 'es', 'de', 'fr', 'zh', 'ja', 'ko', 'pt', 'ar'] as const
export type Locale = (typeof locales)[number]

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  localePrefix: 'as-needed'
})
