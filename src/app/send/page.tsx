'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useWallet, TxCategory } from '@/context/WalletContext'
import { useT } from '@/hooks/useT'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { User, DollarSign, FileText, Search, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react'

const CONTACTS = [
  { name: 'Yuki Nakamura', avatar: 'YN', handle: '@yuki.n' },
  { name: 'Kenji Watanabe', avatar: 'KW', handle: '@kenji.w' },
  { name: 'Aiko Suzuki', avatar: 'AS', handle: '@aiko.s' },
  { name: 'Riku Tanaka', avatar: 'RT', handle: '@riku.t' },
  { name: 'Hana Ito', avatar: 'HI', handle: '@hana.i' },
]

const CATEGORIES: { value: TxCategory; label: string; icon: string }[] = [
  { value: 'transfer', label: 'Transfer', icon: '💸' },
  { value: 'food', label: 'Food', icon: '🍜' },
  { value: 'shopping', label: 'Shopping', icon: '🛍️' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎬' },
]

type Step = 'form' | 'confirm' | 'success' | 'error'

export default function SendPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { balance, sendMoney } = useWallet()
  const t = useT()
  const [step, setStep] = useState<Step>('form')
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [category, setCategory] = useState<TxCategory>('transfer')
  const [selectedContact, setSelectedContact] = useState<typeof CONTACTS[0] | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const sliderRef = useRef<HTMLInputElement>(null)
  const [sliderVal, setSliderVal] = useState(0)

  useEffect(() => { if (!user) router.replace('/login') }, [user, router])
  if (!user) return null

  const amountNum = parseFloat(amount.replace(/,/g, '')) || 0
  const hasEnough = amountNum <= balance

  const handleContactSelect = (c: typeof CONTACTS[0]) => {
    setSelectedContact(c)
    setRecipient(c.name)
  }

  const handleNext = () => {
    setError('')
    if (!recipient.trim()) { setError('Please enter a recipient.'); return }
    if (!amountNum || amountNum <= 0) { setError('Please enter a valid amount.'); return }
    if (amountNum > balance) { setError(`Insufficient balance. You have ¥${balance.toLocaleString()}`); return }
    setStep('confirm')
  }

  const handleConfirm = async () => {
    setLoading(true)
    const ok = await sendMoney(recipient, amountNum, note, category)
    setLoading(false)
    setStep(ok ? 'success' : 'error')
  }

  const reset = () => {
    setStep('form'); setRecipient(''); setAmount(''); setNote(''); setSelectedContact(null)
    setSliderVal(0); setError('')
  }

  // Slide to confirm logic
  const handleSliderChange = (v: number) => {
    setSliderVal(v)
    if (v >= 95) { handleConfirm() }
  }

  if (step === 'success') return (
    <div className="lg:pl-64">
      <div className="min-h-screen bg-[var(--bg)] pt-16 lg:pt-0 pb-24 lg:pb-0 flex items-center justify-center">
        <div className="text-center px-8 success-pulse">
          <div className="w-24 h-24 gradient-sage rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-black text-[var(--text-primary)] mb-2">{t.success}</h2>
          <p className="text-[var(--text-muted)] mb-2">¥{amountNum.toLocaleString()} sent to {recipient}</p>
          <p className="text-xs text-[var(--text-muted)] mb-8">+{Math.floor(amountNum / 100)} pts earned!</p>
          <div className="flex flex-col gap-3">
            <Button onClick={reset} size="lg">Send Again</Button>
            <Button variant="ghost" onClick={() => router.push('/dashboard')} size="lg">Back to Dashboard</Button>
          </div>
        </div>
      </div>
    </div>
  )

  if (step === 'error') return (
    <div className="lg:pl-64">
      <div className="min-h-screen bg-[var(--bg)] pt-16 lg:pt-0 pb-24 lg:pb-0 flex items-center justify-center">
        <div className="text-center px-8">
          <div className="w-24 h-24 bg-coral-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-black text-[var(--text-primary)] mb-2">Transfer Failed</h2>
          <p className="text-[var(--text-muted)] mb-8">Something went wrong. Please try again.</p>
          <Button onClick={reset} size="lg">Try Again</Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="lg:pl-64">
      <div className="min-h-screen bg-[var(--bg)] pt-16 lg:pt-0 pb-24 lg:pb-0">
        <div className="max-w-lg mx-auto px-4 lg:px-8 py-6 lg:py-8 space-y-6">

          <div className="fade-in">
            <h1 className="text-2xl font-black text-[var(--text-primary)]">{t.sendMoney}</h1>
            <p className="text-sm text-[var(--text-muted)] mt-0.5">{hasEnough ? `Balance: ¥${balance.toLocaleString()}` : '⚠️ Insufficient balance'}</p>
          </div>

          {step === 'form' && (
            <>
              {/* Quick contacts */}
              <Card padding="md">
                <div className="flex items-center gap-2 mb-3">
                  <Search size={14} className="text-[var(--text-muted)]" />
                  <h2 className="text-sm font-bold text-[var(--text-primary)]">Frequent Contacts</h2>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {CONTACTS.map(c => (
                    <button
                      key={c.name}
                      onClick={() => handleContactSelect(c)}
                      className={`flex flex-col items-center gap-1.5 flex-shrink-0 transition-all ${selectedContact?.name === c.name ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white transition-all
                        ${selectedContact?.name === c.name ? 'gradient-sora ring-2 ring-sora-500 ring-offset-2 ring-offset-[var(--surface)]' : 'gradient-sora/70'}`}>
                        {c.avatar}
                      </div>
                      <span className="text-[9px] text-[var(--text-muted)] text-center leading-tight w-12 truncate">{c.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Form */}
              <Card padding="md">
                <div className="space-y-4">
                  {error && <div className="bg-coral-500/10 border border-coral-500/30 text-coral-500 text-sm rounded-xl p-3">{error}</div>}

                  <Input
                    label={t.recipientName}
                    placeholder="Name or @handle"
                    value={recipient}
                    onChange={e => { setRecipient(e.target.value); setSelectedContact(null) }}
                    icon={<User size={16} />}
                  />

                  {/* Amount */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[var(--text-secondary)]">{t.amount}</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-[var(--text-muted)] font-bold">¥</span>
                      <input
                        type="number"
                        placeholder="0"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        className="w-full pl-8 pr-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] text-xl font-bold placeholder:text-[var(--border)] focus:outline-none focus:ring-2 focus:ring-sora-500/30 focus:border-sora-500 transition-all"
                        min="1"
                        max={balance}
                      />
                      {amountNum > 0 && (
                        <span className={`absolute right-3 text-xs font-semibold ${hasEnough ? 'text-sage-500' : 'text-coral-500'}`}>
                          {hasEnough ? '✓ OK' : '✗ Insufficient'}
                        </span>
                      )}
                    </div>
                    {/* Quick amounts */}
                    <div className="flex gap-2 mt-2">
                      {[500, 1000, 3000, 5000].map(a => (
                        <button
                          key={a}
                          onClick={() => setAmount(String(a))}
                          className="px-2.5 py-1 text-xs rounded-lg bg-[var(--surface-2)] text-[var(--text-secondary)] hover:bg-sora-50 hover:text-sora-600 transition-colors border border-[var(--border)]"
                        >
                          ¥{a.toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">Category</label>
                    <div className="flex gap-2">
                      {CATEGORIES.map(c => (
                        <button
                          key={c.value}
                          onClick={() => setCategory(c.value)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all
                            ${category === c.value ? 'gradient-sora text-white border-transparent' : 'bg-[var(--surface-2)] text-[var(--text-secondary)] border-[var(--border)] hover:border-sora-500/50'}`}
                        >
                          {c.icon} {c.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Input
                    label={t.note}
                    placeholder="What's this for?"
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    icon={<FileText size={16} />}
                  />

                  <Button fullWidth size="lg" onClick={handleNext} disabled={!recipient || !amountNum || amountNum > balance}>
                    Review Transfer
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </Card>
            </>
          )}

          {step === 'confirm' && (
            <Card padding="lg" className="fade-in">
              <h2 className="text-lg font-black text-[var(--text-primary)] mb-6 text-center">Confirm Transfer</h2>

              {/* Summary */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 gradient-sora rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold shadow-lg">
                  {selectedContact?.avatar || recipient.slice(0, 2).toUpperCase()}
                </div>
                <p className="text-sm text-[var(--text-muted)]">Sending to</p>
                <p className="text-lg font-bold text-[var(--text-primary)]">{recipient}</p>
                <p className="text-4xl font-black text-[var(--text-primary)] mt-3">¥{amountNum.toLocaleString()}</p>
                {note && <p className="text-sm text-[var(--text-muted)] mt-2">"{note}"</p>}
                <p className="text-xs text-[var(--text-muted)] mt-1">Earn +{Math.floor(amountNum / 100)} pts</p>
              </div>

              {/* Slide to confirm */}
              <div className="relative bg-[var(--surface-2)] rounded-2xl p-1 mb-4">
                <div
                  className="absolute inset-1 rounded-xl gradient-sora opacity-20 transition-all duration-100"
                  style={{ width: `${sliderVal}%` }}
                />
                <div className="relative flex items-center">
                  <input
                    ref={sliderRef}
                    type="range"
                    min="0"
                    max="100"
                    value={sliderVal}
                    onChange={e => handleSliderChange(parseInt(e.target.value))}
                    onMouseUp={() => { if (sliderVal < 95) setSliderVal(0) }}
                    onTouchEnd={() => { if (sliderVal < 95) setSliderVal(0) }}
                    className="w-full h-12 opacity-0 absolute cursor-pointer z-10"
                    aria-label="Slide to confirm payment"
                  />
                  <div className="w-full flex items-center justify-center h-12 pointer-events-none">
                    <span className="text-sm font-semibold text-[var(--text-muted)]">
                      {loading ? 'Processing...' : t.slideToConfirm + ' →'}
                    </span>
                  </div>
                  <div
                    className="absolute left-1 w-10 h-10 gradient-sora rounded-xl shadow-md flex items-center justify-center transition-all duration-100 pointer-events-none"
                    style={{ transform: `translateX(${Math.min(sliderVal / 100 * (280), 240)}px)` }}
                  >
                    <DollarSign size={18} className="text-white" />
                  </div>
                </div>
              </div>

              <Button variant="ghost" fullWidth onClick={() => setStep('form')}>Back</Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
