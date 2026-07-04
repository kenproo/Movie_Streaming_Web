import { api } from './api'
import type { Movie, MovieFilters, MovieType } from '../types/movie'

export function mapMovieToFrontend(movie: any): Movie {
  if (!movie) return null as any
  return {
    ...movie,
    id: movie.id?.toString() ?? '',
    type: (movie.type?.toLowerCase() ?? 'single') as MovieType,
    status: (movie.status?.toLowerCase() ?? 'published') as any,
    releaseStatus: (movie.releaseStatus?.toLowerCase() ?? 'ongoing') as any,
    genres: movie.genres ?? [],
    cast: movie.cast ?? [],
    episodes: (movie.episodes ?? []).map((ep: any) => ({
      id: ep.id?.toString() ?? '',
      episodeNumber: ep.episodeNumber,
      title: ep.title ?? '',
      videoUrl: ep.videoUrl ?? '',
    })),
  }
}

function buildQuery(filters: MovieFilters = {}): string {
  const params = new URLSearchParams()
  if (filters.keyword) params.set('keyword', filters.keyword)
  if (filters.genre) params.set('genre', filters.genre)
  if (filters.country) params.set('country', filters.country)
  if (filters.year) params.set('year', filters.year)
  if (filters.type) params.set('type', filters.type.toUpperCase())
  if (filters.releaseStatus) params.set('releaseStatus', filters.releaseStatus.toUpperCase())
  if (filters.sortBy) {
    // map frontend sortBy values to backend
    // e.g. views-desc -> views, rating-desc -> rating, latest -> latest
    if (filters.sortBy === 'views-desc') {
      params.set('sortBy', 'views')
    } else if (filters.sortBy === 'rating-desc') {
      params.set('sortBy', 'rating')
    } else {
      params.set('sortBy', filters.sortBy)
    }
  }
  const query = params.toString()
  return query ? `?${query}` : ''
}

export const movieService = {
  async getMovies() {
    const movies = await api.get<any[]>('/movies')
    return movies.map(mapMovieToFrontend)
  },

  async getPublishedMovies() {
    const movies = await api.get<any[]>('/movies')
    return movies.map(mapMovieToFrontend)
  },

  async getMovieBySlug(slug: string) {
    const movie = await api.get<any>(`/movies/slug/${slug}`)
    return mapMovieToFrontend(movie)
  },

  async searchMovies(keyword: string) {
    const movies = await api.get<any[]>(`/movies?keyword=${encodeURIComponent(keyword)}`)
    return movies.map(mapMovieToFrontend)
  },

  async searchAllMovies(keyword: string) {
    const normalized = keyword.trim()
    if (!normalized) return []
    const movies = await api.get<any[]>(`/movies?keyword=${encodeURIComponent(normalized)}`)
    return movies.map(mapMovieToFrontend)
  },

  async getMoviesByGenre(genre: string) {
    const movies = await api.get<any[]>(`/movies?genre=${encodeURIComponent(genre)}`)
    return movies.map(mapMovieToFrontend)
  },

  async getRelatedMovies(movieId: string) {
    const movies = await api.get<any[]>(`/movies/related/${movieId}`)
    return movies.map(mapMovieToFrontend)
  },

  async getMoviesByType(type: MovieType) {
    const movies = await api.get<any[]>(`/movies?type=${type.toUpperCase()}`)
    return movies.map(mapMovieToFrontend)
  },

  async getFilteredMovies(filters: MovieFilters) {
    const query = buildQuery(filters)
    const movies = await api.get<any[]>(`/movies${query}`)
    return movies.map(mapMovieToFrontend)
  },

  async getSingleMovies(filters: MovieFilters = {}) {
    return this.getFilteredMovies({ ...filters, type: 'single' })
  },

  async getSeriesMovies(filters: MovieFilters = {}) {
    return this.getFilteredMovies({ ...filters, type: 'series' })
  },

  async getAnimeMovies(filters: MovieFilters = {}) {
    return this.getFilteredMovies({ ...filters, type: 'anime' })
  },
}
