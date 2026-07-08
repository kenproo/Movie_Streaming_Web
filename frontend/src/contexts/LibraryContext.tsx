import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { useUserActionModal } from './UserActionModalContext'
import { libraryService as service } from '../services/libraryService'
import type { Movie } from '../types/movie'
import type { WatchHistoryItem } from '../types/library'

type LibraryContextValue = {
  favorites: string[]
  follows: string[]
  history: WatchHistoryItem[]
  isFavorite: (movieId: string) => boolean
  isFollowing: (movieId: string) => boolean
  toggleFavorite: (movie: Movie) => void
  toggleFollow: (movie: Movie) => void
  addHistory: (movieId: string, episodeNumber: number) => void
}

const LibraryContext = createContext<LibraryContextValue | null>(null)

export function LibraryProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const { openLoginPrompt } = useUserActionModal()
  const [library, setLibrary] = useState<{ favorites: string[]; follows: string[]; history: WatchHistoryItem[] }>({
    favorites: [],
    follows: [],
    history: [],
  })

  const refresh = () => {
    if (!isAuthenticated) return
    service.getLibrary().then((data) => setLibrary(data))
  }

  useEffect(() => {
    if (isAuthenticated) {
      refresh()
    } else {
      setLibrary({ favorites: [], follows: [], history: [] })
    }
  }, [isAuthenticated])

  const guarded = async (action: () => Promise<any> | void) => {
    if (!isAuthenticated) {
      openLoginPrompt()
      return
    }
    await action()
    refresh()
  }

  const value = useMemo<LibraryContextValue>(
    () => ({
      favorites: library.favorites,
      follows: library.follows,
      history: library.history,
      isFavorite: (movieId: string) => library.favorites.includes(movieId),
      isFollowing: (movieId: string) => library.follows.includes(movieId),
      toggleFavorite: (movie: Movie) => guarded(() => service.toggleFavorite(movie)),
      toggleFollow: (movie: Movie) => guarded(() => service.toggleFollow(movie)),
      addHistory: (movieId: string, episodeNumber: number) => guarded(() => service.addHistory(movieId, episodeNumber)),
    }),
    [library, isAuthenticated],
  )

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
}

export function useLibrary() {
  const context = useContext(LibraryContext)
  if (!context) throw new Error('useLibrary must be used inside LibraryProvider')
  return context
}
