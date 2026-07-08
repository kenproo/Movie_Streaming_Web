import { chatbotClient } from './client'

export const chatbotApi = {
  chat(message: string, sessionId?: string) {
    return chatbotClient.post('/chat', { message, sessionId }).then((res) => res.data.result ?? res.data)
  },
}
