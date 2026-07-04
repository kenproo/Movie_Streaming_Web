import { useMemo, useState } from 'react'

export function useLoadMore<T>(items: T[], initialCount = 5, step = 5) {
  const [visibleCount, setVisibleCount] = useState(initialCount)

  const visibleItems = useMemo(() => items.slice(0, visibleCount), [items, visibleCount])
  const hasMore = visibleCount < items.length

  const loadMore = () => {
    setVisibleCount((count) => Math.min(count + step, items.length))
  }

  const reset = () => setVisibleCount(initialCount)

  return {
    visibleCount: Math.min(visibleCount, items.length),
    visibleItems,
    hasMore,
    loadMore,
    reset,
  }
}
