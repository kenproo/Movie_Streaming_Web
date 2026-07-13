import axios from 'axios'
import type { AxiosError, AxiosResponse } from 'axios'
import { ENV } from '../config/env'
import { getStorageItem, removeStorageItem } from '../utils/storage'

// ── Normalize error for UI ─────────────────────────────────────────────────

export interface AppError {
  message: string
  code?: number | string
  status?: number
}

export function normalizeError(error: unknown): AppError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string; code?: number }>
    const data = axiosError.response?.data
    return {
      message: data?.message || axiosError.message || 'An unexpected error occurred',
      code: data?.code,
      status: axiosError.response?.status,
    }
  }
  if (error instanceof Error) {
    return { message: error.message }
  }
  return { message: 'An unexpected error occurred' }
}

// ── Main API client (Backend Spring Boot) ──────────────────────────────────

export const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    const token = getStorageItem<string | null>('token', null)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Backend returns { code: 1000, result: ..., message: ... }
    const data = response.data
    if (data && typeof data === 'object' && 'code' in data && data.code !== 1000) {
      const error = new Error(data.message || `Request failed with code ${data.code}`)
      ;(error as any).response = response
      ;(error as any).code = data.code
      throw error
    }
    return response
  },
  (error: AxiosError) => {
    const skipGlobalHandler = error.config?.headers?.['X-Skip-Global-Error-Handler'] === 'true'
    if (skipGlobalHandler) {
      return Promise.reject(error)
    }

    if (error.response) {
      const status = error.response.status
      if (status === 401) {
        removeStorageItem('token')
        removeStorageItem('refreshToken')
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login'
        }
      } else if (status === 403) {
        if (!window.location.pathname.includes('/403')) {
          window.location.href = '/403'
        }
      } else if (status === 500 || status === 503) {
        if (!window.location.pathname.includes('/500')) {
          window.location.href = '/500'
        }
      }
    } else if (error.code === 'ERR_NETWORK' || error.message.toLowerCase().includes('network error') || !error.status) {
      if (!axios.isCancel(error)) {
        if (!window.location.pathname.includes('/offline')) {
          window.location.href = '/offline'
        }
      }
    }
    return Promise.reject(error)
  }
)

// ── Chatbot client (via Backend proxy) ────────────────────────────────────
// Chatbot goes through backend (/api/chatbot), NOT directly to RAG service
// Backend handles auth and forwarding to rag-chatbot:8000 internally

export const chatbotClient = axios.create({
  baseURL: ENV.RAG_API_BASE_URL,
  timeout: 60000, // longer timeout for RAG processing
  headers: {
    'Content-Type': 'application/json',
  },
})

chatbotClient.interceptors.request.use(
  (config) => {
    const token = getStorageItem<string | null>('token', null)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

chatbotClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const data = response.data
    if (data && typeof data === 'object' && 'code' in data && data.code !== 1000) {
      const error = new Error(data.message || `Request failed with code ${data.code}`)
      ;(error as any).response = response
      ;(error as any).code = data.code
      throw error
    }
    return response
  },
  (error: AxiosError) => {
    const skipGlobalHandler = error.config?.headers?.['X-Skip-Global-Error-Handler'] === 'true'
    if (skipGlobalHandler) {
      return Promise.reject(error)
    }

    if (error.response) {
      const status = error.response.status
      if (status === 401) {
        removeStorageItem('token')
        removeStorageItem('refreshToken')
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login'
        }
      } else if (status === 403) {
        if (!window.location.pathname.includes('/403')) {
          window.location.href = '/403'
        }
      } else if (status === 500 || status === 503) {
        if (!window.location.pathname.includes('/500')) {
          window.location.href = '/500'
        }
      }
    } else if (error.code === 'ERR_NETWORK' || error.message.toLowerCase().includes('network error') || !error.status) {
      if (!axios.isCancel(error)) {
        if (!window.location.pathname.includes('/offline')) {
          window.location.href = '/offline'
        }
      }
    }
    return Promise.reject(error)
  }
)
