'use client'

import { useState } from 'react'
import { useWallet } from '@/context/WalletContext'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MONTHS_JA = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

const CATEGORY_COLORS: Record<string, string> = {
  food: '#ff6b6b',
  shopping: '#0077ee',
  transport: '#36b5ac',
  utilities: '#ffc233',
  entertainment: '#a855f7',
  transfer: '#22c55e',
  rewards: '#f97316',
}

const CATEGORY_LABELS: Record<string, string> = {
  food: 'Food & Drink',
  shopping: 'Shopping',
  transport: 'Transport',
  utilities: 'Utilities',
  entertainment: 'Entertainment',
  transfer: 'Transfer',
  rewards: 'Rewards',
}

export function SpendingChart({ language = 'en' }: { language?: string }) {
  const { transactions } = useWallet()
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)
  const [activeView, setActiveView] = useState<'monthly' | 'category'>('monthly')

  // Build monthly spending data for last 6 months
  const now = new Date()
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    const monthTxs = transactions.filter(tx => {
      const txDate = new Date(tx.date)
      return tx.type === 'debit' &&
        txDate.getFullYear() === d.getFullYear() &&
        txDate.getMonth() === d.getMonth()
    })
    return {
      month: language === 'ja' ? MONTHS_JA[d.getMonth()] : MONTHS[d.getMonth()],
      total: monthTxs.reduce((sum, tx) => sum + tx.amount, 0),
    }
  })

  // Build category data
  const categoryData = Object.entries(
    transactions
      .filter(tx => tx.type === 'debit')
      .reduce((acc, tx) => {
        acc[tx.category] = (acc[tx.category] || 0) + tx.amount
        return acc
      }, {} as Record<string, number>)
  )
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  const maxMonthly = Math.max(...monthlyData.map(d => d.total), 1)
  const maxCategory = Math.max(...categoryData.map(([, v]) => v), 1)

  return (
    <div className="space-y-4">
      {/* View switcher */}
      <div className="flex gap-1 p-1 bg-[var(--surface-2)] rounded-xl w-fit">
        {(['monthly', 'category'] as const).map(view => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200
              ${activeView === view
                ? 'bg-[var(--surface)] text-sora-500 shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
          >
            {view === 'monthly' ? (language === 'ja' ? '月別' : 'Monthly') : (language === 'ja' ? 'カテゴリ' : 'Category')}
          </button>
        ))}
      </div>

      {activeView === 'monthly' ? (
        /* Monthly bar chart */
        <div className="relative">
          <div className="flex items-end gap-2 h-28">
            {monthlyData.map((d, i) => {
              const height = maxMonthly > 0 ? (d.total / maxMonthly) * 100 : 0
              const isHovered = hoveredBar === i
              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-1 group"
                  onMouseEnter={() => setHoveredBar(i)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  {/* Tooltip */}
                  {isHovered && d.total > 0 && (
                    <div className="absolute -top-8 bg-[var(--text-primary)] text-[var(--surface)] text-[10px] font-semibold px-2 py-1 rounded-lg whitespace-nowrap pointer-events-none z-10">
                      ¥{d.total.toLocaleString()}
                    </div>
                  )}
                  <div className="w-full relative flex items-end justify-center" style={{ height: '100px' }}>
                    <div
                      className={`w-full rounded-t-lg transition-all duration-300 cursor-pointer
                        ${isHovered ? 'opacity-100 brightness-110' : 'opacity-80'}
                        ${d.total === 0 ? 'bg-[var(--border)]' : 'gradient-sora'}`}
                      style={{ height: `${Math.max(height, d.total > 0 ? 4 : 2)}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-[var(--text-muted)] font-medium">{d.month}</span>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        /* Category horizontal bars */
        <div className="space-y-3">
          {categoryData.map(([category, amount]) => {
            const width = (amount / maxCategory) * 100
            return (
              <div key={category} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--text-secondary)] font-medium">{CATEGORY_LABELS[category] || category}</span>
                  <span className="text-[var(--text-primary)] font-semibold">¥{amount.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-[var(--surface-2)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${width}%`,
                      background: CATEGORY_COLORS[category] || '#0077ee',
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
