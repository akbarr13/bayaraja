'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import idTranslations from './locales/id.json'
import enTranslations from './locales/en.json'

export type Locale = 'id' | 'en'

type Translations = typeof idTranslations

const translations: Record<Locale, Translations> = {
  id: idTranslations,
  en: enTranslations,
}

const COOKIE_NAME = 'bayaraja-locale'

function getInitialLocale(): Locale {
  if (typeof document === 'undefined') return 'id'
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`))
  const value = match ? decodeURIComponent(match[1]) : null
  return value === 'en' ? 'en' : 'id'
}

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: keyof Translations) => string
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('id')

  // Read cookie after hydration
  useEffect(() => {
    setLocaleState(getInitialLocale())
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
    document.cookie = `${COOKIE_NAME}=${locale}; path=/; max-age=31536000; SameSite=Lax`
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
  }, [])

  const t = useCallback(
    (key: keyof Translations): string => {
      return (translations[locale] as Record<string, string>)[key as string] ?? (key as string)
    },
    [locale],
  )

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used inside <LocaleProvider>')
  return ctx
}
