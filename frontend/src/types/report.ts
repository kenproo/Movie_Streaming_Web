export type FilmReportStatus = 'pending' | 'processing' | 'resolved'

export interface FilmReport {
  id: string
  movieId: string
  movieTitle: string
  reporterName: string
  reason: string
  detail?: string
  status: FilmReportStatus
  createdAt: string
  updatedAt: string
}
