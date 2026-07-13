const storagePrefix = 'chillfilm'

export function getStorageKey(key: string) {
  return `${storagePrefix}:${key}`
}

export function getStorageItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback

  try {
    const value = window.localStorage.getItem(getStorageKey(key))
    return value ? (JSON.parse(value) as T) : fallback
  } catch {
    return fallback
  }
}

export function setStorageItem<T>(key: string, value: T) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(getStorageKey(key), JSON.stringify(value))
}

export function removeStorageItem(key: string) {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(getStorageKey(key))
}
