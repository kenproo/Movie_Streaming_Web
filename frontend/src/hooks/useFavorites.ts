import { useEffect, useState } from 'react'
import { getStorageItem, setStorageItem } from '../utils/storage'

const favoritesKey = 'favorites'

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => getStorageItem<string[]>(favoritesKey, []))

  useEffect(() => {
    setStorageItem(favoritesKey, favoriteIds)
  }, [favoriteIds])

  const toggleFavorite = (movieId: string) => {
    setFavoriteIds((current) => (current.includes(movieId) ? current.filter((id) => id !== movieId) : [movieId, ...current]))
  }

  return { favoriteIds, toggleFavorite, isFavorite: (movieId: string) => favoriteIds.includes(movieId) }
}
