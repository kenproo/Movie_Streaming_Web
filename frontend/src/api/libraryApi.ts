import { apiClient } from './client'

export const libraryApi = {
  getLibrary() {
    return apiClient.get('/library').then((res) => res.data.result)
  },
  isFavorite(movieId: string) {
    return apiClient.get(`/library/favorite/${movieId}`).then((res) => res.data.result)
  },
  isFollowing(movieId: string) {
    return apiClient.get(`/library/follow/${movieId}`).then((res) => res.data.result)
  },
  toggleFavorite(movieId: string) {
    return apiClient.post(`/library/favorite/${movieId}`).then((res) => res.data.result)
  },
  toggleFollow(movieId: string) {
    return apiClient.post(`/library/follow/${movieId}`).then((res) => res.data.result)
  },
  addHistory(movieId: string, episodeNumber: number) {
    return apiClient.post('/library/history', { movieId, episodeNumber }).then((res) => res.data.result)
  },
  getFavoriteMoviesDetails() {
    return apiClient.get('/library/favorites').then((res) => res.data.result)
  },
  getFollowMoviesDetails() {
    return apiClient.get('/library/follows').then((res) => res.data.result)
  },
}
