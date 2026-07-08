import { Button } from './Button'

type EmptyStateProps = {
  title: string
  description: string
  actionLabel?: string
  actionTo?: string
}

export function EmptyState({ title, description, actionLabel, actionTo }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
      {actionLabel && actionTo ? (
        <div className="mt-5">
          <Button to={actionTo}>{actionLabel}</Button>
        </div>
      ) : null}
    </div>
  )
}
