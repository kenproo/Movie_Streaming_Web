import { apiClient } from './client'

export const commentApi = {
  getCommentsByMovieId(movieId: string) {
    return apiClient.get(`/comments/movie/${movieId}`).then((res) => res.data.result)
  },
  getRepliesByParentId(parentId: string) {
    return apiClient.get(`/comments/replies/${parentId}`).then((res) => res.data.result)
  },
  createComment(movieId: string, content: string, parentId?: string | null) {
    return apiClient
      .post('/comments', { movieId, content, parentId })
      .then((res) => res.data.result)
  },
  updateComment(commentId: string, content: string) {
    return apiClient.put(`/comments/${commentId}`, { content }).then((res) => res.data.result)
  },
  deleteComment(commentId: string) {
    return apiClient.delete(`/comments/${commentId}`).then((res) => res.data.result)
  },
  likeComment(commentId: string) {
    return apiClient.post(`/comments/${commentId}/like`).then((res) => res.data.result)
  },
  reportComment(commentId: string, reason: string) {
    return apiClient.post(`/comments/${commentId}/report`, { reason }).then((res) => res.data.result)
  },
}
