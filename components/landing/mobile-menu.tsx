'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export function MobileMenu() {
  const [open, setOpen] = useState(false)

  const close = useCallback(() => setOpen(false), [])

  // Escape key handler
  useEffect(() => {
    if (!open) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, close])

  // Lock body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center h-11 w-11 rounded-lg text-slate-600 hover:bg-gray-100 transition-colors cursor-pointer"
        aria-label={open ? 'Tutup menu' : 'Buka menu'}
        aria-expanded={open}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40"
            role="presentation"
            onClick={close}
          />
          <div className="absolute top-full left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-lg px-4 py-4 flex flex-col gap-1 animate-fade-up" style={{ animationDuration: '200ms' }}>
            <a
              href="#fitur"
              onClick={close}
              className="px-3 py-3 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-gray-50 rounded-lg transition-colors min-h-[44px] flex items-center focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none"
            >
              Fitur
            </a>
            <a
              href="#cara-mulai"
              onClick={close}
              className="px-3 py-3 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-gray-50 rounded-lg transition-colors min-h-[44px] flex items-center focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none"
            >
              Cara Mulai
            </a>
            <a
              href="#faq"
              onClick={close}
              className="px-3 py-3 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-gray-50 rounded-lg transition-colors min-h-[44px] flex items-center focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none"
            >
              FAQ
            </a>
            <div className="mt-2 pt-3 border-t border-gray-100 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={close}
                className="px-3 py-3 text-sm font-medium text-slate-700 hover:bg-gray-50 rounded-lg transition-colors min-h-[44px] flex items-center focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                onClick={close}
                className="inline-flex items-center justify-center rounded-full bg-[#F97316] px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-500 transition-colors min-h-[44px] cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                Daftar gratis
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
