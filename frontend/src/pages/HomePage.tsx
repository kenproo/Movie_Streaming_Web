import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Play } from 'lucide-react'
import { HeroBanner } from '../components/movies/HeroBanner'
import { MovieRow } from '../components/movies/MovieRow'
import { useMovies } from '../hooks/useMovies'
import { useAuth } from '../contexts/AuthContext'
import { watchApi } from '../api/watchApi'
import { mapMovieToFrontend } from '../services/movieService'

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
  const { isAuthenticated } = useAuth()
  const { movies: hotMovies } = useMovies({ filters: { sortBy: 'views-desc' } })
  const { movies: latestMovies } = useMovies({ filters: { sortBy: 'latest' } })
  const { movies: singleMovies } = useMovies({ type: 'single', filters: { sortBy: 'rating-desc' } })
  const { movies: seriesMovies } = useMovies({ type: 'series', filters: { sortBy: 'rating-desc' } })
  const { movies: animeMovies } = useMovies({ type: 'anime', filters: { sortBy: 'rating-desc' } })
  
  const { movies: actionMovies } = useMovies({ filters: { genre: 'Hành động' } })
  const { movies: comedyMovies } = useMovies({ filters: { genre: 'Hài hước' } })
  const { movies: scifiMovies } = useMovies({ filters: { genre: 'Viễn tưởng' } })
  const { movies: horrorMovies } = useMovies({ filters: { genre: 'Kinh dị' } })
  const { movies: romanceMovies } = useMovies({ filters: { genre: 'Tình cảm' } })

  const [activeProgress, setActiveProgress] = useState<any[]>([])

  useEffect(() => {
    if (isAuthenticated) {
      watchApi.getActiveProgresses()
        .then((data) => setActiveProgress(data ?? []))
        .catch((err) => console.error('Failed to load active watch progress:', err))
    } else {
      setActiveProgress([])
    }
  }, [isAuthenticated])

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

      {/* Real Continue Watching Section */}
      {activeProgress.length > 0 ? (
        <section className="space-y-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-2xl">Xem tiếp</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Tiếp tục xem các bộ phim bạn đang xem dở.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 sm:gap-6">
            {activeProgress.map((item) => {
              const movie = mapMovieToFrontend(item.movie)
              if (!movie) return null
              const percent = item.progressPercent
              return (
                <div key={item.id} className="group relative rounded-2xl overflow-hidden bg-white/5 dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex flex-col hover:-translate-y-1.5 transition duration-300 shadow-lg">
                  <div className="relative aspect-[2/3] overflow-hidden">
                    <img src={movie.posterUrl} alt={movie.title} className="h-full w-full object-cover group-hover:scale-105 transition duration-500" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-300">
                      <Link to={`/watch/${movie.slug}?episode=${item.episodeNumber}`} className="flex h-12 w-12 items-center justify-center rounded-full bg-lime-400 text-slate-950 shadow-lg hover:bg-lime-300 active:scale-90 transition cursor-pointer">
                        <Play className="h-5 w-5 fill-current ml-0.5" />
                      </Link>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="line-clamp-1 text-sm font-bold text-slate-900 dark:text-white hover:text-cyan-500 dark:hover:text-cyan-400 transition">
                        <Link to={`/watch/${movie.slug}?episode=${item.episodeNumber}`}>{movie.title}</Link>
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold">Tập {item.episodeNumber}</p>
                    </div>
                    <div className="mt-4">
                      <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                        <div className="h-full bg-lime-400 rounded-full" style={{ width: `${percent}%` }} />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1.5 font-semibold text-right">{percent}% đã xem</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      ) : null}

      <MovieRow title="Phim đang hot" movies={hotMovies} to="/movies" />
      <MovieRow title="Phim mới cập nhật" movies={latestMovies} to="/movies" />
      <MovieRow title="Phim lẻ nổi bật" movies={singleMovies} to="/movies/single" />
      <MovieRow title="Phim bộ hay" movies={seriesMovies} to="/movies/series" />
      <MovieRow title="Anime nổi bật" movies={animeMovies} to="/movies/anime" />

      {actionMovies.length > 0 && <MovieRow title="Phim hành động kịch tính" movies={actionMovies} to="/movies?genre=hanh-dong" />}
      {comedyMovies.length > 0 && <MovieRow title="Phim hài hước sảng khoái" movies={comedyMovies} to="/movies?genre=hai-huoc" />}
      {scifiMovies.length > 0 && <MovieRow title="Phim viễn tưởng kỳ thú" movies={scifiMovies} to="/movies?genre=vien-tuong" />}
      {horrorMovies.length > 0 && <MovieRow title="Phim kinh dị rùng rợn" movies={horrorMovies} to="/movies?genre=kinh-di" />}
      {romanceMovies.length > 0 && <MovieRow title="Phim tình cảm lãng mạn" movies={romanceMovies} to="/movies?genre=tinh-cam" />}
    </div>
  )
}
