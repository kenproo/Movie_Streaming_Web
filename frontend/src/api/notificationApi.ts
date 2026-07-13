import { apiClient } from './client'

export interface NotificationItem {
  id: string
  type: 'NEW_EPISODE' | 'COMMENT_REPLY' | 'MOVIE_UPDATED' | 'SYSTEM'
  title: string
  message: string
  read: boolean
  targetUrl: string
  createdAt: string
}

export const notificationApi = {
  getMyNotifications(): Promise<NotificationItem[]> {
    return apiClient.get('/notifications', {
      headers: { 'X-Skip-Global-Error-Handler': 'true' }
    }).then((res) => res.data.result)
  },
  getUnreadCount(): Promise<number> {
    return apiClient.get('/notifications/unread-count', {
      headers: { 'X-Skip-Global-Error-Handler': 'true' }
    }).then((res) => res.data.result)
  },
  markAsRead(id: string): Promise<string> {
    return apiClient.patch(`/notifications/${id}/read`).then((res) => res.data.result)
  },
  markAllAsRead(): Promise<string> {
    return apiClient.patch('/notifications/read-all').then((res) => res.data.result)
  },
  broadcastNotification(title: string, content: string, targetUrl?: string): Promise<string> {
    return apiClient.post('/admin/notifications/broadcast', { title, content, targetUrl }).then((res) => res.data.result)
  },
}
