import { Play, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Movie } from '../../types/movie'
import { formatRating, formatViews } from '../../utils/format'

export function MovieCard({ movie }: { movie: Movie }) {
  const episodeLabel = movie.type === 'single' ? 'Full' : `${movie.currentEpisode}/${movie.totalEpisodes}`

  return (
    <article className="group app-surface relative overflow-hidden rounded-[1.5rem] border transition duration-300 hover:-translate-y-1.5 hover:border-cyan-300/40 hover:shadow-2xl hover:shadow-cyan-950/20">
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        <div className="absolute left-3 top-3 rounded-full bg-slate-950/85 px-2.5 py-1 text-[11px] font-semibold text-cyan-200 backdrop-blur">
          {episodeLabel}
        </div>

        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-amber-300 px-2.5 py-1 text-[11px] font-bold text-slate-950">
          <Star className="h-3 w-3 fill-current" />
          {formatRating(movie.rating)}
        </div>

        <div className="absolute inset-x-0 bottom-0 translate-y-4 px-3 pb-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Link
            to={`/watch/${movie.slug}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-lime-400 px-4 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-lime-950/30"
          >
            <Play className="h-4 w-4 fill-current" />
            Xem ngay
          </Link>
        </div>
      </div>

      <Link to={`/movie/${movie.slug}`} className="block p-4">
        <h3 className="line-clamp-1 text-sm font-semibold text-app-primary sm:text-[15px]">{movie.title}</h3>
        <p className="mt-1 line-clamp-1 text-xs text-app-muted">{movie.originalTitle}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-app-secondary">
          <span className="rounded-full bg-black/5 dark:bg-white/5 px-2.5 py-1">{movie.year}</span>
          <span className="rounded-full bg-black/5 dark:bg-white/5 px-2.5 py-1">{movie.quality}</span>
          <span className="rounded-full bg-black/5 dark:bg-white/5 px-2.5 py-1">{movie.language}</span>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-app-muted">
          <span>{formatViews(movie.views)} lượt xem</span>
          <span>{movie.type === 'single' ? '1 tập' : `${movie.totalEpisodes} tập`}</span>
        </div>
      </Link>
    </article>
  )
}
