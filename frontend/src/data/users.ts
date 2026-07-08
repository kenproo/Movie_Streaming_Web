import type { User } from '../types/user'

export const users: User[] = [
  {
    id: 'user-demo',
    name: 'ChillFilm User',
    email: 'user@chillfilm.com',
    password: '123456',
    role: 'user',
    avatarUrl: 'https://placehold.co/120x120/082f49/67e8f9?text=U',
    status: 'active',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'admin-demo',
    name: 'ChillFilm Admin',
    email: 'admin@chillfilm.com',
    password: '123456',
    role: 'admin',
    avatarUrl: 'https://placehold.co/120x120/1e293b/a3e635?text=A',
    status: 'active',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
]
