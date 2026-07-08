import { apiClient } from './client'

export const authApi = {
  login(email: string, password: string) {
    return apiClient.post('/auth/login', { email, password }).then((res) => res.data)
  },
  register(name: string, email: string, password: string) {
    return apiClient.post('/auth/register', { name, email, password }).then((res) => res.data)
  },
  logout(token: string) {
    return apiClient.post('/auth/logout', { token }).then((res) => res.data)
  },
  getMe(token?: string) {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined
    return apiClient.get('/auth/me', { headers }).then((res) => res.data)
  },
}
