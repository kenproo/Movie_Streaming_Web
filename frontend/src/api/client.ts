import axios from 'axios'
import { ENV } from '../config/env'
import { getStorageItem } from '../utils/storage'

export const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 10000,
})

apiClient.interceptors.request.use(
  (config) => {
    const token = getStorageItem<string | null>('token', null)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response) => {
    const data = response.data
    if (data && typeof data === 'object' && 'code' in data && data.code !== 1000) {
      const error = new Error(data.message || `Request failed with code ${data.code}`)
      ;(error as any).response = response
      ;(error as any).code = data.code
      throw error
    }
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

export const chatbotClient = axios.create({
  baseURL: ENV.RAG_API_BASE_URL,
  timeout: 15000,
})

chatbotClient.interceptors.request.use(
  (config) => {
    const token = getStorageItem<string | null>('token', null)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

chatbotClient.interceptors.response.use(
  (response) => {
    const data = response.data
    if (data && typeof data === 'object' && 'code' in data && data.code !== 1000) {
      const error = new Error(data.message || `Request failed with code ${data.code}`)
      ;(error as any).response = response
      ;(error as any).code = data.code
      throw error
    }
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)
