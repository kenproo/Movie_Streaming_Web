import type { Movie, MovieFilters, MovieType, PaginatedResult } from '../types/movie'
import { movieApi } from '../api/movieApi'

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
  if (filters.sortBy) params.set('sortBy', filters.sortBy)
  if (filters.page !== undefined) params.set('page', String(filters.page))
  if (filters.size !== undefined) params.set('size', String(filters.size))
  const query = params.toString()
  return query ? `?${query}` : ''
}

function extractMoviesList(res: any): any[] {
  if (res && typeof res === 'object' && 'content' in res) {
    return Array.isArray(res.content) ? res.content : []
  }
  return Array.isArray(res) ? res : []
}

export const movieService = {
  async getMovies() {
    const res = await movieApi.getMovies()
    return extractMoviesList(res).map(mapMovieToFrontend)
  },

  async getPublishedMovies() {
    const res = await movieApi.getMovies()
    return extractMoviesList(res).map(mapMovieToFrontend)
  },

  async getMovieBySlug(slug: string) {
    const movie = await movieApi.getMovieBySlug(slug)
    return mapMovieToFrontend(movie)
  },

  async searchMovies(keyword: string) {
    const res = await movieApi.getMovies(`?keyword=${encodeURIComponent(keyword)}`)
    return extractMoviesList(res).map(mapMovieToFrontend)
  },

  async searchAllMovies(keyword: string) {
    const normalized = keyword.trim()
    if (!normalized) return []
    const res = await movieApi.getMovies(`?keyword=${encodeURIComponent(normalized)}`)
    return extractMoviesList(res).map(mapMovieToFrontend)
  },

  async getMoviesByGenre(genre: string) {
    const res = await movieApi.getMovies(`?genre=${encodeURIComponent(genre)}`)
    return extractMoviesList(res).map(mapMovieToFrontend)
  },

  async getRelatedMovies(movieId: string) {
    const movies = await movieApi.getRelatedMovies(movieId)
    return movies.map(mapMovieToFrontend)
  },

  async getMoviesByType(type: MovieType) {
    const res = await movieApi.getMovies(`?type=${type.toUpperCase()}`)
    return extractMoviesList(res).map(mapMovieToFrontend)
  },

  async getFilteredMovies(filters: MovieFilters): Promise<Movie[] | PaginatedResult<Movie>> {
    const query = buildQuery(filters)
    const res = await movieApi.getMovies(query)
    if (res && typeof res === 'object' && 'content' in res) {
      return {
        currentPage: res.page,
        totalPages: res.totalPages,
        pageSize: res.size,
        totalElements: res.totalElements,
        data: (res.content as any[]).map(mapMovieToFrontend)
      }
    }
    return (res as any[]).map(mapMovieToFrontend)
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
