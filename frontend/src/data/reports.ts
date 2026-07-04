import type { FilmReport } from '../types/report'

export const filmReports: FilmReport[] = [
  {
    id: 'report-1',
    movieId: 'movie-1',
    movieTitle: 'Neon Harbor',
    reporterName: 'ChillFilm User',
    reason: 'Không xem được',
    detail: 'Video dừng ở giữa tập.',
    status: 'pending',
    createdAt: '2026-06-28T08:40:00.000Z',
    updatedAt: '2026-06-28T08:40:00.000Z',
  },
  {
    id: 'report-2',
    movieId: 'movie-11',
    movieTitle: 'City Of Glass Lines',
    reporterName: 'ChillFilm User',
    reason: 'Sai tập',
    detail: 'Tập 6 đang phát nhầm nội dung tập 7.',
    status: 'processing',
    createdAt: '2026-06-27T09:00:00.000Z',
    updatedAt: '2026-06-28T10:10:00.000Z',
  },
  {
    id: 'report-3',
    movieId: 'movie-21',
    movieTitle: 'Starlit Bento Club',
    reporterName: 'ChillFilm Admin',
    reason: 'Lỗi phụ đề',
    detail: 'Một số line bị lệch thời gian.',
    status: 'resolved',
    createdAt: '2026-06-26T12:00:00.000Z',
    updatedAt: '2026-06-28T14:10:00.000Z',
  },
]
