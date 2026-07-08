type BadgeProps = {
  children: string
}

export function Badge({ children }: BadgeProps) {
  return (
    <span className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-xs font-medium text-cyan-300">
      {children}
    </span>
  )
}
