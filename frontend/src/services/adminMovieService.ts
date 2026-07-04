import { api } from './api'
import { mapMovieToFrontend } from './movieService'
import type { Movie } from '../types/movie'

function mapMovieToBackendPayload(movieData: Movie) {
  return {
    title: movieData.title,
    originalTitle: movieData.originalTitle,
    slug: movieData.slug,
    description: movieData.description,
    year: movieData.year,
    country: movieData.country,
    type: movieData.type?.toUpperCase(),
    quality: movieData.quality,
    language: movieData.language,
    duration: movieData.duration,
    totalEpisodes: movieData.totalEpisodes,
    currentEpisode: movieData.currentEpisode,
    releaseStatus: movieData.releaseStatus?.toUpperCase(),
    status: movieData.status?.toUpperCase(),
    posterUrl: movieData.posterUrl,
    backdropUrl: movieData.backdropUrl,
    trailerUrl: movieData.trailerUrl,
    animeSeason: movieData.animeSeason,
    genres: movieData.genres,
    cast: movieData.cast,
  }
}

export const adminMovieService = {
  async getAdminMovies() {
    const movies = await api.get<any[]>('/admin/movies')
    return movies.map(mapMovieToFrontend)
  },

  async getMovieById(id: string) {
    const movie = await api.get<any>(`/admin/movies/${id}`)
    return mapMovieToFrontend(movie)
  },

  async createMovie(movieData: Movie) {
    const payload = mapMovieToBackendPayload(movieData)
    const movie = await api.post<any>('/admin/movies', payload)
    return mapMovieToFrontend(movie)
  },

  async updateMovie(id: string, movieData: Movie) {
    const payload = mapMovieToBackendPayload(movieData)
    const movie = await api.put<any>(`/admin/movies/${id}`, payload)
    return mapMovieToFrontend(movie)
  },

  async deleteMovie(id: string) {
    await api.delete<string>(`/admin/movies/${id}`)
  },

  async toggleMovieStatus(id: string) {
    const movie = await api.patch<any>(`/admin/movies/${id}/status`)
    return mapMovieToFrontend(movie)
  },
}
