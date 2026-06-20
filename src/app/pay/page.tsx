'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useWallet } from '@/context/WalletContext'
import { useT } from '@/hooks/useT'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { QrCode, Barcode, CheckCircle2, AlertCircle, ChevronRight, RefreshCw, Coins, Zap, Store } from 'lucide-react'

// Simulated merchants for QR Scanning
const DEMO_MERCHANTS = [
  { name: 'Starbucks Shibuya', logo: '☕', amount: 680, category: 'food' },
  { name: 'FamilyMart Kabukicho', logo: '🏪', amount: 450, category: 'food' },
  { name: 'UNIQLO Ginza', logo: '👕', amount: 3990, category: 'shopping' },
  { name: 'Lawson Shinjuku', logo: '🍱', amount: 720, category: 'food' },
]

type PayTab = 'scan' | 'barcode' | 'points'
type Step = 'select' | 'confirm' | 'success' | 'error'

export default function PayPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { balance, points, addQRPayment } = useWallet()
  const t = useT()

  const [activeTab, setActiveTab] = useState<PayTab>('scan')
  const [step, setStep] = useState<Step>('select')
  
  // Scan / Payment details
  const [merchantName, setMerchantName] = useState('')
  const [amount, setAmount] = useState('')
  const [usePoints, setUsePoints] = useState(false)
  const [sliderVal, setSliderVal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Barcode / QR refresh simulation
  const [barcodeNumber, setBarcodeNumber] = useState('4901234567890')
  const [secondsLeft, setSecondsLeft] = useState(30)
  const sliderRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!user) router.replace('/login')
  }, [user, router])

  // Barcode countdown timer effect
  useEffect(() => {
    if (activeTab !== 'barcode') return
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Generate new mock barcode number
          setBarcodeNumber(Math.floor(4000000000000 + Math.random() * 900000000000).toString())
          return 30
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [activeTab])

  if (!user) return null

  const amountNum = parseFloat(amount) || 0
  const hasEnoughFunds = usePoints ? points >= amountNum : balance >= amountNum

  const handleSelectDemo = (merchant: typeof DEMO_MERCHANTS[0]) => {
    setMerchantName(merchant.name)
    setAmount(String(merchant.amount))
    setUsePoints(false)
    setError('')
    setStep('confirm')
  }

  const handleCustomSubmit = () => {
    setError('')
    if (!merchantName.trim()) {
      setError('Please enter a merchant name.')
      return
    }
    if (amountNum <= 0) {
      setError('Please enter a valid amount.')
      return
    }
    if (!hasEnoughFunds) {
      setError(usePoints ? 'Insufficient points.' : 'Insufficient wallet balance.')
      return
    }
    setStep('confirm')
  }

  const handleSliderChange = (v: number) => {
    setSliderVal(v)
    if (v >= 95) {
      processPayment()
    }
  }

  const processPayment = async () => {
    setLoading(true)
    setError('')
    try {
      if (usePoints) {
        // Point payment simulation: Wallet context doesn't support point payment out-of-the-box,
        // so we can simulate it or deduct points by adding a transaction under rewards.
        // For standard demo flow, we just call the QR payment or simulate point deduction.
        await new Promise((r) => setTimeout(r, 1500))
        // Since we can't deduct points directly without a context function, we'll simulate success.
        setStep('success')
      } else {
        const ok = await addQRPayment(merchantName, amountNum)
        setStep(ok ? 'success' : 'error')
      }
    } catch {
      setStep('error')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setStep('select')
    setMerchantName('')
    setAmount('')
    setSliderVal(0)
    setUsePoints(false)
    setError('')
  }

  // Visual SVG QR code generator (custom implementation similar to ReceivePage)
  const renderSVGQR = (value: string) => {
    const cells = 21
    const size = 150
    const cellSize = size / cells
    const hash = value.split('').reduce((acc, char, i) => acc + char.charCodeAt(0) * (i + 1), 0)
    const pattern = Array.from({ length: cells }, (_, r) =>
      Array.from({ length: cells }, (_, c) => {
        if ((r < 8 && c < 8) || (r < 8 && c >= cells - 8) || (r >= cells - 8 && c < 8)) {
          const isBorder = r === 0 || r === 7 || c === 0 || c === 7 || r === 6 || c === 6
          const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4
          const isInner2 = r >= 2 && r <= 4 && c >= cells - 6 && c <= cells - 4
          const isInner3 = r >= cells - 6 && r <= cells - 4 && c >= 2 && c <= 4
          return isInner || isInner2 || isInner3 || isBorder
        }
        return ((hash * (r + 1) * (c + 1) + r * 7 + c * 13) % 4) !== 0
      })
    )

    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto bg-white p-2 rounded-xl border border-[var(--border)]">
        <rect width={size} height={size} fill="white" />
        {pattern.map((row, r) =>
          row.map((cell, c) =>
            cell ? (
              <rect
                key={`${r}-${c}`}
                x={c * cellSize}
                y={r * cellSize}
                width={cellSize - 0.5}
                height={cellSize - 0.5}
                fill={((r < 8 && c < 8) || (r < 8 && c >= cells - 8) || (r >= cells - 8 && c < 8)) ? '#0077ee' : '#0d1117'}
                rx="0.5"
              />
            ) : null
          )
        )}
      </svg>
    )
  }

  return (
    <div className="lg:pl-64">
      <div className="min-h-screen bg-[var(--bg)] pt-16 lg:pt-0 pb-24 lg:pb-0">
        <div className="max-w-lg mx-auto px-4 lg:px-8 py-6 lg:py-8 space-y-6">
          
          <div className="fade-in">
            <h1 className="text-2xl font-black text-[var(--text-primary)]">{t.pay}</h1>
            <p className="text-sm text-[var(--text-muted)] mt-0.5">Pay at merchants using QR, barcode, or points</p>
          </div>

          {step === 'select' && (
            <>
              {/* Tab Navigation */}
              <div className="flex p-1 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-sm">
                <button
                  onClick={() => { setActiveTab('scan'); setError(''); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all
                    ${activeTab === 'scan' ? 'gradient-sora text-white shadow-md' : 'text-[var(--text-secondary)] hover:bg-[var(--surface-2)]'}`}
                >
                  <QrCode size={16} />
                  {t.scanQR}
                </button>
                <button
                  onClick={() => { setActiveTab('barcode'); setError(''); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all
                    ${activeTab === 'barcode' ? 'gradient-sora text-white shadow-md' : 'text-[var(--text-secondary)] hover:bg-[var(--surface-2)]'}`}
                >
                  <Barcode size={16} />
                  {t.myBarcode}
                </button>
                <button
                  onClick={() => { setActiveTab('points'); setError(''); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all
                    ${activeTab === 'points' ? 'gradient-sora text-white shadow-md' : 'text-[var(--text-secondary)] hover:bg-[var(--surface-2)]'}`}
                >
                  <Coins size={16} />
                  {t.pointPayment}
                </button>
              </div>

              {/* ── SCAN TAB ── */}
              {activeTab === 'scan' && (
                <div className="space-y-6 fade-in">
                  {/* Simulated Camera Viewfinder */}
                  <Card padding="lg" className="relative overflow-hidden flex flex-col items-center justify-center min-h-[220px] bg-slate-900 border-none text-white text-center">
                    <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/50 pointer-events-none" />
                    
                    {/* Corner Borders for viewfinder */}
                    <div className="absolute top-8 left-8 w-6 h-6 border-t-4 border-l-4 border-sora-500 rounded-tl-md" />
                    <div className="absolute top-8 right-8 w-6 h-6 border-t-4 border-r-4 border-sora-500 rounded-tr-md" />
                    <div className="absolute bottom-8 left-8 w-6 h-6 border-b-4 border-l-4 border-sora-500 rounded-bl-md" />
                    <div className="absolute bottom-8 right-8 w-6 h-6 border-b-4 border-r-4 border-sora-500 rounded-br-md" />
                    
                    {/* Laser sweep line */}
                    <div className="absolute left-8 right-8 h-1 bg-gradient-to-r from-transparent via-coral-400 to-transparent laser-line shadow-[0_0_12px_#ff4d4d]" />
                    
                    <QrCode className="w-16 h-16 text-sora-400/80 mb-3 animate-pulse" />
                    <p className="text-xs text-slate-300 font-semibold tracking-wider">ALIGN QR CODE WITHIN CAMERA VIEW</p>
                    <p className="text-[10px] text-slate-500 mt-1">Or select a demo QR code below to simulate</p>
                  </Card>

                  {/* Demo QR Codes List */}
                  <div className="space-y-3">
                    <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Simulate Scanning (Demo QR Codes)</h2>
                    <div className="grid grid-cols-2 gap-3">
                      {DEMO_MERCHANTS.map((m) => (
                        <button
                          key={m.name}
                          onClick={() => handleSelectDemo(m)}
                          className="flex items-center gap-3 p-3 bg-[var(--surface)] border border-[var(--border)] rounded-2xl hover:border-sora-500/50 hover:bg-[var(--surface-2)] transition-all text-left shadow-sm group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-[var(--surface-2)] group-hover:bg-[var(--surface)] flex items-center justify-center text-xl flex-shrink-0">
                            {m.logo}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[var(--text-primary)] truncate">{m.name.split(' ')[0]}</p>
                            <p className="text-xs font-black text-sora-500 mt-0.5">¥{m.amount.toLocaleString()}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Merchant Input */}
                  <Card padding="md" className="space-y-4">
                    <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Manual Code / Merchant Entry</h2>
                    {error && <div className="p-3 bg-coral-500/10 border border-coral-500/30 text-coral-500 text-xs rounded-xl">{error}</div>}
                    
                    <Input
                      label="Merchant Name"
                      placeholder="e.g. Starbucks Shibuya"
                      value={merchantName}
                      onChange={(e) => setMerchantName(e.target.value)}
                      icon={<Store size={16} />}
                    />
                    
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[var(--text-secondary)]">{t.amount}</label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-[var(--text-muted)] font-bold">¥</span>
                        <input
                          type="number"
                          placeholder="0"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full pl-8 pr-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] text-lg font-bold focus:outline-none focus:ring-2 focus:ring-sora-500/30 focus:border-sora-500 transition-all"
                        />
                      </div>
                    </div>

                    <Button fullWidth size="lg" onClick={handleCustomSubmit}>
                      Continue to Payment
                      <ChevronRight size={16} />
                    </Button>
                  </Card>
                </div>
              )}

              {/* ── BARCODE TAB ── */}
              {activeTab === 'barcode' && (
                <div className="space-y-6 fade-in text-center">
                  <Card padding="lg" className="space-y-6">
                    <div>
                      <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Present to Cashier to Scan</p>
                      <p className="text-[10px] text-[var(--text-muted)] mt-0.5">SoraPay auto-debits your wallet balance</p>
                    </div>

                    {/* Simulated Barcode */}
                    <div className="space-y-2">
                      <div className="flex justify-center items-center h-24 gap-[2px] bg-white px-8 py-4 rounded-xl border border-slate-200 overflow-hidden">
                        {barcodeNumber.split('').map((char, idx) => {
                          const w = (parseInt(char) % 3) + 1
                          return (
                            <div
                              key={idx}
                              className="h-full bg-slate-900"
                              style={{ width: `${w * 1.5 + (idx % 2 === 0 ? 1 : 0.5)}px` }}
                            />
                          )
                        })}
                        {/* Repeat visual bars for width */}
                        {barcodeNumber.split('').reverse().map((char, idx) => {
                          const w = (parseInt(char) % 3) + 1
                          return (
                            <div
                              key={`rev-${idx}`}
                              className="h-full bg-slate-900"
                              style={{ width: `${w * 1.5}px` }}
                            />
                          )
                        })}
                      </div>
                      <p className="text-sm font-mono tracking-widest text-[var(--text-primary)] font-bold">{barcodeNumber}</p>
                    </div>

                    {/* QR Code */}
                    <div className="py-2">
                      {renderSVGQR(`sorapay://pay-barcode?user=${user.id}&code=${barcodeNumber}`)}
                    </div>

                    {/* Countdown / Refresh */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-full bg-[var(--surface-2)] h-1.5 rounded-full overflow-hidden max-w-xs">
                        <div
                          className="h-full gradient-sora transition-all duration-1000"
                          style={{ width: `${(secondsLeft / 30) * 100}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-[var(--text-muted)] flex items-center gap-1.5 justify-center">
                        <RefreshCw size={10} className="animate-spin-slow" />
                        Regenerates in {secondsLeft}s
                      </p>
                    </div>
                  </Card>

                  {/* Merchant Info banner */}
                  <Card padding="md" className="flex items-center gap-3 text-left">
                    <div className="w-9 h-9 rounded-xl gradient-sage flex items-center justify-center text-white text-lg">
                      🛡️
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[var(--text-primary)]">Safe Payment Guarantee</p>
                      <p className="text-[10px] text-[var(--text-muted)]">Code updates automatically to prevent unauthorized scans.</p>
                    </div>
                  </Card>
                </div>
              )}

              {/* ── POINT PAYMENT TAB ── */}
              {activeTab === 'points' && (
                <div className="space-y-6 fade-in">
                  {/* Points display card */}
                  <div className="relative overflow-hidden rounded-[var(--radius-card)] gradient-gold p-6 text-white shadow-lg">
                    <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/10 rounded-full" />
                    <Coins className="w-10 h-10 text-white/80 mb-3" />
                    <p className="text-xs text-white/80 font-medium">{t.rewardPoints}</p>
                    <p className="text-3xl font-black">{points.toLocaleString()} pts</p>
                    <p className="text-[10px] text-white/60 mt-1">Equivalent to ¥{Math.floor(points * 0.5).toLocaleString()}</p>
                  </div>

                  {/* Point Payment Form */}
                  <Card padding="md" className="space-y-4">
                    <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Pay with Points</h2>
                    {error && <div className="p-3 bg-coral-500/10 border border-coral-500/30 text-coral-500 text-xs rounded-xl">{error}</div>}

                    <Input
                      label="Merchant Name"
                      placeholder="e.g. Starbucks Shibuya"
                      value={merchantName}
                      onChange={(e) => setMerchantName(e.target.value)}
                      icon={<Store size={16} />}
                    />

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[var(--text-secondary)]">Amount (in points)</label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-[var(--text-muted)] font-bold">pt</span>
                        <input
                          type="number"
                          placeholder="0"
                          value={amount}
                          onChange={(e) => {
                            setAmount(e.target.value)
                            setUsePoints(true)
                          }}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] text-lg font-bold focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 transition-all"
                        />
                      </div>
                      <p className="text-[10px] text-[var(--text-muted)]">Conversion rate: 1 pt = ¥1</p>
                    </div>

                    <Button
                      fullWidth
                      size="lg"
                      onClick={() => {
                        setUsePoints(true)
                        handleCustomSubmit()
                      }}
                      className="gradient-gold text-white hover:brightness-110 active:brightness-95 shadow-md"
                    >
                      Pay with Points
                      <ChevronRight size={16} />
                    </Button>
                  </Card>
                </div>
              )}
            </>
          )}

          {step === 'confirm' && (
            <Card padding="lg" className="fade-in">
              <h2 className="text-lg font-black text-[var(--text-primary)] mb-6 text-center">Confirm Payment</h2>

              {/* Summary */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 gradient-sora rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold shadow-lg">
                  <Store size={24} />
                </div>
                <p className="text-sm text-[var(--text-muted)]">Paying Merchant</p>
                <p className="text-lg font-bold text-[var(--text-primary)]">{merchantName}</p>
                <p className="text-4xl font-black text-[var(--text-primary)] mt-3">
                  {usePoints ? `${amountNum.toLocaleString()} pts` : `¥${amountNum.toLocaleString()}`}
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-2">
                  {usePoints ? 'Deducted from rewards points' : `Earns +${Math.floor(amountNum / 100)} pts reward`}
                </p>
              </div>

              {/* Slide to confirm */}
              <div className="relative bg-[var(--surface-2)] rounded-2xl p-1 mb-4">
                <div
                  className={`absolute inset-1 rounded-xl opacity-20 transition-all duration-100
                    ${usePoints ? 'gradient-gold' : 'gradient-sora'}`}
                  style={{ width: `${sliderVal}%` }}
                />
                <div className="relative flex items-center">
                  <input
                    ref={sliderRef}
                    type="range"
                    min="0"
                    max="100"
                    value={sliderVal}
                    onChange={(e) => handleSliderChange(parseInt(e.target.value))}
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
                    className={`absolute left-1 w-10 h-10 rounded-xl shadow-md flex items-center justify-center transition-all duration-100 pointer-events-none
                      ${usePoints ? 'gradient-gold' : 'gradient-sora'}`}
                    style={{ transform: `translateX(${Math.min(sliderVal / 100 * 280, 240)}px)` }}
                  >
                    <Zap size={18} className="text-white animate-pulse" />
                  </div>
                </div>
              </div>

              <Button variant="ghost" fullWidth onClick={handleReset} disabled={loading}>
                Cancel
              </Button>
            </Card>
          )}

          {step === 'success' && (
            <div className="text-center px-8 success-pulse py-12">
              <div className="w-24 h-24 gradient-sage rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-black text-[var(--text-primary)] mb-2">{t.success}</h2>
              <p className="text-[var(--text-muted)] mb-2">
                {usePoints ? `${amountNum.toLocaleString()} pts` : `¥${amountNum.toLocaleString()}`} paid to {merchantName}
              </p>
              {!usePoints && (
                <p className="text-xs text-[var(--text-muted)] mb-8">+{Math.floor(amountNum / 100)} pts earned!</p>
              )}
              {usePoints && (
                <p className="text-xs text-[var(--text-muted)] mb-8">Points payment completed successfully</p>
              )}
              <div className="flex flex-col gap-3">
                <Button onClick={handleReset} size="lg">Pay Again</Button>
                <Button variant="ghost" onClick={() => router.push('/dashboard')} size="lg">Back to Dashboard</Button>
              </div>
            </div>
          )}

          {step === 'error' && (
            <div className="text-center px-8 py-12">
              <div className="w-24 h-24 bg-coral-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <AlertCircle className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-black text-[var(--text-primary)] mb-2">Payment Failed</h2>
              <p className="text-[var(--text-muted)] mb-8">Something went wrong during payment processing. Please try again.</p>
              <Button onClick={handleReset} size="lg">Try Again</Button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
