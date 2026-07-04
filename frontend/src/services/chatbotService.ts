import { api } from './api'

export interface MovieSuggestion {
  id: string
  title: string
  posterUrl: string
  rating: number
  year: number
  reason: string
  slug?: string
}

export interface ChatbotResponse {
  answer: string
  movies: MovieSuggestion[]
}

/**
 * Gửi tin nhắn đến chatbot và nhận gợi ý phim từ RAG AI.
 *
 * @param message - Tin nhắn từ người dùng
 * @returns Promise<ChatbotResponse>
 */
export async function sendChatMessage(message: string): Promise<ChatbotResponse> {
  const response = await api.post<any>('/rag/chat', { message })
  return {
    answer: response.answer,
    movies: (response.recommendations ?? []).map((rec: any) => ({
      id: rec.id?.toString() ?? '',
      title: rec.title,
      posterUrl: rec.posterUrl,
      rating: rec.rating,
      year: rec.year,
      reason: rec.reason,
      slug: rec.slug,
    })),
  }
}
