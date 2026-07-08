import type { ReactNode } from 'react'
import { X } from 'lucide-react'

type ModalProps = {
  open: boolean
  title: string
  children: ReactNode
  onClose: () => void
}

export function Modal({ open, title, children, onClose }: ModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="animate-modal-in app-surface w-full max-w-lg rounded-2xl border">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="text-app-primary text-base font-semibold">{title}</h2>
          <button type="button" onClick={onClose} className="text-app-muted rounded-lg p-2 hover:bg-white/5 hover:[color:var(--text-primary)]">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="text-app-secondary px-5 py-4 text-sm">{children}</div>
      </div>
    </div>
  )
}
