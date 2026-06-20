'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'

export type TxCategory = 'food' | 'shopping' | 'transport' | 'transfer' | 'rewards' | 'utilities' | 'entertainment'
export type TxType = 'debit' | 'credit'

export interface Transaction {
  id: string
  title: string
  subtitle: string
  amount: number
  type: TxType
  category: TxCategory
  date: string
  time: string
  icon: string
  status: 'completed' | 'pending' | 'failed'
}

export interface Coupon {
  id: string
  title: string
  titleJa: string
  description: string
  descriptionJa: string
  discount: string
  merchant: string
  merchantIcon: string
  color: string
  expiresAt: string
  claimed: boolean
  used: boolean
  pointsCost: number
}

interface WalletContextType {
  balance: number
  points: number
  cashback: number
  transactions: Transaction[]
  coupons: Coupon[]
  sendMoney: (recipient: string, amount: number, note: string, category: TxCategory) => Promise<boolean>
  addFunds: (amount: number) => void
  claimCoupon: (couponId: string) => boolean
  useCoupon: (couponId: string) => void
  addQRPayment: (merchant: string, amount: number) => Promise<boolean>
}

const WalletContext = createContext<WalletContextType | null>(null)

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 't1', title: 'Starbucks Shibuya', subtitle: 'Coffee & Snacks', amount: 850, type: 'debit', category: 'food', date: '2026-06-17', time: '09:32', icon: '☕', status: 'completed' },
  { id: 't2', title: 'Received from Yuki', subtitle: 'Dinner split', amount: 2500, type: 'credit', category: 'transfer', date: '2026-06-17', time: '08:15', icon: '💸', status: 'completed' },
  { id: 't3', title: 'Tokyo Metro', subtitle: 'Suica top-up', amount: 1000, type: 'debit', category: 'transport', date: '2026-06-16', time: '18:45', icon: '🚇', status: 'completed' },
  { id: 't4', title: 'UNIQLO Harajuku', subtitle: 'Summer collection', amount: 5980, type: 'debit', category: 'shopping', date: '2026-06-16', time: '14:22', icon: '👕', status: 'completed' },
  { id: 't5', title: 'Cashback Reward', subtitle: 'Monthly bonus', amount: 320, type: 'credit', category: 'rewards', date: '2026-06-15', time: '12:00', icon: '🎁', status: 'completed' },
  { id: 't6', title: 'Netflix Japan', subtitle: 'Monthly subscription', amount: 1490, type: 'debit', category: 'entertainment', date: '2026-06-15', time: '00:00', icon: '🎬', status: 'completed' },
  { id: 't7', title: 'FamilyMart', subtitle: 'Convenience store', amount: 430, type: 'debit', category: 'food', date: '2026-06-14', time: '22:10', icon: '🏪', status: 'completed' },
  { id: 't8', title: 'Tokyo Electric', subtitle: 'Electricity bill', amount: 7820, type: 'debit', category: 'utilities', date: '2026-06-14', time: '09:00', icon: '⚡', status: 'completed' },
  { id: 't9', title: 'Received from Kenji', subtitle: 'Concert tickets', amount: 8000, type: 'credit', category: 'transfer', date: '2026-06-13', time: '16:30', icon: '💸', status: 'completed' },
  { id: 't10', title: 'Lawson', subtitle: 'Lunch', amount: 650, type: 'debit', category: 'food', date: '2026-06-13', time: '12:05', icon: '🍱', status: 'completed' },
  { id: 't11', title: 'Amazon Japan', subtitle: 'Electronics', amount: 12800, type: 'debit', category: 'shopping', date: '2026-06-12', time: '19:45', icon: '📦', status: 'completed' },
  { id: 't12', title: 'Reward Points', subtitle: 'Shopping bonus 2x', amount: 128, type: 'credit', category: 'rewards', date: '2026-06-12', time: '19:45', icon: '⭐', status: 'completed' },
]

const INITIAL_COUPONS: Coupon[] = [
  { id: 'c1', title: '¥200 Off at Starbucks', titleJa: 'スタバ ¥200 割引', description: 'Valid on any purchase over ¥500', descriptionJa: '¥500以上のご購入で有効', discount: '¥200', merchant: 'Starbucks', merchantIcon: '☕', color: '#00704a', expiresAt: '2026-07-31', claimed: true, used: false, pointsCost: 200 },
  { id: 'c2', title: '10% Off at UNIQLO', titleJa: 'UNIQLO 10%割引', description: 'Online and in-store purchases', descriptionJa: 'オンライン・店舗でご利用可能', discount: '10%', merchant: 'UNIQLO', merchantIcon: '👕', color: '#ff0000', expiresAt: '2026-07-15', claimed: false, used: false, pointsCost: 500 },
  { id: 'c3', title: '¥500 Off Travel', titleJa: '旅行 ¥500 割引', description: 'Book any domestic flight or hotel', descriptionJa: '国内航空・ホテルに使用可能', discount: '¥500', merchant: 'SoraTravel', merchantIcon: '✈️', color: '#0077ee', expiresAt: '2026-08-31', claimed: false, used: false, pointsCost: 400 },
  { id: 'c4', title: 'Free Delivery', titleJa: '送料無料', description: 'Next Amazon Japan order', descriptionJa: '次回のAmazon注文に適用', discount: 'FREE', merchant: 'Amazon JP', merchantIcon: '📦', color: '#ff9900', expiresAt: '2026-06-30', claimed: true, used: false, pointsCost: 150 },
  { id: 'c5', title: '¥300 Off Dining', titleJa: '外食 ¥300 割引', description: 'Valid at partner restaurants', descriptionJa: '提携レストランで使用可能', discount: '¥300', merchant: 'SoraDine', merchantIcon: '🍜', color: '#e05f3a', expiresAt: '2026-07-20', claimed: false, used: false, pointsCost: 300 },
]

