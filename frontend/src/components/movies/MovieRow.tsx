import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Movie } from '../../types/movie'
import { MovieCard } from './MovieCard'

export function MovieRow({ title, movies, to }: { title: string; movies: Movie[]; to?: string }) {
  if (!movies.length) return null

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-2xl">{title}</h2>
        {to ? (
          <Link to={to} className="inline-flex items-center gap-1 text-sm font-semibold text-cyan-600 hover:text-cyan-700 dark:text-cyan-300 dark:hover:text-cyan-200">
            Xem thêm
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : null}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5 xl:grid-cols-6">
        {movies.slice(0, 6).map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  )
}
