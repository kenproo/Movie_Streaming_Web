import { getStorageItem } from '../utils/storage'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export interface ApiResponse<T> {
  code: number
  message?: string
  result: T
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getStorageItem<string | null>('token', null)

  const headers = new Headers(options.headers)
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`

  const response = await fetch(url, {
    ...options,
    headers,
  })

  // Handle case where body is empty or not JSON
  let data: ApiResponse<T>
  try {
    data = (await response.json()) as ApiResponse<T>
  } catch (err) {
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`)
    }
    return null as unknown as T
  }

  if (!response.ok || data.code !== 1000) {
    throw new Error(data.message || `Request failed with code ${data.code}`)
  }

  return data.result
}

export const api = {
  get<T>(path: string, options?: RequestInit) {
    return request<T>(path, { ...options, method: 'GET' })
  },
  post<T>(path: string, body?: any, options?: RequestInit) {
    return request<T>(path, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    })
  },
  put<T>(path: string, body?: any, options?: RequestInit) {
    return request<T>(path, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    })
  },
  patch<T>(path: string, body?: any, options?: RequestInit) {
    return request<T>(path, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    })
  },
  delete<T>(path: string, options?: RequestInit) {
    return request<T>(path, { ...options, method: 'DELETE' })
  },
}
