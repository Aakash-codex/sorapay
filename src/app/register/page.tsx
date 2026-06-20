'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Mail, Lock, Eye, EyeOff, User, Phone, Zap, ArrowLeft, Check } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [agreed, setAgreed] = useState(false)

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) { setError('Please fill in all required fields.'); return }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (!agreed) { setError('Please agree to the Terms of Service.'); return }
    setLoading(true); setError('')
    const ok = await register(form.name, form.email, form.password, form.phone)
    if (ok) router.replace('/dashboard')
    else { setError('Registration failed. Please try again.'); setLoading(false) }
  }

  const strength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3
  const strengthColors = ['', 'bg-coral-500', 'bg-gold-500', 'bg-sage-500']
  const strengthLabels = ['', 'Weak', 'Good', 'Strong']

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-sora-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-8 transition-colors">
          <ArrowLeft size={14} />
          Back to home
        </Link>

        <div className="glass-card p-8 fade-in">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl gradient-sora flex items-center justify-center shadow-lg mb-4">
              <Zap className="w-7 h-7 text-white" fill="white" />
            </div>
            <h1 className="text-2xl font-black text-[var(--text-primary)]">Join SoraPay</h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">SoraPayに参加する</p>
          </div>

          {error && (
            <div className="bg-coral-500/10 border border-coral-500/30 text-coral-500 text-sm rounded-xl p-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name *" type="text" placeholder="Sora Tanaka" value={form.name} onChange={update('name')} icon={<User size={16} />} autoComplete="name" required />
            <Input label="Email Address *" type="email" placeholder="you@example.com" value={form.email} onChange={update('email')} icon={<Mail size={16} />} autoComplete="email" required />
            <Input label="Phone Number" type="tel" placeholder="+81-90-0000-0000" value={form.phone} onChange={update('phone')} icon={<Phone size={16} />} autoComplete="tel" />

            <div className="space-y-1.5">
              <Input
                label="Password *"
                type={showPass ? 'text' : 'password'}
                placeholder="At least 6 characters"
                value={form.password}
                onChange={update('password')}
                icon={<Lock size={16} />}
                suffix={
                  <button type="button" onClick={() => setShowPass(!showPass)} className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors" aria-label={showPass ? 'Hide' : 'Show'}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
                autoComplete="new-password"
                required
              />
              {form.password && (
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex gap-1">
                    {[1, 2, 3].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColors[strength] : 'bg-[var(--border)]'}`} />
                    ))}
                  </div>
                  <span className={`text-[10px] font-semibold ${strength === 1 ? 'text-coral-500' : strength === 2 ? 'text-gold-600' : 'text-sage-600'}`}>
                    {strengthLabels[strength]}
                  </span>
                </div>
              )}
            </div>

            <Input label="Confirm Password *" type="password" placeholder="Repeat your password" value={form.confirm} onChange={update('confirm')} icon={<Lock size={16} />} autoComplete="new-password" error={form.confirm && form.password !== form.confirm ? 'Passwords do not match' : ''} required />

            <label className="flex items-start gap-3 cursor-pointer">
              <div
                className={`w-5 h-5 mt-0.5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${agreed ? 'bg-sora-500 border-sora-500' : 'border-[var(--border)]'}`}
                onClick={() => setAgreed(!agreed)}
                role="checkbox"
                aria-checked={agreed}
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setAgreed(!agreed)}
              >
                {agreed && <Check size={12} className="text-white" />}
              </div>
              <span className="text-sm text-[var(--text-secondary)]">
                I agree to the{' '}
                <a href="#" className="text-sora-500 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-sora-500 hover:underline">Privacy Policy</a>
              </span>
            </label>

            <Button type="submit" fullWidth size="lg" loading={loading} className="mt-2">
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <p className="text-sm text-center text-[var(--text-muted)] mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-sora-500 font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </main>
  )
}
