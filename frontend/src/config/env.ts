export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  RAG_API_BASE_URL: import.meta.env.VITE_RAG_API_BASE_URL || 'http://localhost:8080/api/chatbot',
}
