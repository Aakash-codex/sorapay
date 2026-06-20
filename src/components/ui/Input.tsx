'use client'

import { InputHTMLAttributes, ReactNode, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  icon?: ReactNode
  suffix?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, icon, suffix, className = '', id, ...props },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[var(--text-secondary)]"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 text-[var(--text-muted)] pointer-events-none flex items-center">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full rounded-xl border transition-all duration-200 bg-[var(--surface)] text-[var(--text-primary)]
            placeholder:text-[var(--text-muted)]
            focus:outline-none focus:ring-2 focus:ring-sora-500/30 focus:border-sora-500
            ${error ? 'border-coral-500 focus:ring-coral-500/30 focus:border-coral-500' : 'border-[var(--border)]'}
            ${icon ? 'pl-10' : 'pl-4'}
            ${suffix ? 'pr-12' : 'pr-4'}
            py-3 text-sm
            ${className}
          `}
          {...props}
        />
        {suffix && (
          <div className="absolute right-3.5 text-[var(--text-muted)] flex items-center">
            {suffix}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-coral-500 mt-0.5">{error}</p>}
      {hint && !error && <p className="text-xs text-[var(--text-muted)] mt-0.5">{hint}</p>}
    </div>
  )
})
