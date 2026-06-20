'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useT } from '@/hooks/useT'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { User, Mail, Phone, Moon, Sun, Globe, Shield, LogOut, Check, Lock, Sparkles, KeyRound } from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const { user, language, theme, setLanguage, setTheme, updateProfile, logout } = useAuth()
  const t = useT()

  // Profile Form State
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [profileSuccess, setProfileSuccess] = useState(false)

  // Password Form State
  const [curPassword, setCurPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confPassword, setConfPassword] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  // Simulated switches
  const [twoFactor, setTwoFactor] = useState(true)
  const [biometrics, setBiometrics] = useState(true)

  useEffect(() => {
    if (!user) {
      router.replace('/login')
    } else {
      setName(user.name)
      setEmail(user.email)
      setPhone(user.phone)
    }
  }, [user, router])

  if (!user) return null

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile(name, email, phone)
    setProfileSuccess(true)
    setTimeout(() => setProfileSuccess(false), 3000)
  }

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess(false)
    if (!curPassword || !newPassword || !confPassword) {
      setPasswordError('Please fill in all password fields.')
      return
    }
    if (newPassword !== confPassword) {
      setPasswordError('New passwords do not match.')
      return
    }
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.')
      return
    }
    setPasswordSuccess(true)
    setCurPassword('')
    setNewPassword('')
    setConfPassword('')
    setTimeout(() => setPasswordSuccess(false), 3000)
  }

  return (
    <div className="lg:pl-64">
      <div className="min-h-screen bg-[var(--bg)] pt-16 lg:pt-0 pb-24 lg:pb-0">
        <div className="max-w-3xl mx-auto px-4 lg:px-8 py-6 lg:py-8 space-y-6">
          
          {/* Header */}
          <div className="fade-in">
            <h1 className="text-2xl font-black text-[var(--text-primary)]">{t.settings}</h1>
            <p className="text-sm text-[var(--text-muted)] mt-0.5">Manage your user profile, app localization, preferences and security</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            
            {/* Left Column: User Card & Quick preferences */}
            <div className="md:col-span-1 space-y-6 fade-in-delay-1">
              
              {/* Profile Card Summary */}
              <Card padding="md" className="text-center relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-16 gradient-sora" />
                <div className="relative pt-6">
                  <div className="w-20 h-20 rounded-full gradient-sora border-4 border-[var(--surface)] shadow-md flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                    {user.avatar}
                  </div>
                  <h2 className="text-base font-bold text-[var(--text-primary)] truncate">{user.name}</h2>
                  <p className="text-xs text-[var(--text-muted)] truncate">{user.email}</p>
                  <p className="text-[10px] text-[var(--text-muted)] mt-3">Member since: {user.createdAt}</p>
                </div>
              </Card>

              {/* Preferences: Language & Theme */}
              <Card padding="md" className="space-y-4">
                {/* Language Switch */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                    <Globe size={14} /> {t.language}
                  </span>
                  <div className="grid grid-cols-2 gap-2 bg-[var(--surface-2)] p-1 rounded-xl border border-[var(--border)]">
                    <button
                      onClick={() => setLanguage('en')}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-all
                        ${language === 'en' ? 'bg-[var(--surface)] text-sora-500 shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => setLanguage('ja')}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-all
                        ${language === 'ja' ? 'bg-[var(--surface)] text-sora-500 shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}
                    >
                      日本語
                    </button>
                  </div>
                </div>

                {/* Theme Switch */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                    {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />} {t.theme}
                  </span>
                  <div className="grid grid-cols-2 gap-2 bg-[var(--surface-2)] p-1 rounded-xl border border-[var(--border)]">
                    <button
                      onClick={() => setTheme('light')}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5
                        ${theme === 'light' ? 'bg-[var(--surface)] text-sora-500 shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}
                    >
                      <Sun size={12} />
                      {t.lightMode}
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5
                        ${theme === 'dark' ? 'bg-[var(--surface)] text-sora-500 shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}
                    >
                      <Moon size={12} />
                      {t.darkMode}
                    </button>
                  </div>
                </div>
              </Card>

              {/* Logout Button */}
              <Button
                variant="danger"
                fullWidth
                size="md"
                onClick={() => { logout(); router.push('/login'); }}
                icon={<LogOut size={16} />}
              >
                {t.logout}
              </Button>
            </div>

            {/* Right Column: Edit Profile & Security form inputs */}
            <div className="md:col-span-2 space-y-6 fade-in-delay-2">
              
              {/* Profile Details Form */}
              <Card padding="md">
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <h2 className="text-sm font-bold text-[var(--text-primary)] border-b border-[var(--border)] pb-2 flex items-center gap-2">
                    <User size={16} className="text-sora-500" />
                    {t.profile}
                  </h2>
                  
                  {profileSuccess && (
                    <div className="p-3 bg-sage-500/10 border border-sage-500/30 text-sage-600 text-xs rounded-xl flex items-center gap-2 success-pulse">
                      <Check size={14} /> Profile updated successfully!
                    </div>
                  )}

                  <Input
                    label={t.fullName}
                    placeholder="Sora Tanaka"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    icon={<User size={16} />}
                    required
                  />

                  <Input
                    label={t.email}
                    type="email"
                    placeholder="sora@sorapay.jp"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<Mail size={16} />}
                    required
                  />

                  <Input
                    label={t.phone}
                    placeholder="+81-90-1234-5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    icon={<Phone size={16} />}
                    required
                  />

                  <Button type="submit" size="md">
                    {t.save} Settings
                  </Button>
                </form>
              </Card>

              {/* Security Details Form */}
              <Card padding="md">
                <div className="space-y-6">
                  
                  {/* switches section */}
                  <div className="space-y-4">
                    <h2 className="text-sm font-bold text-[var(--text-primary)] border-b border-[var(--border)] pb-2 flex items-center gap-2">
                      <Shield size={16} className="text-sora-500" />
                      {t.security}
                    </h2>

                    <div className="space-y-4">
                      {/* 2FA Toggle */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-[var(--text-primary)]">{t.twoFactor}</p>
                          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Secure transactions with a mobile validation code</p>
                        </div>
                        <button
                          onClick={() => setTwoFactor(!twoFactor)}
                          className={`w-10 h-6 rounded-full transition-colors relative focus:outline-none border border-[var(--border)]
                            ${twoFactor ? 'gradient-sage' : 'bg-[var(--surface-2)]'}`}
                          aria-label="Toggle Two Factor Authentication"
                        >
                          <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all shadow-sm
                            ${twoFactor ? 'right-0.5' : 'left-0.5'}`} />
                        </button>
                      </div>

                      {/* Biometrics Toggle */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-[var(--text-primary)]">Biometric Login</p>
                          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Use Face ID / Touch ID to sign in and confirm scans</p>
                        </div>
                        <button
                          onClick={() => setBiometrics(!biometrics)}
                          className={`w-10 h-6 rounded-full transition-colors relative focus:outline-none border border-[var(--border)]
                            ${biometrics ? 'gradient-sage' : 'bg-[var(--surface-2)]'}`}
                          aria-label="Toggle Biometric Login"
                        >
                          <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all shadow-sm
                            ${biometrics ? 'right-0.5' : 'left-0.5'}`} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* password section */}
                  <form onSubmit={handleChangePassword} className="space-y-4 pt-2">
                    <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                      <KeyRound size={12} /> {t.changePassword}
                    </h3>

                    {passwordSuccess && (
                      <div className="p-3 bg-sage-500/10 border border-sage-500/30 text-sage-600 text-xs rounded-xl flex items-center gap-2 success-pulse">
                        <Sparkles size={14} /> Password changed successfully!
                      </div>
                    )}
                    {passwordError && (
                      <div className="p-3 bg-coral-500/10 border border-coral-500/30 text-coral-500 text-xs rounded-xl flex items-center gap-2">
                        <Check size={14} className="rotate-45" /> {passwordError}
                      </div>
                    )}

                    <Input
                      label="Current Password"
                      type="password"
                      placeholder="••••••••"
                      value={curPassword}
                      onChange={(e) => setCurPassword(e.target.value)}
                      icon={<Lock size={16} />}
                    />

                    <Input
                      label="New Password"
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      icon={<Lock size={16} />}
                    />

                    <Input
                      label="Confirm New Password"
                      type="password"
                      placeholder="••••••••"
                      value={confPassword}
                      onChange={(e) => setConfPassword(e.target.value)}
                      icon={<Lock size={16} />}
                    />

                    <Button type="submit" variant="secondary" size="md">
                      Update Password
                    </Button>
                  </form>

                </div>
              </Card>

            </div>

          </div>

        </div>
      </div>
    </div>
  )
}
