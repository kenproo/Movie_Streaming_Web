import { api } from './api'
import type { Comment } from '../types/comment'
import type { User } from '../types/user'

function mapCommentToFrontend(comment: any): Comment {
  return {
    ...comment,
    id: comment.id?.toString() ?? '',
    movieId: comment.movieId?.toString() ?? '',
    parentId: comment.parentId?.toString() ?? undefined,
    userId: comment.userId?.toString() ?? '',
    status: (comment.status ?? 'visible') as 'visible' | 'hidden',
  }
}

export const commentService = {
  async getCommentsByMovieId(movieId: string): Promise<Comment[]> {
    const comments = await api.get<any[]>(`/comments/movie/${movieId}`)
    return comments.map(mapCommentToFrontend)
  },

  async getRepliesByParentId(parentId: string): Promise<Comment[]> {
    const comments = await api.get<any[]>(`/comments/replies/${parentId}`)
    return comments.map(mapCommentToFrontend)
  },

  async createComment(movieId: string, content: string, user: User | null, parentId?: string): Promise<Comment> {
    if (!user) throw new Error('Vui lòng đăng nhập để tiếp tục.')
    const response = await api.post<any>('/comments', {
      movieId,
      parentId: parentId || null,
      content: content.trim(),
    })
    return mapCommentToFrontend(response)
  },

  async updateComment(commentId: string, content: string, user: User | null): Promise<Comment> {
    if (!user) throw new Error('Vui lòng đăng nhập để tiếp tục.')
    const response = await api.put<any>(`/comments/${commentId}`, {
      content: content.trim(),
    })
    return mapCommentToFrontend(response)
  },

  async deleteComment(commentId: string, user: User | null): Promise<void> {
    if (!user) throw new Error('Vui lòng đăng nhập để tiếp tục.')
    await api.delete<string>(`/comments/${commentId}`)
  },

  async likeComment(commentId: string): Promise<Comment> {
    const response = await api.post<any>(`/comments/${commentId}/like`)
    return mapCommentToFrontend(response)
  },

  async reportComment(commentId: string, reason: string, user: User | null): Promise<void> {
    if (!user) throw new Error('Vui lòng đăng nhập để tiếp tục.')
    await api.post<any>(`/comments/${commentId}/report`, { reason })
  },

  getAllCommentsForAdmin(): Comment[] {
    // Backend doesn't support get all comments admin API yet
    return []
  },

  hideComment(commentId: string, user: User | null): void {
    // Not supported in backend comment controller yet
    console.warn('hideComment is not supported by the backend REST API yet', commentId, user)
  },

  showComment(commentId: string, user: User | null): void {
    // Not supported in backend comment controller yet
    console.warn('showComment is not supported by the backend REST API yet', commentId, user)
  },

  getCommentsForAdminWithReplies(): Comment[] {
    return []
  },
}
