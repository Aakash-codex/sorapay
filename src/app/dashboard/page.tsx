'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useWallet } from '@/context/WalletContext'
import { useT } from '@/hooks/useT'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { SpendingChart } from '@/components/SpendingChart'
import {
  SendHorizonal, QrCode, ArrowDownToLine, Wallet,
  Bell, ChevronRight, TrendingUp, Star, Shield, Zap, Eye, EyeOff,
} from 'lucide-react'

const NOTIFICATIONS = [
  { id: '1', icon: '🎁', title: 'New reward available!', body: 'Claim ¥200 off at Starbucks.', time: '2m ago', unread: true },
  { id: '2', icon: '✅', title: 'Transfer completed', body: 'Sent ¥2,500 to Yuki Nakamura.', time: '1h ago', unread: true },
  { id: '3', icon: '🔐', title: 'Security notice', body: 'New login from Tokyo, JP.', time: '3h ago', unread: false },
]

export default function DashboardPage() {
  const router = useRouter()
  const { user, language } = useAuth()
  const { balance, points, cashback, transactions } = useWallet()
  const t = useT()
  const [showBalance, setShowBalance] = useState(true)
  const [showNotifs, setShowNotifs] = useState(false)
  const [unreadCount] = useState(NOTIFICATIONS.filter(n => n.unread).length)

  useEffect(() => {
    if (!user) router.replace('/login')
  }, [user, router])

  if (!user) return null

  const hour = new Date().getHours()
  const greeting = hour < 12 ? t.goodMorning : hour < 18 ? t.goodAfternoon : t.goodEvening
  const recentTxs = transactions.slice(0, 5)

  // Monthly spending calculation
  const now = new Date()
  const monthSpend = transactions
    .filter(tx => {
      const d = new Date(tx.date)
      return tx.type === 'debit' && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    .reduce((sum, tx) => sum + tx.amount, 0)

  const quickActions = [
    { label: t.send, icon: SendHorizonal, href: '/send', color: 'bg-sora-500', textColor: 'text-white' },
    { label: t.receive, icon: ArrowDownToLine, href: '/receive', color: 'bg-sage-500', textColor: 'text-white' },
    { label: t.pay, icon: QrCode, href: '/pay', color: 'bg-coral-500', textColor: 'text-white' },
    { label: t.balance, icon: Wallet, href: '/balance', color: 'bg-gold-500', textColor: 'text-white' },
  ]

  return (
    <div className="lg:pl-64">
      <div className="min-h-screen bg-[var(--bg)] pt-16 lg:pt-0 pb-24 lg:pb-0">
        <div className="max-w-5xl mx-auto px-4 lg:px-8 py-6 lg:py-8 space-y-6">

          {/* ── Header ── */}
          <div className="flex items-start justify-between">
            <div className="fade-in">
              <p className="text-sm text-[var(--text-muted)]">{greeting},</p>
              <h1 className="text-2xl font-black text-[var(--text-primary)]">{user.name.split(' ')[0]} 👋</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setShowNotifs(!showNotifs)}
                  className="w-10 h-10 bg-[var(--surface)] rounded-xl flex items-center justify-center border border-[var(--border)] hover:bg-[var(--surface-2)] transition-colors shadow-sm"
                  aria-label={`Notifications (${unreadCount} unread)`}
                >
                  <Bell size={18} className="text-[var(--text-secondary)]" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-coral-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification dropdown */}
                {showNotifs && (
                  <div className="absolute right-0 top-12 w-80 glass-card p-1 z-50 slide-up">
                    <div className="px-3 py-2 border-b border-[var(--border)]">
                      <p className="text-sm font-bold text-[var(--text-primary)]">{t.notifications}</p>
                    </div>
                    {NOTIFICATIONS.map(n => (
                      <div key={n.id} className={`flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-[var(--surface-2)] cursor-pointer transition-colors ${n.unread ? '' : 'opacity-60'}`}>
                        <span className="text-xl leading-none">{n.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[var(--text-primary)]">{n.title}</p>
                          <p className="text-xs text-[var(--text-muted)]">{n.body}</p>
                        </div>
                        <span className="text-[10px] text-[var(--text-muted)] whitespace-nowrap">{n.time}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Balance Card ── */}
          <div className="relative overflow-hidden rounded-[var(--radius-card)] gradient-sora p-6 text-white shadow-[var(--shadow-glow)] fade-in-delay-1">
            {/* Decorative circles */}
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-white/10 rounded-full" />
            <div className="absolute -right-8 top-8 w-32 h-32 bg-white/5 rounded-full" />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-white/70 text-sm font-medium">{t.availableBalance}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-4xl font-black">
                      {showBalance ? `¥${balance.toLocaleString()}` : '¥••••••'}
                    </span>
                    <button
                      onClick={() => setShowBalance(!showBalance)}
                      className="text-white/60 hover:text-white transition-colors"
                      aria-label={showBalance ? 'Hide balance' : 'Show balance'}
                    >
                      {showBalance ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-0.5">
                    <TrendingUp size={11} />
                    <span className="text-[10px] font-semibold">+2.4%</span>
                  </div>
                  <p className="text-[10px] text-white/50">vs last month</p>
                </div>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-6 py-3 border-t border-white/20">
                <div>
                  <p className="text-[10px] text-white/60">Spent this month</p>
                  <p className="text-base font-bold">¥{monthSpend.toLocaleString()}</p>
                </div>
                <div className="w-px h-8 bg-white/20" />
                <div>
                  <p className="text-[10px] text-white/60">{t.rewardPoints}</p>
                  <p className="text-base font-bold">{points.toLocaleString()} pts</p>
                </div>
                <div className="w-px h-8 bg-white/20" />
                <div>
                  <p className="text-[10px] text-white/60">{t.cashback}</p>
                  <p className="text-base font-bold">¥{cashback.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Quick Actions ── */}
          <div className="fade-in-delay-2">
            <h2 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3">{t.quickActions}</h2>
            <div className="grid grid-cols-4 gap-3">
              {quickActions.map(({ label, icon: Icon, href, color }) => (
                <Link key={href} href={href}>
                  <div className="flex flex-col items-center gap-2 group">
                    <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center shadow-md transition-all duration-200 group-hover:scale-105 group-hover:shadow-lg group-active:scale-95`}>
                      <Icon size={22} className="text-white" />
                    </div>
                    <span className="text-xs font-semibold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* ── Main Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* ── Spending Chart ── */}
            <div className="lg:col-span-3">
              <Card padding="md">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-[var(--text-primary)]">{t.monthlySpending}</h2>
                  <span className="text-xs text-[var(--text-muted)]">¥{monthSpend.toLocaleString()} {language === 'ja' ? '今月' : 'this month'}</span>
                </div>
                <SpendingChart language={language} />
              </Card>
            </div>

            {/* ── Rewards & Promo ── */}
            <div className="lg:col-span-2 space-y-4">
              {/* Points card */}
              <Card padding="md" className="bg-gradient-to-br from-gold-400/20 to-gold-500/10 border-gold-400/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-gold-500" fill="#ffc233" />
                    <span className="text-sm font-bold text-[var(--text-primary)]">{t.rewardPoints}</span>
                  </div>
                  <Link href="/rewards">
                    <span className="text-xs text-sora-500 hover:underline">{t.viewAll}</span>
                  </Link>
                </div>
                <p className="text-3xl font-black text-[var(--text-primary)]">{points.toLocaleString()}</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">≈ ¥{Math.floor(points * 0.5).toLocaleString()} cashback value</p>
                <div className="mt-3 h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                  <div className="h-full gradient-gold rounded-full" style={{ width: `${Math.min((points / 2000) * 100, 100)}%` }} />
                </div>
                <p className="text-[10px] text-[var(--text-muted)] mt-1">{2000 - Math.min(points, 2000)} pts to next tier</p>
              </Card>

              {/* Security badge */}
              <Card padding="md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-sage-500/10 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-sage-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--text-primary)]">Account Secured</p>
                    <p className="text-xs text-[var(--text-muted)]">2FA enabled · Biometrics on</p>
                  </div>
                </div>
              </Card>

              {/* Promo */}
              <div className="relative overflow-hidden rounded-[var(--radius-card)] p-4 gradient-sage text-white">
                <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/10 rounded-full" />
                <Zap className="w-5 h-5 mb-2 relative z-10" fill="white" />
                <p className="text-sm font-black relative z-10">Double Points Weekend!</p>
                <p className="text-[10px] text-white/80 mt-1 relative z-10">Earn 2x points on all purchases this weekend.</p>
                <Link href="/rewards">
                  <button className="mt-3 text-[10px] font-bold bg-white/20 hover:bg-white/30 rounded-lg px-3 py-1.5 transition-colors relative z-10">
                    View Details →
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* ── Recent Transactions ── */}
          <Card padding="md" className="fade-in-delay-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-[var(--text-primary)]">{t.recentTransactions}</h2>
              <Link href="/transactions" className="flex items-center gap-1 text-xs text-sora-500 hover:underline">
                {t.viewAll}
                <ChevronRight size={12} />
              </Link>
            </div>

            {recentTxs.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-5xl mb-3">📭</div>
                <p className="text-sm text-[var(--text-muted)]">No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentTxs.map(tx => (
                  <div key={tx.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--surface-2)] transition-colors cursor-pointer">
                    <div className="w-10 h-10 bg-[var(--surface-2)] rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                      {tx.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{tx.title}</p>
                      <p className="text-xs text-[var(--text-muted)] truncate">{tx.subtitle} · {tx.time}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-sm font-bold ${tx.type === 'credit' ? 'text-sage-500' : 'text-[var(--text-primary)]'}`}>
                        {tx.type === 'credit' ? '+' : '-'}¥{tx.amount.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-[var(--text-muted)]">{tx.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

        </div>
      </div>
    </div>
  )
}
