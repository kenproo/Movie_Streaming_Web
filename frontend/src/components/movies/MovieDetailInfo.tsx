import { Heart, Play, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Movie } from '../../types/movie'
import { formatRating, formatViews } from '../../utils/format'

const releaseLabels: Record<Movie['releaseStatus'], string> = {
  ongoing: 'Đang chiếu',
  completed: 'Hoàn thành',
  upcoming: 'Sắp chiếu',
}

export function MovieDetailInfo({ movie }: { movie: Movie }) {
  return (
    <section className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <img
        src={movie.posterUrl}
        alt={movie.title}
        className="w-full max-w-[260px] rounded-2xl border border-white/10 object-cover shadow-2xl shadow-black/30"
      />
      <div className="space-y-5">
        <div>
          <h1 className="text-3xl font-bold text-white sm:text-5xl">{movie.title}</h1>
          <p className="mt-2 text-lg text-slate-300">{movie.originalTitle}</p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm text-slate-200">
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-300 px-3 py-1 font-bold text-slate-950">
            <Star className="h-4 w-4 fill-current" /> {formatRating(movie.rating)}
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1">{movie.year}</span>
          <span className="rounded-full bg-white/10 px-3 py-1">{movie.duration}</span>
          <span className="rounded-full bg-white/10 px-3 py-1">
            {movie.currentEpisode}/{movie.totalEpisodes} tập
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1">{movie.country}</span>
          <span className="rounded-full bg-white/10 px-3 py-1">{movie.quality}</span>
          <span className="rounded-full bg-white/10 px-3 py-1">{movie.language}</span>
          <span className="rounded-full bg-cyan-300/10 px-3 py-1 text-cyan-200">
            {releaseLabels[movie.releaseStatus]}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {movie.genres.map((genre) => (
            <span key={genre} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
              {genre}
            </span>
          ))}
        </div>
        <p className="max-w-3xl leading-7 text-slate-300">{movie.description}</p>
        <p className="text-sm text-slate-500">{formatViews(movie.views)} lượt xem</p>
        <div className="flex flex-wrap gap-3">
          <Link
            to={`/watch/${movie.slug}`}
            className="inline-flex items-center gap-2 rounded-xl bg-lime-400 px-5 py-3 text-sm font-bold text-slate-950"
          >
            <Play className="h-4 w-4 fill-current" /> Xem phim
          </Link>
          <button className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-white hover:bg-white/10" type="button">
            Trailer
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-white hover:bg-white/10"
            type="button"
          >
            <Heart className="h-4 w-4" /> Yêu thích
          </button>
        </div>
      </div>
    </section>
  )
}
