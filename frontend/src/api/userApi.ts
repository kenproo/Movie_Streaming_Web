import { apiClient } from './client'

export const userApi = {
  getUsers() {
    return apiClient.get('/users').then((res) => res.data.result)
  },
  updateUserRole(userId: string, role: string) {
    return apiClient.patch(`/users/${userId}/role`, { role }).then((res) => res.data.result)
  },
  lockUser(userId: string) {
    return apiClient.patch(`/users/${userId}/lock`).then((res) => res.data.result)
  },
  unlockUser(userId: string) {
    return apiClient.patch(`/users/${userId}/unlock`).then((res) => res.data.result)
  },
}
