import type { Movie } from '../../types/movie'
import { MovieCard } from './MovieCard'

export function MovieGrid({ movies }: { movies: Movie[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  )
}
