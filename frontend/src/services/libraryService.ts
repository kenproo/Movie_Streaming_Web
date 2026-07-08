import { api } from './api'
import type { Movie } from '../types/movie'
import type { WatchHistoryItem } from '../types/library'

type LibraryState = {
  favorites: string[]
  follows: string[]
  history: WatchHistoryItem[]
}

export const libraryService = {
  async getLibrary(): Promise<LibraryState> {
    try {
      const state = await api.get<any>('/library')
      return {
        favorites: state.favorites ?? [],
        follows: state.follows ?? [],
        history: (state.history ?? []).map((item: any) => ({
          movieId: item.movieId?.toString() ?? '',
          episodeNumber: item.episodeNumber,
          watchedAt: item.watchedAt,
        })),
      }
    } catch (err) {
      console.error('Failed to fetch user library:', err)
      return { favorites: [], follows: [], history: [] }
    }
  },

  async isFavorite(movieId: string): Promise<boolean> {
    try {
      return await api.get<boolean>(`/library/favorite/${movieId}`)
    } catch (err) {
      return false
    }
  },

  async isFollowing(movieId: string): Promise<boolean> {
    try {
      return await api.get<boolean>(`/library/follow/${movieId}`)
    } catch (err) {
      return false
    }
  },

  async toggleFavorite(movie: Movie): Promise<void> {
    await api.post<string>(`/library/favorite/${movie.id}`)
  },

  async toggleFollow(movie: Movie): Promise<void> {
    await api.post<string>(`/library/follow/${movie.id}`)
  },

  async addHistory(movieId: string, episodeNumber: number): Promise<void> {
    await api.post<string>('/library/history', { movieId, episodeNumber })
  },
}
