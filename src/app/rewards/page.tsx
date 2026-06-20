'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useWallet, Coupon } from '@/context/WalletContext'
import { useT } from '@/hooks/useT'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Star, Gift, Check, Clock, X, Coins, Sparkles, AlertCircle } from 'lucide-react'

export default function RewardsPage() {
  const router = useRouter()
  const { user, language } = useAuth()
  const { points, cashback, coupons, claimCoupon, useCoupon } = useWallet()
  const t = useT()

  const [activeTab, setActiveTab] = useState<'available' | 'claimed'>('available')
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)

  useEffect(() => {
    if (!user) router.replace('/login')
  }, [user, router])

  if (!user) return null

  // Tiers calculation
  let currentTier = 'Bronze'
  let nextTier = 'Silver'
  let ptsNeeded = 1000 - points
  let progressPercent = (points / 1000) * 100

  if (points >= 2500) {
    currentTier = 'Gold'
    nextTier = 'Platinum'
    ptsNeeded = 5000 - points
    progressPercent = ((points - 2500) / 2500) * 100
  } else if (points >= 1000) {
    currentTier = 'Silver'
    nextTier = 'Gold'
    ptsNeeded = 2500 - points
    progressPercent = ((points - 1000) / 1500) * 100
  }

  const available = coupons.filter((c) => !c.claimed)
  const claimed = coupons.filter((c) => c.claimed && !c.used)

  const handleClaim = (couponId: string) => {
    setErrorMsg('')
    setSuccessMsg('')
    const ok = claimCoupon(couponId)
    if (ok) {
      setSuccessMsg('Coupon claimed successfully! Find it in "Claimed Coupons".')
      setTimeout(() => setSuccessMsg(''), 4000)
    } else {
      setErrorMsg('Insufficient points to claim this coupon.')
      setTimeout(() => setErrorMsg(''), 4000)
    }
  }

  const handleRedeem = (couponId: string) => {
    useCoupon(couponId)
    setSelectedCoupon(null)
    setSuccessMsg('Coupon used successfully!')
    setTimeout(() => setSuccessMsg(''), 4000)
  }

  return (
    <div className="lg:pl-64">
      <div className="min-h-screen bg-[var(--bg)] pt-16 lg:pt-0 pb-24 lg:pb-0">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6 lg:py-8 space-y-6">
          
          {/* Header */}
          <div className="fade-in">
            <h1 className="text-2xl font-black text-[var(--text-primary)]">{t.myRewards}</h1>
            <p className="text-sm text-[var(--text-muted)] mt-0.5">Use points to claim store coupons and view cashback</p>
          </div>

          {/* Messages */}
          {successMsg && (
            <div className="p-3 bg-sage-500/10 border border-sage-500/30 text-sage-600 text-xs rounded-xl flex items-center gap-2 success-pulse">
              <Sparkles size={14} />
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="p-3 bg-coral-500/10 border border-coral-500/30 text-coral-500 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle size={14} />
              {errorMsg}
            </div>
          )}

          {/* Stats Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 fade-in-delay-1">
            {/* Points card */}
            <div className="relative overflow-hidden rounded-[var(--radius-card)] gradient-gold p-6 text-white shadow-md">
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/10 rounded-full" />
              <Star className="w-8 h-8 text-white/90 mb-3" fill="white" />
              <p className="text-xs text-white/80 font-medium">{t.points}</p>
              <p className="text-3xl font-black">{points.toLocaleString()} pts</p>
              <p className="text-[10px] text-white/70 mt-1">≈ ¥{Math.floor(points * 0.5).toLocaleString()} value</p>
            </div>

            {/* Cashback card */}
            <div className="relative overflow-hidden rounded-[var(--radius-card)] gradient-sora p-6 text-white shadow-md">
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/10 rounded-full" />
              <Gift className="w-8 h-8 text-white/90 mb-3" />
              <p className="text-xs text-white/80 font-medium">{t.cashback}</p>
              <p className="text-3xl font-black">¥{cashback.toLocaleString()}</p>
              <p className="text-[10px] text-white/70 mt-1">Direct wallet cashback</p>
            </div>

            {/* Status card */}
            <Card padding="md" className="relative overflow-hidden flex flex-col justify-between">
              <div>
                <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">Member Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xl font-black capitalize
                    ${currentTier === 'Gold' ? 'text-gold-600' : currentTier === 'Silver' ? 'text-slate-400' : 'text-amber-700'}`}>
                    {currentTier} Tier
                  </span>
                  <span className="text-[10px] bg-[var(--surface-2)] text-[var(--text-muted)] font-semibold px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 mt-4">
                <div className="flex justify-between text-[10px] text-[var(--text-muted)]">
                  <span>{points} pts</span>
                  <span>Next: {nextTier} ({ptsNeeded} pts needed)</span>
                </div>
                <div className="w-full bg-[var(--surface-2)] h-2 rounded-full overflow-hidden border border-[var(--border)]">
                  <div
                    className="h-full gradient-sora rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(progressPercent, 100)}%` }}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Toggle Tab */}
          <div className="flex p-1 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-sm fade-in-delay-2">
            <button
              onClick={() => setActiveTab('available')}
              className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all
                ${activeTab === 'available' ? 'gradient-sora text-white shadow-md' : 'text-[var(--text-secondary)] hover:bg-[var(--surface-2)]'}`}
            >
              {t.availableCoupons} ({available.length})
            </button>
            <button
              onClick={() => setActiveTab('claimed')}
              className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all
                ${activeTab === 'claimed' ? 'gradient-sora text-white shadow-md' : 'text-[var(--text-secondary)] hover:bg-[var(--surface-2)]'}`}
            >
              {t.claimedCoupons} ({claimed.length})
            </button>
          </div>

          {/* Coupon Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 fade-in-delay-3">
            {activeTab === 'available' ? (
              available.length === 0 ? (
                <div className="col-span-2 text-center py-16">
                  <div className="text-5xl mb-3">🎫</div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">No coupons available</h3>
                  <p className="text-xs text-[var(--text-muted)] mt-1">Check back later for new merchant deals!</p>
                </div>
              ) : (
                available.map((c) => {
                  const canClaim = points >= c.pointsCost
                  return (
                    <Card key={c.id} padding="md" className="flex flex-col justify-between border-l-4" style={{ borderLeftColor: c.color }}>
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{c.merchantIcon}</span>
                            <div>
                              <p className="text-xs font-bold text-[var(--text-primary)]">{c.merchant}</p>
                              <p className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                                <Clock size={10} /> {t.expires}: {c.expiresAt}
                              </p>
                            </div>
                          </div>
                          <span className="text-lg font-black text-sora-600">{c.discount}</span>
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-[var(--text-primary)] leading-snug">
                            {language === 'ja' ? c.titleJa : c.title}
                          </h3>
                          <p className="text-xs text-[var(--text-muted)] mt-0.5">
                            {language === 'ja' ? c.descriptionJa : c.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4 mt-6 pt-4 border-t border-[var(--border)]">
                        <div className="flex items-center gap-1 text-gold-600">
                          <Coins size={14} fill="#e6a800" />
                          <span className="text-xs font-black">{c.pointsCost} {t.pt}</span>
                        </div>
                        <Button
                          size="sm"
                          disabled={!canClaim}
                          onClick={() => handleClaim(c.id)}
                          className={canClaim ? 'shadow-sm' : ''}
                        >
                          {t.claim}
                        </Button>
                      </div>
                    </Card>
                  )
                })
              )
            ) : (
              claimed.length === 0 ? (
                <div className="col-span-2 text-center py-16">
                  <div className="text-5xl mb-3">🎫</div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">{t.claimedCoupons} is empty</h3>
                  <p className="text-xs text-[var(--text-muted)] mt-1">Claim store discounts using points above</p>
                </div>
              ) : (
                claimed.map((c) => (
                  <Card key={c.id} padding="md" className="flex flex-col justify-between border-l-4" style={{ borderLeftColor: c.color }}>
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{c.merchantIcon}</span>
                          <div>
                            <p className="text-xs font-bold text-[var(--text-primary)]">{c.merchant}</p>
                            <p className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                              <Clock size={10} /> {t.expires}: {c.expiresAt}
                            </p>
                          </div>
                        </div>
                        <span className="text-lg font-black text-sora-600">{c.discount}</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[var(--text-primary)] leading-snug">
                          {language === 'ja' ? c.titleJa : c.title}
                        </h3>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">
                          {language === 'ja' ? c.descriptionJa : c.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 mt-6 pt-4 border-t border-[var(--border)]">
                      <span className="text-xs font-semibold text-sage-500 flex items-center gap-1">
                        <Check size={14} /> Ready to Use
                      </span>
                      <Button size="sm" onClick={() => setSelectedCoupon(c)}>
                        {t.use}
                      </Button>
                    </div>
                  </Card>
                ))
              )
            )}
          </div>
        </div>
      </div>

      {/* Cashier Redemption Code Modal */}
      {selectedCoupon && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] w-full max-w-sm rounded-[var(--radius-card)] overflow-hidden shadow-2xl border border-[var(--border)] slide-up">
            
            {/* Header */}
            <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
              <h2 className="text-sm font-bold text-[var(--text-primary)]">Present Coupon</h2>
              <button
                onClick={() => setSelectedCoupon(null)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 text-center space-y-6">
              <div>
                <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Store Redemption</p>
                <h3 className="text-lg font-black text-[var(--text-primary)] mt-1">{selectedCoupon.merchant}</h3>
                <p className="text-xs text-[var(--text-muted)]">{language === 'ja' ? selectedCoupon.titleJa : selectedCoupon.title}</p>
              </div>

              {/* Mock QR/Barcode */}
              <div className="p-4 bg-white rounded-2xl inline-block border border-slate-200 shadow-sm space-y-3">
                <div className="flex justify-center items-center h-14 gap-[2px] w-48 overflow-hidden">
                  {[1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 2, 1, 2, 3].map((w, idx) => (
                    <div key={idx} className="h-full bg-slate-900" style={{ width: `${w * 1.5}px` }} />
                  ))}
                </div>
                <p className="text-[10px] font-mono tracking-widest text-slate-800">COUPON-{selectedCoupon.id.toUpperCase()}-2026</p>
              </div>

              <div className="space-y-2">
                <Button fullWidth onClick={() => handleRedeem(selectedCoupon.id)}>
                  Mark as Redeemed / Used
                </Button>
                <Button variant="ghost" fullWidth onClick={() => setSelectedCoupon(null)}>
                  Back
                </Button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
