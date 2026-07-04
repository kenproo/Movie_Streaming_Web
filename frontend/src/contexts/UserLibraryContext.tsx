import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { useAuth } from './AuthContext'
import type { Movie } from '../types/movie'
import type { WatchHistoryItem } from '../types/library'
import { getStorageItem, setStorageItem } from '../utils/storage'

type UserLibraryState = {
  favorites: string[]
  follows: string[]
  history: WatchHistoryItem[]
}

type UserLibraryContextValue = {
  favorites: string[]
  follows: string[]
  history: WatchHistoryItem[]
  isFavorite: (movieId: string) => boolean
  isFollowing: (movieId: string) => boolean
  toggleFavorite: (movie: Movie) => void
  toggleFollow: (movie: Movie) => void
  addHistory: (movieId: string, episodeNumber: number) => void
}

const UserLibraryContext = createContext<UserLibraryContextValue | null>(null)

const libraryKey = 'user-library'
const defaultState: UserLibraryState = { favorites: [], follows: [], history: [] }

function readLibrary(): UserLibraryState {
  return getStorageItem<UserLibraryState>(libraryKey, defaultState)
}

function saveLibrary(state: UserLibraryState) {
  setStorageItem(libraryKey, state)
}

export function UserLibraryProvider({ children }: { children: ReactNode }) {
  useAuth()
  const [state, setState] = useState<UserLibraryState>(() => readLibrary())

  const value = useMemo<UserLibraryContextValue>(
    () => ({
      favorites: state.favorites,
      follows: state.follows,
      history: state.history,
      isFavorite: (movieId: string) => state.favorites.includes(movieId),
      isFollowing: (movieId: string) => state.follows.includes(movieId),
      toggleFavorite: (movie: Movie) => {
        const nextFavorites = state.favorites.includes(movie.id)
          ? state.favorites.filter((id) => id !== movie.id)
          : [movie.id, ...state.favorites]
        const nextState = { ...state, favorites: nextFavorites }
        setState(nextState)
        saveLibrary(nextState)
      },
      toggleFollow: (movie: Movie) => {
        const nextFollows = state.follows.includes(movie.id)
          ? state.follows.filter((id) => id !== movie.id)
          : [movie.id, ...state.follows]
        const nextState = { ...state, follows: nextFollows }
        setState(nextState)
        saveLibrary(nextState)
      },
      addHistory: (movieId: string, episodeNumber: number) => {
        const nextHistory: WatchHistoryItem[] = [
          { movieId, episodeNumber, watchedAt: new Date().toISOString() },
          ...state.history.filter((item) => item.movieId !== movieId || item.episodeNumber !== episodeNumber),
        ]
        const nextState = { ...state, history: nextHistory }
        setState(nextState)
        saveLibrary(nextState)
      },
    }),
    [state],
  )

  return <UserLibraryContext.Provider value={value}>{children}</UserLibraryContext.Provider>
}

export function useUserLibrary() {
  const context = useContext(UserLibraryContext)

  if (!context) {
    throw new Error('useUserLibrary must be used inside UserLibraryProvider')
  }

  return context
}
