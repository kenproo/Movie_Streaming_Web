import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { authService } from '../services/authService'
import type { User } from '../types/user'
import { getStorageItem } from '../utils/storage'

type AuthContextValue = {
  currentUser: User | null
  login: (email: string, password: string) => Promise<User>
  register: (name: string, email: string, password: string) => Promise<User>
  logout: () => Promise<void>
  isAuthenticated: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => authService.getCurrentUser())

  // Verify and sync token/profile from backend on initial mount
  useEffect(() => {
    const verifySession = async () => {
      const token = getStorageItem<string | null>('token', null)
      if (token) {
        try {
          const user = await authService.getMe(token)
          setCurrentUser(user)
        } catch (err) {
          console.error('Session verification failed, logging out:', err)
          await authService.logout()
          setCurrentUser(null)
        }
      }
    }
    verifySession()
  }, [])

  const value = useMemo<AuthContextValue>(() => {
    const login = async (email: string, password: string) => {
      const user = await authService.login(email, password)
      setCurrentUser(user)
      return user
    }

    const register = async (name: string, email: string, password: string) => {
      const user = await authService.register(name, email, password)
      setCurrentUser(user)
      return user
    }

    const logout = async () => {
      await authService.logout()
      setCurrentUser(null)
    }

    return {
      currentUser,
      login,
      register,
      logout,
      isAuthenticated: Boolean(currentUser),
      isAdmin: currentUser?.role === 'admin',
    }
  }, [currentUser])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
