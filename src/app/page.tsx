'use client'

import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import {
  Zap, Shield, QrCode, TrendingUp, Gift, Globe,
  ArrowRight, Check, Star, ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

const features = [
  { icon: Zap, title: 'Instant Transfers', titleJa: '即時送金', desc: 'Send money to anyone in seconds with zero fees.', descJa: '手数料無料で数秒で送金。', color: '#0077ee' },
  { icon: QrCode, title: 'QR Payments', titleJa: 'QR決済', desc: 'Pay at millions of merchants with a simple scan.', descJa: '簡単スキャンで数百万店舗で決済。', color: '#36b5ac' },
  { icon: Shield, title: 'Bank-Level Security', titleJa: '銀行レベルのセキュリティ', desc: 'Encrypted and protected 24/7 with biometric auth.', descJa: '生体認証と24時間暗号化で保護。', color: '#a855f7' },
  { icon: TrendingUp, title: 'Smart Analytics', titleJa: 'スマート分析', desc: 'Track spending patterns with beautiful charts.', descJa: '美しいグラフで支出を管理。', color: '#ff6b6b' },
  { icon: Gift, title: 'Earn Rewards', titleJa: '特典を獲得', desc: 'Get points on every purchase. Redeem for coupons.', descJa: '毎回の購入でポイント獲得。クーポンに交換。', color: '#ffc233' },
  { icon: Globe, title: 'Multi-currency', titleJa: 'マルチ通貨', desc: 'Accept payments in JPY, USD, and 30+ currencies.', descJa: '円、ドルを含む30以上の通貨に対応。', color: '#22c55e' },
]

const stats = [
  { value: '2M+', label: 'Active Users', labelJa: 'アクティブユーザー' },
  { value: '¥50B+', label: 'Processed', labelJa: '決済額累計' },
  { value: '99.9%', label: 'Uptime', labelJa: '稼働率' },
  { value: '4.9★', label: 'App Rating', labelJa: 'アプリ評価' },
]

const testimonials = [
  { name: 'Yuki Nakamura', role: 'Freelance Designer', text: 'SoraPay changed the way I manage money. The QR payments are seamless!', avatar: 'YN' },
  { name: 'Kenji Watanabe', role: 'Startup Founder', text: 'The rewards system is amazing. I saved ¥20,000 in my first month.', avatar: 'KW' },
  { name: 'Aiko Suzuki', role: 'Student', text: 'So easy to split bills with friends. Best payment app in Japan!', avatar: 'AS' },
]

export default function LandingPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) router.replace('/dashboard')
  }, [user, router])

  return (
    <main className="min-h-screen bg-[var(--bg)] overflow-x-hidden">
      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex flex-col">
        {/* Header */}
        <header className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-sora flex items-center justify-center shadow-lg">
              <Zap className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="text-xl font-bold">
              <span className="text-[var(--text-primary)]">Sora</span>
              <span className="text-sora-500">Pay</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            {['Features', 'Security', 'Rewards', 'Pricing'].map(item => (
              <a key={item} href="#" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </header>

        {/* Hero content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center relative py-16">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sora-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-sage-500/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-sora-50 dark:bg-sora-900/30 border border-sora-200 dark:border-sora-800 rounded-full px-4 py-1.5 mb-8">
              <Star className="w-3.5 h-3.5 text-sora-500" fill="#0077ee" />
              <span className="text-xs font-semibold text-sora-600 dark:text-sora-400">Japan&apos;s #1 Digital Wallet 2026</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.05]">
              <span className="text-[var(--text-primary)]">Pay Smarter,</span>
              <br />
              <span className="gradient-sora bg-clip-text text-transparent" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Live Better
              </span>
            </h1>

            <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-3 max-w-2xl mx-auto leading-relaxed">
              The modern digital wallet for Japan and beyond. Send, receive, and pay — all with a beautiful, intuitive experience.
            </p>
            <p className="text-base text-[var(--text-muted)] mb-10 font-medium" style={{ fontFamily: '"Noto Sans JP", sans-serif' }}>
              スマートに払う、豊かに生きる
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
              <Link href="/register">
                <Button size="xl" className="shadow-[var(--shadow-glow)]">
                  Get Started Free
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary" size="xl">
                  Sign In
                </Button>
              </Link>
            </div>

            <p className="text-xs text-[var(--text-muted)] mt-6 flex items-center gap-1.5 justify-center">
              <Check size={12} className="text-sage-500" />
              No credit card required · Free forever for personal use
            </p>
          </div>

          {/* Mock phone / dashboard preview */}
          <div className="relative z-10 mt-16 fade-in-delay-2 w-full max-w-sm mx-auto">
            <div className="glass-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[var(--text-muted)]">Available Balance</p>
                  <p className="text-3xl font-black text-[var(--text-primary)]">¥52,840</p>
                </div>
                <div className="w-12 h-12 rounded-2xl gradient-sora flex items-center justify-center shadow-lg">
                  <Zap className="w-6 h-6 text-white" fill="white" />
                </div>
              </div>
              <div className="h-px bg-[var(--border)]" />
              <div className="grid grid-cols-4 gap-2">
                {[
                  { icon: '💸', label: 'Send' },
                  { icon: '📥', label: 'Receive' },
                  { icon: '📱', label: 'Pay' },
                  { icon: '🎁', label: 'Rewards' },
                ].map(item => (
                  <div key={item.label} className="flex flex-col items-center gap-1.5">
                    <div className="w-10 h-10 bg-[var(--surface-2)] rounded-xl flex items-center justify-center text-xl">
                      {item.icon}
                    </div>
                    <span className="text-[10px] text-[var(--text-muted)]">{item.label}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {[
                  { icon: '☕', name: 'Starbucks', amount: '-¥850', color: 'text-coral-500' },
                  { icon: '💸', name: 'Received from Yuki', amount: '+¥2,500', color: 'text-sage-500' },
                ].map(tx => (
                  <div key={tx.name} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[var(--surface-2)] rounded-full flex items-center justify-center text-sm">{tx.icon}</div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-[var(--text-primary)]">{tx.name}</p>
                    </div>
                    <span className={`text-xs font-bold ${tx.color}`}>{tx.amount}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Floating rewards badge */}
            <div className="absolute -right-4 -top-4 glass-card p-3 flex items-center gap-2 text-xs">
              <Star className="w-4 h-4 text-gold-500" fill="#ffc233" />
              <span className="font-semibold text-[var(--text-primary)]">1,250 pts</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 px-6 border-y border-[var(--border)]">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(stat => (
            <div key={stat.value} className="text-center">
              <div className="text-3xl md:text-4xl font-black text-sora-500 mb-1">{stat.value}</div>
              <div className="text-sm text-[var(--text-muted)]">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-[var(--text-primary)] mb-4">Everything you need to pay smarter</h2>
            <p className="text-[var(--text-secondary)] max-w-xl mx-auto">Built for modern Japan, designed for everyone.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={f.title} className={`glass-card p-6 space-y-4 fade-in-delay-${Math.min(i + 1, 4)}`}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${f.color}20` }}>
                  <f.icon className="w-6 h-6" style={{ color: f.color }} />
                </div>
                <div>
                  <h3 className="font-bold text-[var(--text-primary)] mb-1">{f.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 px-6 bg-[var(--surface-2)]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-[var(--text-primary)] mb-4">Loved by users across Japan</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.name} className="glass-card p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-gold-500" fill="#ffc233" />
                  ))}
                </div>
                <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full gradient-sora flex items-center justify-center text-white text-xs font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{t.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-[var(--text-primary)] mb-6">
            Ready to pay smarter?
          </h2>
          <p className="text-[var(--text-secondary)] mb-10">Join 2 million users. Free forever for personal use.</p>
          <Link href="/register">
            <Button size="xl" className="shadow-[var(--shadow-glow)]">
              Create Free Account
              <ChevronRight size={20} />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[var(--border)] py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl gradient-sora flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="text-sm font-bold text-[var(--text-primary)]">SoraPay</span>
          </div>
          <p className="text-xs text-[var(--text-muted)]">© 2026 SoraPay Inc. All rights reserved. · ソラペイ株式会社</p>
          <div className="flex gap-4">
            {['Privacy', 'Terms', 'Support'].map(item => (
              <a key={item} href="#" className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  )
}
