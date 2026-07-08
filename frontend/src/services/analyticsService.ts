import { mapMovieToFrontend } from './movieService'
import type { AccessLog, DailyTraffic } from '../types/analytics'
import type { Movie } from '../types/movie'
import { analyticsApi } from '../api/analyticsApi'

export const analyticsService = {
  async getDashboardStats() {
    return analyticsApi.getDashboardStats()
  },

  async getTopMovies(): Promise<Movie[]> {
    const movies = await analyticsApi.getTopMovies()
    return movies.map(mapMovieToFrontend)
  },

  async getDailyTraffic(): Promise<DailyTraffic[]> {
    return analyticsApi.getDailyTraffic()
  },

  async getGenreStats(): Promise<{ genre: string; views: number }[]> {
    return analyticsApi.getGenreStats()
  },

  async getAccessLogs(): Promise<AccessLog[]> {
    return analyticsApi.getAccessLogs()
  },

  async trackView(movieId: string): Promise<void> {
    await analyticsApi.trackView(movieId)
  },

  async trackVisit(page: string): Promise<void> {
    await analyticsApi.trackVisit(page)
  },

  async trackSearch(keyword: string): Promise<void> {
    await analyticsApi.trackSearch(keyword)
  },

  async trackComment(movieId: string): Promise<void> {
    await this.trackVisit(`/movie/${movieId}`)
  },
}
