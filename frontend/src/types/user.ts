export type UserRole = 'user' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: UserRole
  avatarUrl?: string
  status: 'active' | 'locked'
  createdAt: string
}
