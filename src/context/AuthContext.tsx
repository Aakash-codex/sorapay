'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Language = 'en' | 'ja'
type Theme = 'light' | 'dark'

interface User {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  language: Language
  theme: Theme
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string, phone: string) => Promise<boolean>
  logout: () => void
  setLanguage: (lang: Language) => void
  setTheme: (theme: Theme) => void
  updateProfile: (name: string, email: string, phone: string) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const DEMO_USER: User = {
  id: 'user_001',
  name: 'Sora Tanaka',
  email: 'sora@sorapay.jp',
  phone: '+81-90-1234-5678',
  avatar: 'ST',
  createdAt: '2025-04-15',
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [language, setLanguageState] = useState<Language>('en')
  const [theme, setThemeState] = useState<Theme>('light')

  useEffect(() => {
    // Rehydrate from localStorage
    try {
      const stored = localStorage.getItem('sorapay_user')
      const storedLang = localStorage.getItem('sorapay_lang') as Language | null
      const storedTheme = localStorage.getItem('sorapay_theme') as Theme | null
      if (stored) setUser(JSON.parse(stored))
      if (storedLang) setLanguageState(storedLang)
      if (storedTheme) setThemeState(storedTheme)
    } catch {}
    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  const login = async (email: string, _password: string): Promise<boolean> => {
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    // Accept any email / password for demo; match to demo user
    const loggedUser = { ...DEMO_USER, email }
    setUser(loggedUser)
    localStorage.setItem('sorapay_user', JSON.stringify(loggedUser))
    setIsLoading(false)
    return true
  }

  const register = async (name: string, email: string, _password: string, phone: string): Promise<boolean> => {
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      phone,
      avatar: name.slice(0, 2).toUpperCase(),
      createdAt: new Date().toISOString().split('T')[0],
    }
    setUser(newUser)
    localStorage.setItem('sorapay_user', JSON.stringify(newUser))
    setIsLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('sorapay_user')
  }

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('sorapay_lang', lang)
  }

  const setTheme = (t: Theme) => {
    setThemeState(t)
    localStorage.setItem('sorapay_theme', t)
  }

  const updateProfile = (name: string, email: string, phone: string) => {
    if (!user) return
    const updated = { ...user, name, email, phone, avatar: name.slice(0, 2).toUpperCase() }
    setUser(updated)
    localStorage.setItem('sorapay_user', JSON.stringify(updated))
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, language, theme, login, register, logout, setLanguage, setTheme, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
