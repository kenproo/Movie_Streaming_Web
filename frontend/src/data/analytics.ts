import type { AccessLog, DailyTraffic, MovieAnalytics } from '../types/analytics'

export const movieAnalytics: MovieAnalytics[] = [
  { movieId: 'movie-1', views: 25000, likes: 1200, comments: 48, watchTimeMinutes: 91000 },
  { movieId: 'movie-11', views: 18200, likes: 860, comments: 36, watchTimeMinutes: 70200 },
  { movieId: 'movie-21', views: 21400, likes: 940, comments: 41, watchTimeMinutes: 81400 },
]

export const dailyTraffic: DailyTraffic[] = [
  { date: '2026-06-22', visits: 1200, views: 1800 },
  { date: '2026-06-23', visits: 1400, views: 2050 },
  { date: '2026-06-24', visits: 1600, views: 2300 },
  { date: '2026-06-25', visits: 1500, views: 2200 },
  { date: '2026-06-26', visits: 1700, views: 2500 },
  { date: '2026-06-27', visits: 1850, views: 2750 },
  { date: '2026-06-28', visits: 2100, views: 3000 },
]

export const accessLogs: AccessLog[] = [
  { id: 'log-1', userId: 'user-demo', movieId: 'movie-1', page: '/movie/neon-harbor', action: 'visit', createdAt: '2026-06-28T08:00:00.000Z' },
  { id: 'log-2', userId: 'user-demo', movieId: 'movie-1', page: '/watch/neon-harbor', action: 'watch', createdAt: '2026-06-28T08:05:00.000Z' },
  { id: 'log-3', userId: 'admin-demo', page: '/search', action: 'search', keyword: 'anime', createdAt: '2026-06-28T09:00:00.000Z' },
]
