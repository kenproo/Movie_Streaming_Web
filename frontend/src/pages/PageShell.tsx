type PageShellProps = {
  title: string
  description: string
}

export function PageShell({ title, description }: PageShellProps) {
  return (
    <section className="space-y-4">
      <div className="app-muted-surface rounded-3xl border p-6 sm:p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300/80">ChillFilm</p>
        <h1 className="mt-2 text-2xl font-semibold text-app-primary sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-app-secondary sm:text-base">{description}</p>
      </div>
    </section>
  )
}
