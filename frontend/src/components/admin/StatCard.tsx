import type { ReactNode } from 'react'

type StatCardProps = {
  title: string
  value: string | number
  icon?: ReactNode
}

export function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-400">{title}</p>
        {icon}
      </div>
      <p className="mt-3 text-2xl font-bold text-white">{value}</p>
    </div>
  )
}
