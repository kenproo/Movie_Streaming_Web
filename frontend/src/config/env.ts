// Frontend environment configuration
// All API URLs must come from VITE_ environment variables
// Never hardcode URLs, passwords or secrets here

const getRequiredEnv = (key: string, fallback?: string): string => {
  const value = import.meta.env[key] || fallback
  if (!value) {
    console.warn(`[ENV] Missing environment variable: ${key}`)
  }
  return value || ''
}

export const ENV = {
  API_BASE_URL: getRequiredEnv('VITE_API_BASE_URL', 'http://localhost:8080/api'),
  RAG_API_BASE_URL: getRequiredEnv('VITE_RAG_API_BASE_URL', 'http://localhost:8080/api/chatbot'),
  APP_NAME: getRequiredEnv('VITE_APP_NAME', 'ChillFilm'),
  ENVIRONMENT: getRequiredEnv('VITE_ENVIRONMENT', 'local'),
  IS_PRODUCTION: import.meta.env.VITE_ENVIRONMENT === 'production',
}
