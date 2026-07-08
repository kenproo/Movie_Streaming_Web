import { Link } from 'react-router-dom'
import { HeroBanner } from '../components/movies/HeroBanner'
import { MovieRow } from '../components/movies/MovieRow'
import { useMovies } from '../hooks/useMovies'

const interests = [
  { label: 'Hành động', to: '/movies?genre=hanh-dong' },
  { label: 'Tình cảm', to: '/movies?genre=tinh-cam' },
  { label: 'Hài hước', to: '/movies?genre=hai-huoc' },
  { label: 'Kinh dị', to: '/movies?genre=kinh-di' },
  { label: 'Viễn tưởng', to: '/movies?genre=vien-tuong' },
  { label: 'Anime', to: '/movies/anime' },
  { label: 'Phim bộ', to: '/movies/series' },
  { label: '4K', to: '/movies?quality=4K' },
]

export function HomePage() {
  const { movies: hotMovies } = useMovies({ filters: { sortBy: 'views-desc' } })
  const { movies: latestMovies } = useMovies({ filters: { sortBy: 'latest' } })
  const { movies: singleMovies } = useMovies({ type: 'single', filters: { sortBy: 'rating-desc' } })
  const { movies: seriesMovies } = useMovies({ type: 'series', filters: { sortBy: 'rating-desc' } })
  const { movies: animeMovies } = useMovies({ type: 'anime', filters: { sortBy: 'rating-desc' } })
  const continueMovies = latestMovies.slice(0, 6)

  return (
    <div className="space-y-10">
      {hotMovies.length ? <HeroBanner movies={hotMovies.slice(0, 5)} /> : null}

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-2xl">Bạn đang quan tâm gì?</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Lối tắt theo thể loại và chất lượng thường xem.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {interests.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] px-4 py-4 text-center text-sm font-bold text-slate-700 dark:text-slate-100 transition hover:-translate-y-0.5 hover:border-cyan-500/40 dark:hover:border-cyan-300/40 hover:bg-cyan-500/10 dark:hover:bg-cyan-300/10 hover:text-cyan-600 dark:hover:text-cyan-100 shadow-sm dark:shadow-none"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      <MovieRow title="Phim đang hot" movies={hotMovies} to="/movies" />
      <MovieRow title="Phim mới cập nhật" movies={latestMovies} to="/movies" />
      <MovieRow title="Phim lẻ nổi bật" movies={singleMovies} to="/movies/single" />
      <MovieRow title="Phim bộ hay" movies={seriesMovies} to="/movies/series" />
      <MovieRow title="Anime nổi bật" movies={animeMovies} to="/movies/anime" />
      <MovieRow title="Xem tiếp" movies={continueMovies} />
    </div>
  )
}
