'use client'

import { useAuth } from '@/context/AuthContext'
import { en } from '@/locales/en'
import { ja } from '@/locales/ja'

export function useT() {
  const { language } = useAuth()
  return language === 'ja' ? ja : en
}
