import { api } from './api'
import type { FilmReport, FilmReportStatus } from '../types/report'

function mapReportToFrontend(report: any): FilmReport {
  return {
    ...report,
    id: report.id?.toString() ?? '',
    movieId: report.movieId?.toString() ?? '',
    status: (report.status?.toLowerCase() ?? 'pending') as FilmReportStatus,
  }
}

export const reportService = {
  async getReports(): Promise<FilmReport[]> {
    const reports = await api.get<any[]>('/admin/reports')
    return reports.map(mapReportToFrontend)
  },

  async getReportsByStatus(status?: FilmReportStatus): Promise<FilmReport[]> {
    const query = status ? `?status=${status.toUpperCase()}` : ''
    const reports = await api.get<any[]>(`/admin/reports${query}`)
    return reports.map(mapReportToFrontend)
  },

  async createReport(movieId: string, reason: string, detail: string): Promise<FilmReport> {
    const report = await api.post<any>('/reports', {
      movieId,
      reason,
      detail,
    })
    return mapReportToFrontend(report)
  },

  async updateReportStatus(reportId: string, status: FilmReportStatus): Promise<FilmReport> {
    const report = await api.patch<any>(`/admin/reports/${reportId}`, {
      status: status.toUpperCase(),
    })
    return mapReportToFrontend(report)
  },

  async getUnreadCount(): Promise<number> {
    return api.get<number>('/admin/reports/unread-count')
  },
}
