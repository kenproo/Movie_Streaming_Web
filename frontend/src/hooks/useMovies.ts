import { useEffect, useMemo, useState } from 'react'
import { movieService } from '../services/movieService'
import type { Movie, MovieFilters, MovieType } from '../types/movie'

type UseMoviesOptions = {
  type?: MovieType
  filters?: MovieFilters
}

export function useMovies({ type, filters }: UseMoviesOptions = {}) {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const filterString = useMemo(() => JSON.stringify(filters ?? {}), [filters])

  useEffect(() => {
    let active = true
    setLoading(true)

    const fetchMovies = async () => {
      if (type === 'single') return movieService.getSingleMovies(filters)
      if (type === 'series') return movieService.getSeriesMovies(filters)
      if (type === 'anime') return movieService.getAnimeMovies(filters)
      return movieService.getFilteredMovies(filters ?? {})
    }

    fetchMovies()
      .then((data) => {
        if (active) {
          setMovies(data)
          setError(null)
        }
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : 'Không tải được danh sách phim.')
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [type, filterString])

  return { movies, loading, error }
}
