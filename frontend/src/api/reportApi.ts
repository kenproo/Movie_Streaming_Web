import { apiClient } from './client'

export const reportApi = {
  getReports(status?: string) {
    const query = status ? `?status=${status.toUpperCase()}` : ''
    return apiClient.get(`/admin/reports${query}`).then((res) => res.data.result)
  },
  createReport(movieId: string, reason: string, detail: string) {
    return apiClient.post('/reports', { movieId, reason, detail }).then((res) => res.data.result)
  },
  updateReportStatus(reportId: string, status: string) {
    return apiClient.patch(`/admin/reports/${reportId}`, { status }).then((res) => res.data.result)
  },
  getUnreadCount() {
    return apiClient.get('/admin/reports/unread-count').then((res) => res.data.result)
  },
}
