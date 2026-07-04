export interface MovieAnalytics {
  movieId: string
  views: number
  likes: number
  comments: number
  watchTimeMinutes: number
}

export interface DailyTraffic {
  date: string
  visits: number
  views: number
}

export interface AccessLog {
  id: string
  userId?: string
  movieId?: string
  page: string
  action: 'visit' | 'watch' | 'search' | 'comment' | 'like'
  keyword?: string
  createdAt: string
}
