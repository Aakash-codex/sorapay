'use client'

import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'glass' | 'gradient'
  hover?: boolean
  padding?: 'sm' | 'md' | 'lg' | 'none'
  onClick?: () => void
  style?: React.CSSProperties
}

export function Card({
  children,
  className = '',
  variant = 'default',
  hover = false,
  padding = 'md',
  onClick,
  style,
}: CardProps) {
  const base = 'rounded-[var(--radius-card)] overflow-hidden'

  const variants = {
    default: 'bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)]',
    glass: 'glass-card',
    gradient: 'gradient-sora text-white shadow-lg',
  }

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
  }

  return (
    <div
      className={`${base} ${variants[variant]} ${paddings[padding]} ${hover ? 'card-hover cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      style={style}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {children}
    </div>
  )
}