export function WalletProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(52840)
  const [points, setPoints] = useState(1250)
  const [cashback, setCashback] = useState(3680)
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS)
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS)

  // Persist to localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sorapay_wallet')
      if (saved) {
        const data = JSON.parse(saved)
        setBalance(data.balance ?? 52840)
        setPoints(data.points ?? 1250)
        setCashback(data.cashback ?? 3680)
        setTransactions(data.transactions ?? INITIAL_TRANSACTIONS)
        setCoupons(data.coupons ?? INITIAL_COUPONS)
      }
    } catch {}
  }, [])

  const persist = useCallback((b: number, p: number, cb: number, txs: Transaction[], cups: Coupon[]) => {
    try {
      localStorage.setItem('sorapay_wallet', JSON.stringify({ balance: b, points: p, cashback: cb, transactions: txs, coupons: cups }))
    } catch {}
  }, [])

  const sendMoney = useCallback(async (recipient: string, amount: number, note: string, category: TxCategory): Promise<boolean> => {
    if (amount > balance) return false
    await new Promise(r => setTimeout(r, 1500))
    const newTx: Transaction = {
      id: `t${Date.now()}`,
      title: `Sent to ${recipient}`,
      subtitle: note || 'Transfer',
      amount,
      type: 'debit',
      category,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
      icon: '💸',
      status: 'completed',
    }
    const earnedPoints = Math.floor(amount / 100)
    const newBalance = balance - amount
    const newPoints = points + earnedPoints
    const newTxs = [newTx, ...transactions]
    setBalance(newBalance)
    setPoints(newPoints)
    setTransactions(newTxs)
    persist(newBalance, newPoints, cashback, newTxs, coupons)
    return true
  }, [balance, points, transactions, coupons, cashback, persist])

  const addFunds = useCallback((amount: number) => {
    const newTx: Transaction = {
      id: `t${Date.now()}`,
      title: 'Wallet Top-up',
      subtitle: 'Added funds',
      amount,
      type: 'credit',
      category: 'transfer',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
      icon: '💳',
      status: 'completed',
    }
    const newBalance = balance + amount
    const newTxs = [newTx, ...transactions]
    setBalance(newBalance)
    setTransactions(newTxs)
    persist(newBalance, points, cashback, newTxs, coupons)
  }, [balance, points, transactions, coupons, cashback, persist])

  const claimCoupon = useCallback((couponId: string): boolean => {
    const coupon = coupons.find(c => c.id === couponId)
    if (!coupon || coupon.claimed || points < coupon.pointsCost) return false
    const newPoints = points - coupon.pointsCost
    const newCoupons = coupons.map(c => c.id === couponId ? { ...c, claimed: true } : c)
    setPoints(newPoints)
    setCoupons(newCoupons)
    persist(balance, newPoints, cashback, transactions, newCoupons)
    return true
  }, [coupons, points, balance, transactions, cashback, persist])

  const useCoupon = useCallback((couponId: string) => {
    const newCoupons = coupons.map(c => c.id === couponId ? { ...c, used: true } : c)
    setCoupons(newCoupons)
    persist(balance, points, cashback, transactions, newCoupons)
  }, [coupons, balance, points, transactions, cashback, persist])

  const addQRPayment = useCallback(async (merchant: string, amount: number): Promise<boolean> => {
    if (amount > balance) return false
    await new Promise(r => setTimeout(r, 1200))
    const newTx: Transaction = {
      id: `t${Date.now()}`,
      title: merchant,
      subtitle: 'QR Payment',
      amount,
      type: 'debit',
      category: 'shopping',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
      icon: '📱',
      status: 'completed',
    }
    const earnedPoints = Math.floor(amount / 100)
    const newBalance = balance - amount
    const newPoints = points + earnedPoints
    const newTxs = [newTx, ...transactions]
    setBalance(newBalance)
    setPoints(newPoints)
    setTransactions(newTxs)
    persist(newBalance, newPoints, cashback, newTxs, coupons)
    return true
  }, [balance, points, transactions, coupons, cashback, persist])

  return (
    <WalletContext.Provider value={{ balance, points, cashback, transactions, coupons, sendMoney, addFunds, claimCoupon, useCoupon, addQRPayment }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('useWallet must be used within WalletProvider')
  return ctx
}
