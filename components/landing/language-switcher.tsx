'use client'

import { useLocale, type Locale } from '@/lib/i18n/locale-context'

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale()

  return (
    <div className="flex items-center rounded-full border border-gray-200 bg-gray-50 p-0.5 text-xs font-semibold">
      {(['id', 'en'] as Locale[]).map((lang) => (
        <button
          key={lang}
          onClick={() => setLocale(lang)}
          className={`rounded-full px-2.5 py-1 transition-colors cursor-pointer uppercase tracking-wide ${
            locale === lang
              ? 'bg-[#F97316] text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
          aria-pressed={locale === lang}
          aria-label={`Switch to ${lang === 'id' ? 'Indonesian' : 'English'}`}
        >
          {lang}
        </button>
      ))}
    </div>
  )
}
