'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useT } from '@/hooks/useT'
import {
  LayoutDashboard, Wallet, SendHorizonal, QrCode, History,
  Gift, Settings, ArrowDownToLine, LogOut, Zap,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', labelKey: 'dashboard', icon: LayoutDashboard },
  { href: '/balance', labelKey: 'balance', icon: Wallet },
  { href: '/send', labelKey: 'send', icon: SendHorizonal },
  { href: '/pay', labelKey: 'pay', icon: QrCode },
  { href: '/transactions', labelKey: 'transactions', icon: History },
  { href: '/rewards', labelKey: 'rewards', icon: Gift },
  { href: '/settings', labelKey: 'settings', icon: Settings },
] as const

export function Navigation() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const t = useT()

  if (!user) return null

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-64 h-screen fixed top-0 left-0 bg-[var(--surface)] border-r border-[var(--border)] z-40 shadow-[var(--shadow-sm)]">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-[var(--border)]">
          <div className="w-9 h-9 rounded-xl gradient-sora flex items-center justify-center shadow-lg">
            <Zap className="w-5 h-5 text-white" fill="white" />
          </div>
          <div>
            <span className="text-lg font-bold text-[var(--text-primary)]">Sora</span>
            <span className="text-lg font-bold text-sora-500">Pay</span>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Main navigation">
          {navItems.map(({ href, labelKey, icon: Icon }) => {
            const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                  ${isActive
                    ? 'bg-sora-500 text-white shadow-md'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]'
                  }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={`w-4.5 h-4.5 flex-shrink-0 ${isActive ? 'text-white' : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)]'}`} size={18} />
                <span>{t[labelKey as keyof typeof t]}</span>
                {labelKey === 'rewards' && (
                  <span className="ml-auto bg-gold-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">NEW</span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User profile at bottom */}
        <div className="p-4 border-t border-[var(--border)]">
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--surface-2)] transition-colors">
            <div className="w-9 h-9 rounded-full gradient-sora flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {user.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{user.name}</p>
              <p className="text-xs text-[var(--text-muted)] truncate">{user.email}</p>
            </div>
            <button
              onClick={logout}
              className="text-[var(--text-muted)] hover:text-coral-500 transition-colors p-1 rounded-lg"
              aria-label="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Mobile Bottom Navigation ── */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--surface)] border-t border-[var(--border)] safe-bottom"
        aria-label="Mobile navigation"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.slice(0, 5).map(({ href, labelKey, icon: Icon }) => {
            const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-0
                  ${isActive ? 'text-sora-500' : 'text-[var(--text-muted)]'}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-sora-50' : ''}`}>
                  <Icon size={20} className={isActive ? 'text-sora-500' : ''} />
                </div>
                <span className={`text-[9px] font-medium leading-none ${isActive ? 'text-sora-500' : ''}`}>
                  {(t[labelKey as keyof typeof t] as string).slice(0, 6)}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* ── Mobile Top Header ── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-[var(--surface)] border-b border-[var(--border)]">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-sora flex items-center justify-center shadow-md">
              <Zap className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="text-base font-bold">
              <span className="text-[var(--text-primary)]">Sora</span>
              <span className="text-sora-500">Pay</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/receive" className="p-2 rounded-xl hover:bg-[var(--surface-2)] transition-colors text-[var(--text-muted)]" aria-label="Receive">
              <ArrowDownToLine size={18} />
            </Link>
            <Link href="/settings" className="w-8 h-8 rounded-full gradient-sora flex items-center justify-center text-white text-xs font-bold">
              {user.avatar}
            </Link>
          </div>
        </div>
      </header>
    </>
  )
}
