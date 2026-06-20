'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useWallet } from '@/context/WalletContext'
import { useT } from '@/hooks/useT'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Copy, Share2, Check, Download } from 'lucide-react'

function QRDisplay({ value, size = 200 }: { value: string; size?: number }) {
  // SVG-based QR code visual (artistic representation)
  const cells = 21
  const cellSize = size / cells

  // Deterministic pattern based on value hash
  const hash = value.split('').reduce((acc, char, i) => acc + char.charCodeAt(0) * (i + 1), 0)
  const pattern = Array.from({ length: cells }, (_, r) =>
    Array.from({ length: cells }, (_, c) => {
      // Finder patterns (corners)
      if ((r < 8 && c < 8) || (r < 8 && c >= cells - 8) || (r >= cells - 8 && c < 8)) {
        const isFinderBorder = (r === 0 || r === 7 || c === 0 || c === 7) ||
          (r === 0 || r === 6 || c === 0 || c === 6)
        const isFinderInner = r >= 2 && r <= 4 && c >= 2 && c <= 4
        const isFinderInner2 = r >= 2 && r <= 4 && c >= cells - 6 && c <= cells - 4
        const isFinderInner3 = r >= cells - 6 && r <= cells - 4 && c >= 2 && c <= 4
        return isFinderInner || isFinderInner2 || isFinderInner3 || isFinderBorder || true
      }
      return ((hash * (r + 1) * (c + 1) + r * 7 + c * 13) % 3) !== 0
    })
  )

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="QR code for receiving payment"
    >
      {/* White background */}
      <rect width={size} height={size} fill="white" rx="12" />

      {/* QR modules */}
      {pattern.map((row, r) =>
        row.map((cell, c) => {
          if (!cell) return null
          // Finder pattern corners get gradient color
          const isCorner = (r < 8 && c < 8) || (r < 8 && c >= cells - 8) || (r >= cells - 8 && c < 8)
          return (
            <rect
              key={`${r}-${c}`}
              x={c * cellSize + 1}
              y={r * cellSize + 1}
              width={cellSize - 1}
              height={cellSize - 1}
              rx={isCorner ? 1.5 : 1}
              fill={isCorner ? '#0077ee' : '#0d1117'}
            />
          )
        })
      )}

      {/* Center logo overlay */}
      <rect x={size/2-18} y={size/2-18} width="36" height="36" fill="white" rx="8" />
      <rect x={size/2-14} y={size/2-14} width="28" height="28" fill="#0077ee" rx="6" />
      <text x={size/2} y={size/2+5} textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">⚡</text>
    </svg>
  )
}

export default function ReceivePage() {
  const router = useRouter()
  const { user } = useAuth()
  const { balance } = useWallet()
  const t = useT()
  const [copied, setCopied] = useState(false)
  const [requestAmount, setRequestAmount] = useState('')

  useEffect(() => { if (!user) router.replace('/login') }, [user, router])
  if (!user) return null

  const qrValue = `sorapay://pay?to=${user.id}&name=${encodeURIComponent(user.name)}&amount=${requestAmount || ''}`
  const myLink = `sorapay.jp/pay/${user.id}`

  const handleCopy = () => {
    navigator.clipboard.writeText(myLink).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="lg:pl-64">
      <div className="min-h-screen bg-[var(--bg)] pt-16 lg:pt-0 pb-24 lg:pb-0">
        <div className="max-w-lg mx-auto px-4 lg:px-8 py-6 lg:py-8 space-y-6">

          <div className="fade-in">
            <h1 className="text-2xl font-black text-[var(--text-primary)]">{t.receiveMoney}</h1>
            <p className="text-sm text-[var(--text-muted)] mt-0.5">Share your QR to receive payments instantly</p>
          </div>

          {/* QR Card */}
          <Card padding="lg" className="text-center fade-in-delay-1">
            <div className="mb-4">
              <div className="w-10 h-10 gradient-sora rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                <span className="text-white font-bold text-sm">{user.avatar}</span>
              </div>
              <p className="text-base font-bold text-[var(--text-primary)]">{user.name}</p>
              <p className="text-xs text-[var(--text-muted)]">{user.email}</p>
            </div>

            {/* QR Code */}
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-white rounded-2xl shadow-md inline-block border border-[var(--border)]">
                <QRDisplay value={qrValue} size={180} />
              </div>
            </div>

            <p className="text-xs text-[var(--text-muted)] mb-4 font-mono">{myLink}</p>

            {/* Optional amount request */}
            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-bold">¥</span>
                <input
                  type="number"
                  placeholder="Request specific amount (optional)"
                  value={requestAmount}
                  onChange={e => setRequestAmount(e.target.value)}
                  className="w-full pl-7 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-sora-500/30 focus:border-sora-500 transition-all"
                  min="0"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" size="md" onClick={handleCopy} icon={copied ? <Check size={16} className="text-sage-500" /> : <Copy size={16} />}>
                {copied ? 'Copied!' : t.copyLink}
              </Button>
              <Button size="md" icon={<Share2 size={16} />}>
                {t.shareQR}
              </Button>
            </div>
          </Card>

          {/* My balance mini */}
          <Card padding="md" className="flex items-center justify-between fade-in-delay-2">
            <div>
              <p className="text-xs text-[var(--text-muted)]">Current Balance</p>
              <p className="text-xl font-black text-[var(--text-primary)]">¥{balance.toLocaleString()}</p>
            </div>
            <Button variant="ghost" size="sm" icon={<Download size={14} />}>
              Save QR
            </Button>
          </Card>

          {/* Instructions */}
          <Card padding="md" className="fade-in-delay-3">
            <h2 className="text-sm font-bold text-[var(--text-primary)] mb-3">How to receive money</h2>
            <div className="space-y-3">
              {[
                { step: '1', text: 'Show this QR code to the sender', icon: '📱' },
                { step: '2', text: 'They scan it with their SoraPay app', icon: '📸' },
                { step: '3', text: 'Confirm the amount and complete payment', icon: '✅' },
              ].map(item => (
                <div key={item.step} className="flex items-center gap-3">
                  <div className="w-7 h-7 gradient-sora rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {item.step}
                  </div>
                  <span className="text-sm text-[var(--text-secondary)]">{item.text}</span>
                  <span className="ml-auto">{item.icon}</span>
                </div>
              ))}
            </div>
          </Card>

        </div>
      </div>
    </div>
  )
}
