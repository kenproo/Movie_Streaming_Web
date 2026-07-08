import type { Movie } from '../types/movie'
import type { WatchHistoryItem } from '../types/library'
import { libraryApi } from '../api/libraryApi'
import { mapMovieToFrontend } from './movieService'

type LibraryState = {
  favorites: string[]
  follows: string[]
  history: WatchHistoryItem[]
}

export const libraryService = {
  async getLibrary(): Promise<LibraryState> {
    try {
      const state = await libraryApi.getLibrary()
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
      return await libraryApi.isFavorite(movieId)
    } catch (err) {
      return false
    }
  },

  async isFollowing(movieId: string): Promise<boolean> {
    try {
      return await libraryApi.isFollowing(movieId)
    } catch (err) {
      return false
    }
  },

  async toggleFavorite(movie: Movie): Promise<void> {
    await libraryApi.toggleFavorite(movie.id)
  },

  async toggleFollow(movie: Movie): Promise<void> {
    await libraryApi.toggleFollow(movie.id)
  },

  async addHistory(movieId: string, episodeNumber: number): Promise<void> {
    await libraryApi.addHistory(movieId, episodeNumber)
  },

  async getFavoriteMoviesDetails(): Promise<Movie[]> {
    try {
      const list = await libraryApi.getFavoriteMoviesDetails()
      return (list ?? []).map(mapMovieToFrontend)
    } catch (err) {
      console.error('Failed to fetch favorite movies details:', err)
      return []
    }
  },

  async getFollowMoviesDetails(): Promise<Movie[]> {
    try {
      const list = await libraryApi.getFollowMoviesDetails()
      return (list ?? []).map(mapMovieToFrontend)
    } catch (err) {
      console.error('Failed to fetch followed movies details:', err)
      return []
    }
  },
}
