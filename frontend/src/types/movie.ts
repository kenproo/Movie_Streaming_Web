export type MovieType = 'single' | 'series' | 'anime'
export type MovieStatus = 'draft' | 'published' | 'hidden'
export type ReleaseStatus = 'ongoing' | 'completed' | 'upcoming'
export type AnimeSeason = 'Winter' | 'Spring' | 'Summer' | 'Fall'

export interface Episode {
  id: string
  episodeNumber: number
  title: string
  videoUrl: string
}

export interface Movie {
  id: string
  slug: string
  title: string
  originalTitle: string
  cast?: string[]
  description: string
  year: number
  country: string
  type: MovieType
  genres: string[]
  quality: string
  language: string
  rating: number
  duration: string
  totalEpisodes: number
  currentEpisode: number
  releaseStatus: ReleaseStatus
  status: MovieStatus
  views: number
  createdAt: string
  updatedAt: string
  posterUrl: string
  backdropUrl: string
  trailerUrl?: string
  animeSeason?: AnimeSeason
  episodes: Episode[]
}


export interface MovieFilters {
  keyword?: string
  type?: MovieType
  genre?: string
  country?: string
  year?: string
  quality?: string
  language?: string
  releaseStatus?: string
  episodeRange?: string
  animeSeason?: string
  sortBy?: string
}
