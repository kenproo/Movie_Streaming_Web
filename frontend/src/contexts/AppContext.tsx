import type { ReactNode } from 'react'
import { createContext, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

type AppContextValue = {
  theme: 'dark'
}

export const AppContext = createContext<AppContextValue>({ theme: 'dark' })

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme] = useLocalStorage<'dark'>('chillfilm-theme', 'dark')
  const value = useMemo(() => ({ theme }), [theme])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
