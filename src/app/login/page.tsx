'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Mail, Lock, Eye, EyeOff, Zap, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setLoading(true); setError('')
    const ok = await login(email, password)
    if (ok) router.replace('/dashboard')
    else { setError('Invalid credentials. Please try again.'); setLoading(false) }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-sora-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-sage-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-8 transition-colors">
          <ArrowLeft size={14} />
          Back to home
        </Link>

        <div className="glass-card p-8 fade-in">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl gradient-sora flex items-center justify-center shadow-lg mb-4">
              <Zap className="w-7 h-7 text-white" fill="white" />
            </div>
            <h1 className="text-2xl font-black text-[var(--text-primary)]">Welcome Back</h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">おかえりなさい</p>
          </div>

          {error && (
            <div className="bg-coral-500/10 border border-coral-500/30 text-coral-500 text-sm rounded-xl p-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              icon={<Mail size={16} />}
              autoComplete="email"
              required
            />
            <Input
              label="Password"
              type={showPass ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              icon={<Lock size={16} />}
              suffix={
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              autoComplete="current-password"
              required
            />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-[var(--border)] accent-sora-500" />
                <span className="text-[var(--text-secondary)]">Remember me</span>
              </label>
              <a href="#" className="text-sora-500 hover:underline">Forgot password?</a>
            </div>

            <Button type="submit" fullWidth size="lg" loading={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border)]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[var(--surface)] px-3 text-xs text-[var(--text-muted)]">or try demo</span>
            </div>
          </div>

          <Button
            variant="secondary"
            fullWidth
            size="md"
            onClick={() => { setEmail('sora@sorapay.jp'); setPassword('demo123') }}
          >
            Use Demo Account
          </Button>

          <p className="text-sm text-center text-[var(--text-muted)] mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-sora-500 font-semibold hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
