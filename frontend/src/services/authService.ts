import { users as demoUsers } from '../data/users'
import type { User } from '../types/user'
import { getStorageItem, setStorageItem } from '../utils/storage'
import { mapUserToFrontend } from './userService'

const usersStorageKey = 'users'
const currentUserStorageKey = 'current-user'
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

function seedUsers() {
  const storedUsers = getStorageItem<User[] | null>(usersStorageKey, null)

  if (storedUsers?.length) {
    return storedUsers
  }

  setStorageItem(usersStorageKey, demoUsers)
  return demoUsers
}

export const authService = {
  getUsers() {
    return seedUsers()
  },

  async login(email: string, password: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok || data.code !== 1000) {
      if (data.code === 1006) {
        throw new Error('Email hoặc mật khẩu không đúng.')
      }
      if (data.code === 5001) {
        throw new Error('Tài khoản đã bị khóa.')
      }
      throw new Error(data.message || 'Đăng nhập thất bại.')
    }

    const { token, user } = data.result
    const frontendUser = mapUserToFrontend(user)
    setStorageItem('token', token)
    setStorageItem(currentUserStorageKey, frontendUser)
    return frontendUser
  },

  async register(name: string, email: string, password: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    })

    const data = await response.json()

    if (!response.ok || data.code !== 1000) {
      if (data.code === 1002) {
        throw new Error('Email đã được sử dụng.')
      }
      throw new Error(data.message || 'Đăng ký thất bại.')
    }

    // Automatically log in after registration
    return this.login(email, password)
  },

  async logout() {
    const token = getStorageItem<string | null>('token', null)
    setStorageItem<string | null>('token', null)
    setStorageItem<User | null>(currentUserStorageKey, null)

    if (token) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        })
      } catch (err) {
        console.error('Failed to logout from server:', err)
      }
    }
  },

  async getMe(token: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (!response.ok || data.code !== 1000) {
      throw new Error(data.message || 'Không thể lấy thông tin người dùng.')
    }

    const user = mapUserToFrontend(data.result)
    setStorageItem(currentUserStorageKey, user)
    return user
  },

  getCurrentUser() {
    return getStorageItem<User | null>(currentUserStorageKey, null)
  },

  isAuthenticated() {
    return Boolean(this.getCurrentUser())
  },

  isAdmin() {
    return this.getCurrentUser()?.role === 'admin'
  },
}
