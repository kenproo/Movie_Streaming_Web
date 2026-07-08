import type { User, UserRole } from '../types/user'
import { userApi } from '../api/userApi'

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
    const users = await userApi.getUsers()
    return users.map(mapUserToFrontend)
  },

  async updateUserRole(userId: string, role: UserRole): Promise<User> {
    const response = await userApi.updateUserRole(userId, role.toUpperCase())
    return mapUserToFrontend(response)
  },

  async lockUser(userId: string): Promise<User> {
    const response = await userApi.lockUser(userId)
    return mapUserToFrontend(response)
  },

  async unlockUser(userId: string): Promise<User> {
    const response = await userApi.unlockUser(userId)
    return mapUserToFrontend(response)
  },
}
