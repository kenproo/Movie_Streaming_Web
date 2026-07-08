import { chatbotApi } from '../api/chatbotApi'

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
  sessionId?: string
}

/**
 * Gửi tin nhắn đến chatbot và nhận gợi ý phim từ RAG AI.
 *
 * @param message - Tin nhắn từ người dùng
 * @returns Promise<ChatbotResponse>
 */
export async function sendChatMessage(message: string, sessionId?: string): Promise<ChatbotResponse> {
  const response = await chatbotApi.chat(message, sessionId)
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
    sessionId: response.sessionId,
  }
}
