import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

type ButtonProps = {
  children: ReactNode
  variant?: 'primary' | 'ghost'
  to?: string
  className?: string
  icon?: ReactNode
  type?: 'button' | 'submit'
  onClick?: () => void
}

export function Button({
  children,
  variant = 'primary',
  to,
  className = '',
  icon,
  type = 'button',
  onClick,
}: ButtonProps) {
  const styles =
    variant === 'primary'
      ? 'bg-gradient-to-r from-cyan-400 to-lime-400 text-slate-950 hover:brightness-110'
      : 'border bg-black/5 dark:bg-white/5 text-app-primary hover:bg-black/10 dark:hover:bg-white/10 accent-ring'

  const base =
    `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold transition ${styles} ${className}`.trim()

  if (to) {
    return (
      <Link to={to} className={base}>
        {icon}
        {children}
      </Link>
    )
  }

  return (
    <button type={type} className={base} onClick={onClick}>
      {icon}
      {children}
    </button>
  )
}
