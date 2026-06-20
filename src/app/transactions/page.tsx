'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useWallet, Transaction, TxCategory, TxType } from '@/context/WalletContext'
import { useT } from '@/hooks/useT'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Search, Download, ChevronRight, X, Calendar, DollarSign, Tag, Info, ArrowUpRight, ArrowDownLeft } from 'lucide-react'

const CATEGORY_LABELS_EN: Record<TxCategory, string> = {
  food: '🍔 Food & Drink',
  shopping: '🛍️ Shopping',
  transport: '🚇 Transport',
  utilities: '⚡ Utilities',
  entertainment: '🎬 Entertainment',
  transfer: '💸 Transfer',
  rewards: '🎁 Rewards',
}

const CATEGORY_LABELS_JA: Record<TxCategory, string> = {
  food: '🍔 飲食・フード',
  shopping: '🛍️ ショッピング',
  transport: '🚇 交通・移動',
  utilities: '⚡ 公共料金',
  entertainment: '🎬 娯楽・エンタメ',
  transfer: '💸 送金・送付',
  rewards: '🎁 特典・ポイント',
}

export default function TransactionsPage() {
  const router = useRouter()
  const { user, language } = useAuth()
  const { transactions } = useWallet()
  const t = useT()

  // State
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<TxCategory | 'all'>('all')
  const [selectedType, setSelectedType] = useState<TxType | 'all'>('all')
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)

  useEffect(() => {
    if (!user) router.replace('/login')
  }, [user, router])

  if (!user) return null

  const categoryLabels = language === 'ja' ? CATEGORY_LABELS_JA : CATEGORY_LABELS_EN

  // Filtered transactions
  const filteredTxs = transactions.filter((tx) => {
    const matchesSearch =
      tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || tx.category === selectedCategory
    const matchesType = selectedType === 'all' || tx.type === selectedType
    return matchesSearch && matchesCategory && matchesType
  })

  // Export CSV logic
  const handleExportCSV = () => {
    const headers = 'Transaction ID,Date,Time,Title,Subtitle,Amount (JPY),Type,Category,Status\n'
    const rows = filteredTxs
      .map(
        (tx) =>
          `"${tx.id}","${tx.date}","${tx.time}","${tx.title.replace(/"/g, '""')}","${tx.subtitle.replace(/"/g, '""')}",${tx.amount},"${tx.type}","${tx.category}","${tx.status}"`
      )
      .join('\n')

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `sorapay_transactions_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Monthly stats helper
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const monthlyIn = transactions
    .filter((tx) => {
      const d = new Date(tx.date)
      return tx.type === 'credit' && d.getMonth() === currentMonth && d.getFullYear() === currentYear
    })
    .reduce((s, tx) => s + tx.amount, 0)

  const monthlyOut = transactions
    .filter((tx) => {
      const d = new Date(tx.date)
      return tx.type === 'debit' && d.getMonth() === currentMonth && d.getFullYear() === currentYear
    })
    .reduce((s, tx) => s + tx.amount, 0)

  return (
    <div className="lg:pl-64">
      <div className="min-h-screen bg-[var(--bg)] pt-16 lg:pt-0 pb-24 lg:pb-0">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6 lg:py-8 space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 fade-in">
            <div>
              <h1 className="text-2xl font-black text-[var(--text-primary)]">{t.transactionHistory}</h1>
              <p className="text-sm text-[var(--text-muted)] mt-0.5">View and manage your account transactions</p>
            </div>
            <Button
              onClick={handleExportCSV}
              variant="secondary"
              size="sm"
              icon={<Download size={14} />}
              disabled={filteredTxs.length === 0}
            >
              {t.exportCSV}
            </Button>
          </div>

          {/* Mini monthly report cards */}
          <div className="grid grid-cols-2 gap-4 fade-in-delay-1">
            <Card padding="md" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sage-500/10 flex items-center justify-center text-sage-500">
                <ArrowDownLeft size={20} />
              </div>
              <div>
                <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-wider">This Month Inflow</p>
                <p className="text-lg font-black text-sage-500">+¥{monthlyIn.toLocaleString()}</p>
              </div>
            </Card>
            <Card padding="md" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-coral-500/10 flex items-center justify-center text-coral-500">
                <ArrowUpRight size={20} />
              </div>
              <div>
                <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-wider">This Month Outflow</p>
                <p className="text-lg font-black text-[var(--text-primary)]">¥{monthlyOut.toLocaleString()}</p>
              </div>
            </Card>
          </div>

          {/* Filtering controls */}
          <Card padding="md" className="space-y-4 fade-in-delay-2">
            {/* Search Input */}
            <Input
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search size={16} />}
            />

            {/* Type Filter */}
            <div className="flex gap-1.5 p-1 bg-[var(--surface-2)] rounded-xl w-fit">
              {(['all', 'debit', 'credit'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200
                    ${selectedType === type
                      ? 'bg-[var(--surface)] text-sora-500 shadow-sm'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}
                >
                  {type === 'all' ? 'All' : type === 'debit' ? 'Sent' : 'Received'}
                </button>
              ))}
            </div>

            {/* Category tags */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block">{t.filterBy} Category</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all
                    ${selectedCategory === 'all'
                      ? 'gradient-sora text-white border-transparent'
                      : 'bg-[var(--surface-2)] text-[var(--text-secondary)] border-[var(--border)] hover:border-sora-500/50'}`}
                >
                  🌐 All Categories
                </button>
                {(Object.keys(categoryLabels) as TxCategory[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all
                      ${selectedCategory === cat
                        ? 'gradient-sora text-white border-transparent'
                        : 'bg-[var(--surface-2)] text-[var(--text-secondary)] border-[var(--border)] hover:border-sora-500/50'}`}
                  >
                    {categoryLabels[cat]}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Transactions List */}
          <Card padding="none" className="fade-in-delay-3">
            {filteredTxs.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-base font-bold text-[var(--text-primary)]">{t.noTransactions}</h3>
                <p className="text-xs text-[var(--text-muted)] mt-1">Try widening your search keywords or tags</p>
              </div>
            ) : (
              <div className="divide-y divide-[var(--border)]">
                {filteredTxs.map((tx) => (
                  <div
                    key={tx.id}
                    onClick={() => setSelectedTx(tx)}
                    className="flex items-center gap-3 p-4 hover:bg-[var(--surface-2)] cursor-pointer transition-colors"
                  >
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
                      <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{tx.date}</p>
                    </div>
                    <ChevronRight size={16} className="text-[var(--text-muted)] flex-shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedTx && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] w-full max-w-md rounded-[var(--radius-card)] overflow-hidden shadow-2xl border border-[var(--border)] slide-up">
            
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
              <h2 className="text-sm font-bold text-[var(--text-primary)]">Transaction Details</h2>
              <button
                onClick={() => setSelectedTx(null)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Big visual header */}
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-[var(--surface-2)] rounded-2xl flex items-center justify-center text-3xl mx-auto border border-[var(--border)]">
                  {selectedTx.icon}
                </div>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">{selectedTx.title}</h3>
                <p className="text-xs text-[var(--text-muted)]">{selectedTx.subtitle}</p>
                <p className={`text-3xl font-black ${selectedTx.type === 'credit' ? 'text-sage-500' : 'text-[var(--text-primary)]'}`}>
                  {selectedTx.type === 'credit' ? '+' : '-'}¥{selectedTx.amount.toLocaleString()}
                </p>
                <div className="inline-block mt-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize
                    ${selectedTx.status === 'completed' ? 'bg-sage-500/10 text-sage-500' : 'bg-gold-500/10 text-gold-500'}`}>
                    {selectedTx.status}
                  </span>
                </div>
              </div>

              {/* Attributes grid */}
              <div className="bg-[var(--surface-2)] rounded-2xl p-4 space-y-3.5 border border-[var(--border)] text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                    <Calendar size={12} /> Date & Time
                  </span>
                  <span className="text-[var(--text-primary)] font-semibold">{selectedTx.date} {selectedTx.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                    <Tag size={12} /> Category
                  </span>
                  <span className="text-[var(--text-primary)] font-semibold">{categoryLabels[selectedTx.category]}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                    <Info size={12} /> Transaction ID
                  </span>
                  <span className="text-[var(--text-primary)] font-mono">{selectedTx.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                    <DollarSign size={12} /> Point Reward
                  </span>
                  <span className="text-[var(--text-primary)] font-semibold">
                    {selectedTx.type === 'debit' ? `+${Math.floor(selectedTx.amount / 100)} pts` : '—'}
                  </span>
                </div>
              </div>

              <Button fullWidth onClick={() => setSelectedTx(null)}>
                Dismiss Details
              </Button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
