import { Link } from 'react-router-dom'
import type { Movie } from '../../types/movie'

type SearchDropdownProps = {
  query: string
  movies: Movie[]
  open: boolean
  onClose: () => void
}

export function SearchDropdown({ query, movies, open, onClose }: SearchDropdownProps) {
  if (!open || !query.trim()) return null

  return (
    <div className="animate-dropdown-in app-surface absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl">
      <div className="border-b border-slate-200 dark:border-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-app-muted bg-slate-50 dark:bg-slate-900/40">
        Kết quả nhanh
      </div>
      <div className="max-h-[420px] overflow-y-auto">
        {movies.length ? (
          movies.slice(0, 6).map((movie) => (
            <Link
              key={movie.id}
              to={`/movie/${movie.slug}`}
              onClick={onClose}
              className="flex items-center gap-3 border-b border-slate-100 dark:border-white/5 px-4 py-3 transition hover:bg-black/5 dark:hover:bg-white/5"
            >
              <img src={movie.posterUrl} alt={movie.title} className="h-14 w-10 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-app-primary">{movie.title}</p>
                    <p className="truncate text-xs text-app-muted">{movie.originalTitle}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-black/5 dark:bg-white/10 px-2 py-1 text-[11px] text-app-secondary">
                    {movie.type === 'single' ? 'Phim lẻ' : 'Phim bộ'}
                  </span>
                </div>
                <p className="mt-1 text-xs text-app-muted">
                  {movie.year} • {movie.genres.join(', ')}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <div className="px-4 py-6 text-sm text-app-muted">Không tìm thấy phim phù hợp.</div>
        )}
        {movies.length ? (
          <Link
            to={`/search?q=${encodeURIComponent(query)}`}
            onClick={onClose}
            className="block border-t border-slate-200 dark:border-white/10 px-4 py-3 text-center text-sm font-semibold text-cyan-600 dark:text-cyan-300 hover:bg-black/5 dark:hover:bg-white/5"
          >
            Xem tất cả kết quả
          </Link>
        ) : null}
      </div>
    </div>
  )
}
