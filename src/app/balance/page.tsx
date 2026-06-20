'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useWallet } from '@/context/WalletContext'
import { useT } from '@/hooks/useT'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { TrendingUp, TrendingDown, CreditCard, Plus, Eye, EyeOff, Zap } from 'lucide-react'

const ADD_AMOUNTS = [1000, 2000, 5000, 10000, 20000, 50000]

export default function BalancePage() {
  const router = useRouter()
  const { user } = useAuth()
  const { balance, transactions, addFunds } = useWallet()
  const t = useT()
  const [showBal, setShowBal] = useState(true)
  const [addAmount, setAddAmount] = useState<number | null>(null)
  const [adding, setAdding] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => { if (!user) router.replace('/login') }, [user, router])
  if (!user) return null

  const now = new Date()
  const monthIn = transactions.filter(tx => { const d = new Date(tx.date); return tx.type === 'credit' && d.getMonth() === now.getMonth() }).reduce((s, tx) => s + tx.amount, 0)
  const monthOut = transactions.filter(tx => { const d = new Date(tx.date); return tx.type === 'debit' && d.getMonth() === now.getMonth() }).reduce((s, tx) => s + tx.amount, 0)

  const handleAdd = async () => {
    if (!addAmount) return
    setAdding(true)
    await new Promise(r => setTimeout(r, 1000))
    addFunds(addAmount)
    setAdding(false)
    setSuccess(true)
    setAddAmount(null)
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <div className="lg:pl-64">
      <div className="min-h-screen bg-[var(--bg)] pt-16 lg:pt-0 pb-24 lg:pb-0">
        <div className="max-w-2xl mx-auto px-4 lg:px-8 py-6 lg:py-8 space-y-6">

          <div className="fade-in">
            <h1 className="text-2xl font-black text-[var(--text-primary)]">{t.totalBalance}</h1>
            <p className="text-sm text-[var(--text-muted)] mt-0.5">ウォレット残高の詳細</p>
          </div>

          {/* Main balance card */}
          <div className="relative overflow-hidden rounded-[var(--radius-card)] gradient-sora p-8 text-white shadow-[var(--shadow-glow)] fade-in-delay-1">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full" />
            <div className="absolute right-8 bottom-8 w-32 h-32 bg-white/5 rounded-full" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                  <Zap size={16} fill="white" />
                </div>
                <span className="text-sm font-medium text-white/80">SoraPay Wallet</span>
              </div>

              <div className="flex items-center gap-3 mb-1">
                <p className="text-sm text-white/70">{t.availableBalance}</p>
                <button onClick={() => setShowBal(!showBal)} className="text-white/60 hover:text-white transition-colors" aria-label="Toggle balance visibility">
                  {showBal ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <p className="text-5xl font-black mb-6">
                {showBal ? `¥${balance.toLocaleString()}` : '¥••••••'}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
                <div>
                  <div className="flex items-center gap-1 text-white/70 text-xs mb-1">
                    <TrendingUp size={12} />
                    <span>Month In</span>
                  </div>
                  <p className="text-lg font-bold">+¥{monthIn.toLocaleString()}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-white/70 text-xs mb-1">
                    <TrendingDown size={12} />
                    <span>Month Out</span>
                  </div>
                  <p className="text-lg font-bold">-¥{monthOut.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Linked cards mock */}
          <Card padding="md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-[var(--text-primary)]">Payment Methods</h2>
              <button className="text-xs text-sora-500 hover:underline">Add card</button>
            </div>
            <div className="space-y-3">
              {[
                { brand: 'VISA', last4: '4242', color: 'from-sora-700 to-sora-500', icon: '💳' },
                { brand: 'JCB', last4: '8800', color: 'from-gold-600 to-gold-400', icon: '💳' },
              ].map(card => (
                <div key={card.last4} className={`relative overflow-hidden rounded-xl p-4 bg-gradient-to-r ${card.color} text-white`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white/70 mb-1">{card.brand}</p>
                      <p className="text-sm font-bold">•••• •••• •••• {card.last4}</p>
                    </div>
                    <CreditCard size={20} className="text-white/60" />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Add money */}
          <Card padding="md">
            <h2 className="text-sm font-bold text-[var(--text-primary)] mb-4">
              <span className="flex items-center gap-2"><Plus size={16} className="text-sora-500" />{t.addMoney}</span>
            </h2>

            {success && (
              <div className="mb-4 p-3 bg-sage-500/10 border border-sage-500/30 text-sage-600 text-sm rounded-xl success-pulse">
                ✅ Funds added successfully!
              </div>
            )}

            <p className="text-xs text-[var(--text-muted)] mb-3">Select amount to add:</p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {ADD_AMOUNTS.map(amt => (
                <button
                  key={amt}
                  onClick={() => setAddAmount(amt === addAmount ? null : amt)}
                  className={`py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border
                    ${addAmount === amt
                      ? 'gradient-sora text-white border-transparent shadow-md'
                      : 'bg-[var(--surface-2)] text-[var(--text-secondary)] border-[var(--border)] hover:border-sora-500/50'
                    }`}
                >
                  ¥{amt.toLocaleString()}
                </button>
              ))}
            </div>

            <Button
              fullWidth
              size="lg"
              loading={adding}
              disabled={!addAmount}
              onClick={handleAdd}
            >
              {adding ? 'Processing...' : addAmount ? `Add ¥${addAmount.toLocaleString()}` : 'Select an amount'}
            </Button>
          </Card>

        </div>
      </div>
    </div>
  )
}
