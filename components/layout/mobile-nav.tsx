'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, QrCode, Link2, ReceiptText, Settings, LogOut, X, BookOpen } from 'lucide-react'
import { getBrowserSupabase } from '@/lib/supabase/browser'
import { usePendingCount } from '@/lib/hooks/use-pending-count'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/qris', label: 'QRIS', icon: QrCode },
  { href: '/links', label: 'Payment Links', icon: Link2 },
  { href: '/transactions', label: 'Transaksi', icon: ReceiptText, showPendingBadge: true },
  { href: '/settings', label: 'Pengaturan', icon: Settings },
  { href: '/docs', label: 'API Docs', icon: BookOpen },
]

interface MobileNavProps {
  open: boolean
  onClose: () => void
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const pendingCount = usePendingCount()

  async function handleLogout() {
    const supabase = getBrowserSupabase()
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="fixed inset-y-0 left-0 w-60 bg-[#0F172A] flex flex-col shadow-xl">
        <div className="flex h-16 items-center justify-between px-4">
          <span className="text-base font-heading font-bold text-white tracking-tight">Bayaraja</span>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                )}
              >
                <item.icon className={cn('h-4 w-4', isActive ? 'text-[#F97316]' : '')} />
                <span className="flex-1">{item.label}</span>
                {item.showPendingBadge && pendingCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
                    {pendingCount > 99 ? '99+' : pendingCount}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="px-3 pb-5">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-white/5 hover:text-slate-300 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </button>
        </div>
      </div>
    </div>
  )
}
