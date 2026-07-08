type CacheEntry<T> = {
  data: T
  expiresAt: number
}

const cacheStore = new Map<string, CacheEntry<unknown>>()
const pendingRequests = new Map<string, Promise<unknown>>()

export const DEFAULT_CACHE_TTL_MS = 5 * 60 * 1000

export function getCachedData<T>(key: string): T | undefined {
  const entry = cacheStore.get(key)
  if (!entry) return undefined

  if (entry.expiresAt <= Date.now()) {
    cacheStore.delete(key)
    return undefined
  }

  return entry.data as T
}

export function setCachedData<T>(key: string, data: T, ttlMs = DEFAULT_CACHE_TTL_MS) {
  cacheStore.set(key, {
    data,
    expiresAt: Date.now() + ttlMs,
  })
}

export function createCacheKey(scope: string, value: unknown) {
  return `${scope}:${JSON.stringify(value)}`
}

export async function getOrSetCachedData<T>(key: string, fetcher: () => Promise<T>, ttlMs = DEFAULT_CACHE_TTL_MS) {
  const cached = getCachedData<T>(key)
  if (cached !== undefined) return cached

  const pending = pendingRequests.get(key) as Promise<T> | undefined
  if (pending) return pending

  const request = fetcher()
    .then((data) => {
      setCachedData(key, data, ttlMs)
      return data
    })
    .finally(() => {
      pendingRequests.delete(key)
    })

  pendingRequests.set(key, request)
  return request
}
