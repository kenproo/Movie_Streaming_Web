import { apiClient } from './client'

export const movieApi = {
  getMovies(query?: string) {
    const path = query ? `/movies${query}` : '/movies'
    return apiClient.get(path).then((res) => res.data.result)
  },
  getMovieBySlug(slug: string) {
    return apiClient.get(`/movies/slug/${slug}`).then((res) => res.data.result)
  },
  getRelatedMovies(movieId: string) {
    return apiClient.get(`/movies/related/${movieId}`).then((res) => res.data.result)
  },
  // Admin endpoints
  getAdminMovies() {
    return apiClient.get('/admin/movies').then((res) => res.data.result)
  },
  getAdminMovieById(id: string) {
    return apiClient.get(`/admin/movies/${id}`).then((res) => res.data.result)
  },
  createMovie(payload: any) {
    return apiClient.post('/admin/movies', payload).then((res) => res.data.result)
  },
  updateMovie(id: string, payload: any) {
    return apiClient.put(`/admin/movies/${id}`, payload).then((res) => res.data.result)
  },
  deleteMovie(id: string) {
    return apiClient.delete(`/admin/movies/${id}`).then((res) => res.data.result)
  },
  toggleMovieStatus(id: string) {
    return apiClient.patch(`/admin/movies/${id}/status`).then((res) => res.data.result)
  },
  // Import endpoints
  importAll() {
    return apiClient.post('/admin/import/all').then((res) => res.data)
  },
  dryRunImport() {
    return apiClient.post('/admin/import/dry-run').then((res) => res.data)
  },
  importMovies() {
    return apiClient.post('/admin/import/movies').then((res) => res.data)
  },
  importEpisodes() {
    return apiClient.post('/admin/import/episodes').then((res) => res.data)
  },
  importEpisodeSources() {
    return apiClient.post('/admin/import/episode-sources').then((res) => res.data)
  },
  importSubtitles() {
    return apiClient.post('/admin/import/subtitles').then((res) => res.data)
  },
  importMovieVideoSources() {
    return apiClient.post('/admin/import/movie-video-sources').then((res) => res.data)
  },
}
