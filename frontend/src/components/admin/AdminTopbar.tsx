import type { ReactNode } from 'react'
import { LogOut, Menu } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

type AdminTopbarProps = {
  onOpenMenu?: () => void
  mobileAction?: ReactNode
}

export function AdminTopbar({ onOpenMenu, mobileAction }: AdminTopbarProps) {
  const { currentUser, logout } = useAuth()

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-white/10 bg-slate-950/95 px-4 py-4 backdrop-blur lg:px-6">
      <button
        type="button"
        onClick={onOpenMenu}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white lg:hidden"
        aria-label="Mở menu admin"
      >
        {mobileAction ?? <Menu className="h-5 w-5" />}
      </button>

      <div className="ml-auto flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-semibold text-white">{currentUser?.name ?? 'Admin'}</p>
          <p className="text-xs text-slate-400">{currentUser?.email}</p>
        </div>
        <img
          src={currentUser?.avatarUrl ?? 'https://placehold.co/120x120/0f172a/94a3b8?text=A'}
          alt={currentUser?.name ?? 'Admin'}
          className="h-10 w-10 rounded-xl object-cover"
        />
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </header>
  )
}
