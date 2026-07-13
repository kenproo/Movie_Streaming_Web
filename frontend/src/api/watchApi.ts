import { apiClient } from './client'

export const watchApi = {
  updateProgress(movieId: string, episodeId: string, episodeNumber: number, progressSeconds: number, durationSeconds?: number) {
    return apiClient.post('/watch/progress', {
      movieId,
      episodeId,
      episodeNumber,
      progressSeconds,
      durationSeconds,
    }, {
      headers: { 'X-Skip-Global-Error-Handler': 'true' }
    }).then((res) => res.data.result)
  },
  getActiveProgresses() {
    return apiClient.get('/watch/active-progress').then((res) => res.data.result)
  },
  getProgress(episodeId: string) {
    return apiClient.get(`/watch/progress/${episodeId}`).then((res) => res.data.result)
  },
}
