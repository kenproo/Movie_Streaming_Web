import { api } from './api'
import type { User, UserRole } from '../types/user'

export function mapUserToFrontend(user: any): User {
  if (!user) return null as any
  return {
    ...user,
    id: user.id?.toString() ?? '',
    role: (user.role?.toLowerCase() ?? 'user') as UserRole,
    status: (user.status?.toLowerCase() ?? 'active') as any,
  }
}

export const userService = {
  async getUsers(): Promise<User[]> {
    const users = await api.get<any[]>('/users')
    return users.map(mapUserToFrontend)
  },

  async updateUserRole(userId: string, role: UserRole): Promise<User> {
    const response = await api.patch<any>(`/users/${userId}/role`, {
      role: role.toUpperCase(),
    })
    return mapUserToFrontend(response)
  },

  async lockUser(userId: string): Promise<User> {
    const response = await api.patch<any>(`/users/${userId}/lock`)
    return mapUserToFrontend(response)
  },

  async unlockUser(userId: string): Promise<User> {
    const response = await api.patch<any>(`/users/${userId}/unlock`)
    return mapUserToFrontend(response)
  },
}
