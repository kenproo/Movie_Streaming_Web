import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// Global error catcher to display runtime errors on screen
if (typeof window !== 'undefined') {
  const showError = (message: string, error?: Error | any) => {
    const rootEl = document.getElementById('root')
    if (rootEl) {
      rootEl.innerHTML = `
        <div style="padding: 24px; background: #1e1b4b; color: #f43f5e; font-family: sans-serif; border-radius: 12px; margin: 24px; border: 1px solid #f43f5e; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);">
          <h1 style="font-size: 20px; font-weight: bold; margin-bottom: 8px;">Runtime Error Detected</h1>
          <p style="font-size: 14px; color: #fda4af; margin-bottom: 16px;">${message}</p>
          ${error && error.stack ? `<pre style="background: #0f172a; padding: 12px; border-radius: 8px; font-size: 12px; color: #cbd5e1; overflow: auto; max-height: 300px; white-space: pre-wrap;">${error.stack}</pre>` : ''}
          <button onclick="window.location.reload()" style="background: #e11d48; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer; margin-top: 12px;">Reload Page</button>
        </div>
      `
    }
  }

  window.onerror = function(message, _source, _lineno, _colno, error) {
    showError(String(message), error)
    return false
  }

  window.onunhandledrejection = function(event) {
    showError('Unhandled Promise Rejection: ' + String(event.reason), event.reason)
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
