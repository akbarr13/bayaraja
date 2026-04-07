'use client'

import Link from 'next/link'
import { Zap, Github } from 'lucide-react'
import { useLocale } from '@/lib/i18n/locale-context'

export function Footer() {
  const { t } = useLocale()

  return (
    <footer className="bg-slate-900 border-t border-slate-800 px-6 pt-12 pb-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F97316]">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="text-base font-heading font-bold text-white">Bayaraja</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              {t('footer.desc')}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">
              {t('footer.product')}
            </p>
            <div className="space-y-2.5">
              <Link
                href="/dashboard/docs"
                className="block text-sm text-slate-400 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none rounded"
              >
                {t('footer.apiDocs')}
              </Link>
              <a
                href="https://github.com/akbarr13/bayaraja"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('a11y.githubNewTab')}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none rounded"
              >
                <Github className="h-4 w-4" />
                {t('footer.github')}
              </a>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">
              {t('footer.account')}
            </p>
            <div className="space-y-2.5">
              <Link
                href="/register"
                className="block text-sm text-slate-400 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none rounded"
              >
                {t('footer.register')}
              </Link>
              <Link
                href="/login"
                className="block text-sm text-slate-400 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none rounded"
              >
                {t('footer.login')}
              </Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">
              {t('footer.support')}
            </p>
            <div className="space-y-2.5">
              <Link
                href="/contact"
                className="block text-sm text-slate-400 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none rounded"
              >
                {t('footer.contact')}
              </Link>
              <span
                className="block text-sm text-slate-500 cursor-default"
                title="Segera hadir"
              >
                {t('footer.terms')}
              </span>
              <span
                className="block text-sm text-slate-500 cursor-default"
                title="Segera hadir"
              >
                {t('footer.privacy')}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            &copy; {new Date().getFullYear()} {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  )
}
