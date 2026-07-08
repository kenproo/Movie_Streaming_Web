import { api } from './api'
import { mapMovieToFrontend } from './movieService'
import type { AccessLog, DailyTraffic } from '../types/analytics'
import type { Movie } from '../types/movie'

export const analyticsService = {
  async getDashboardStats() {
    return api.get<{
      totalViews: number
      totalVisits: number
      totalWatchTimeMinutes: number
      totalComments: number
      totalMovies: number
      totalUsers: number
      hotMovies: number
      todayViews: number
    }>('/admin/analytics/dashboard')
  },

  async getTopMovies(): Promise<Movie[]> {
    const movies = await api.get<any[]>('/admin/analytics/top-movies')
    return movies.map(mapMovieToFrontend)
  },

  async getDailyTraffic(): Promise<DailyTraffic[]> {
    return api.get<DailyTraffic[]>('/admin/analytics/traffic')
  },

  async getGenreStats(): Promise<{ genre: string; views: number }[]> {
    return api.get<{ genre: string; views: number }[]>('/admin/analytics/genres')
  },

  async getAccessLogs(): Promise<AccessLog[]> {
    return api.get<AccessLog[]>('/admin/analytics/access-logs')
  },

  async trackView(movieId: string): Promise<void> {
    await api.post<string>(`/analytics/track-view/${movieId}`)
  },

  async trackVisit(page: string): Promise<void> {
    await api.post<string>('/analytics/track-visit', { page })
  },

  async trackSearch(keyword: string): Promise<void> {
    await api.post<string>('/analytics/track-search', { keyword })
  },

  async trackComment(movieId: string): Promise<void> {
    // Backend handles this automatically during POST /comments, so we can ignore or call trackVisit
    await this.trackVisit(`/movie/${movieId}`)
  },
}
