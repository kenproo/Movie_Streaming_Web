import { useEffect, useState } from 'react'
import { movieService } from '../services/movieService'
import type { Movie } from '../types/movie'

export function useMovieDetail(slug?: string) {
  const [movie, setMovie] = useState<Movie | undefined>()
  const [relatedMovies, setRelatedMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) {
      setMovie(undefined)
      setRelatedMovies([])
      setLoading(false)
      return
    }

    let active = true
    setLoading(true)

    movieService
      .getMovieBySlug(slug)
      .then(async (m) => {
        if (!active) return
        setMovie(m)
        if (m) {
          try {
            const related = await movieService.getRelatedMovies(m.id)
            if (active) setRelatedMovies(related)
          } catch (err) {
            console.error('Failed to load related movies:', err)
          }
        } else {
          try {
            const fallbackMovies = await movieService.getMovies()
            if (active) setRelatedMovies(fallbackMovies)
          } catch (err) {
            console.error('Failed to load fallback movies:', err)
          }
        }
      })
      .catch((err) => {
        console.error('Failed to load movie detail:', err)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [slug])

  return { movie, relatedMovies, loading }
}
