import { apiClient } from './client'

export const analyticsApi = {
  getDashboardStats() {
    return apiClient.get('/admin/analytics/dashboard').then((res) => res.data.result)
  },
  getTopMovies() {
    return apiClient.get('/admin/analytics/top-movies').then((res) => res.data.result)
  },
  getDailyTraffic() {
    return apiClient.get('/admin/analytics/traffic').then((res) => res.data.result)
  },
  getGenreStats() {
    return apiClient.get('/admin/analytics/genres').then((res) => res.data.result)
  },
  getAccessLogs() {
    return apiClient.get('/admin/analytics/access-logs').then((res) => res.data.result)
  },
  trackView(movieId: string) {
    return apiClient.post(`/analytics/track-view/${movieId}`).then((res) => res.data.result)
  },
  trackVisit(page: string) {
    return apiClient.post('/analytics/track-visit', { page }).then((res) => res.data.result)
  },
  trackSearch(keyword: string) {
    return apiClient.post('/analytics/track-search', { keyword }).then((res) => res.data.result)
  },
}
