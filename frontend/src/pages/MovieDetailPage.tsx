import { useEffect } from 'react'
import { Clock, Globe, Play, Sparkles, Star } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { EmptyState } from '../common/EmptyState'
import { CommentSection } from '../components/comments/CommentSection'
import { EpisodeList } from '../components/movies/EpisodeList'
import { MovieRow } from '../components/movies/MovieRow'
import { analyticsService } from '../services/analyticsService'
import { formatRating } from '../utils/format'

import { useMovieDetail } from '../hooks/useMovieDetail'

export function MovieDetailPage() {
  const { slug } = useParams()
  const { movie, relatedMovies, loading } = useMovieDetail(slug)

  useEffect(() => {
    if (movie) {
      analyticsService.trackVisit(`/movie/${movie.slug}`)
    }
  }, [movie])

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-lime-400"></div>
        <p className="mt-3 text-sm">Đang tải thông tin phim...</p>
      </div>
    )
  }

  if (!movie) {
    return (
      <EmptyState
        title="Không tìm thấy phim"
        description="Phim này chưa tồn tại hoặc hiện không được phát hành."
        actionLabel="Về trang phim"
        actionTo="/movies"
      />
    )
  }

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 shadow-2xl shadow-black/30">
        <div className="grid gap-0 lg:grid-cols-[320px_1fr]">
          <div className="relative min-h-[420px] bg-slate-900">
            <img src={movie.posterUrl} alt={movie.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />
          </div>
          <div className="relative p-6 sm:p-8 lg:p-10">
            <div className="mb-4 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.18em]">
              <span className="rounded-full bg-lime-400 px-3 py-1 text-slate-950">{movie.quality}</span>
              <span className="rounded-full bg-cyan-400/15 px-3 py-1 text-cyan-200 ring-1 ring-cyan-300/20">{movie.language}</span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-white">{movie.year}</span>
            </div>
            <h1 className="text-3xl font-black text-white sm:text-5xl">{movie.title}</h1>
            <p className="mt-2 text-lg text-slate-300">{movie.originalTitle}</p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-200">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1"><Star className="h-4 w-4 fill-current text-amber-300" /> {formatRating(movie.rating)}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1"><Clock className="h-4 w-4" /> {movie.duration}</span>
              <span className="rounded-full bg-white/10 px-3 py-1">{movie.country}</span>
              <span className="rounded-full bg-white/10 px-3 py-1">{movie.releaseStatus}</span>
            </div>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">{movie.description}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <span key={genre} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                  {genre}
                </span>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={`/watch/${movie.slug}`} className="inline-flex items-center gap-2 rounded-xl bg-lime-400 px-5 py-3 text-sm font-bold text-slate-950">
                <Play className="h-4 w-4 fill-current" />
                Xem phim
              </a>
              <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">
                <Sparkles className="h-4 w-4" />
                Trailer
              </button>
              <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">
                <Globe className="h-4 w-4" />
                Yêu thích
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-[1.75rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] p-5 shadow-sm dark:shadow-none">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Danh sách tập</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Chọn tập để chuyển sang trang xem phim.</p>
        </div>
        <EpisodeList movie={movie} activeEpisode={movie.currentEpisode} watchedEpisodes={movie.episodes.slice(0, Math.min(movie.currentEpisode, movie.totalEpisodes)).map((episode) => episode.episodeNumber)} />
      </section>

      <CommentSection movieId={movie.id} />
      <MovieRow title="Phim liên quan" movies={relatedMovies} />
    </div>
  )
}
