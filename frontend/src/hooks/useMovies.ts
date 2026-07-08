import { useEffect, useMemo, useState } from 'react'
import { movieService } from '../services/movieService'
import type { Movie, MovieFilters, MovieType } from '../types/movie'
import { createCacheKey, getCachedData, getOrSetCachedData } from '../utils/requestCache'

type UseMoviesOptions = {
  type?: MovieType
  filters?: MovieFilters
}

export function useMovies({ type, filters }: UseMoviesOptions = {}) {
  const filterString = useMemo(() => JSON.stringify(filters ?? {}), [filters])
  const cacheKey = useMemo(() => createCacheKey('movies-hook', { type: type ?? 'all', filters: filters ?? {} }), [type, filterString])
  const cachedMovies = useMemo(() => getCachedData<Movie[]>(cacheKey), [cacheKey])
  const [movies, setMovies] = useState<Movie[]>(cachedMovies ?? [])
  const [loading, setLoading] = useState(!cachedMovies)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const cached = getCachedData<Movie[]>(cacheKey)
    if (cached) {
      setMovies(cached)
      setLoading(false)
      setError(null)
      return () => {
        active = false
      }
    }

    setLoading(true)

    const fetchMovies = async () => {
      if (type === 'single') return movieService.getSingleMovies(filters)
      if (type === 'series') return movieService.getSeriesMovies(filters)
      if (type === 'anime') return movieService.getAnimeMovies(filters)
      return movieService.getFilteredMovies(filters ?? {})
    }

    const fetchMovieList = async () => {
      const data = await fetchMovies()
      if (data && 'data' in data && Array.isArray(data.data)) {
        return data.data
      }
      return data as Movie[]
    }

    getOrSetCachedData(cacheKey, fetchMovieList)
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
  }, [type, filterString, cacheKey])

  return { movies, loading, error }
}
