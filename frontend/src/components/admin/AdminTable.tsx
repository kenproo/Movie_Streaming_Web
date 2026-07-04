import type { ReactNode } from 'react'

type AdminTableProps = {
  headers: string[]
  children: ReactNode
}

export function AdminTable({ headers, children }: AdminTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10 text-left text-sm text-slate-200">
          <thead className="bg-slate-950 text-xs uppercase tracking-wide text-slate-400">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-4 py-3 font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 bg-white/[0.03]">{children}</tbody>
        </table>
      </div>
    </div>
  )
}
