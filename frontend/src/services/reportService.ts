import type { FilmReport, FilmReportStatus } from '../types/report'
import { reportApi } from '../api/reportApi'

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
    const reports = await reportApi.getReports()
    return reports.map(mapReportToFrontend)
  },

  async getReportsByStatus(status?: FilmReportStatus): Promise<FilmReport[]> {
    const reports = await reportApi.getReports(status)
    return reports.map(mapReportToFrontend)
  },

  async createReport(movieId: string, reason: string, detail: string): Promise<FilmReport> {
    const report = await reportApi.createReport(movieId, reason, detail)
    return mapReportToFrontend(report)
  },

  async updateReportStatus(reportId: string, status: FilmReportStatus): Promise<FilmReport> {
    const report = await reportApi.updateReportStatus(reportId, status)
    return mapReportToFrontend(report)
  },

  async getUnreadCount(): Promise<number> {
    return reportApi.getUnreadCount()
  },
}
