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
        <div style="
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at top, #07111f 0%, #020617 100%);
          color: #f8fafc;
          font-family: system-ui, -apple-system, sans-serif;
          padding: 24px;
          box-sizing: border-box;
        ">
          <div style="
            max-width: 600px;
            width: 100%;
            background: rgba(15, 23, 42, 0.6);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 32px;
            padding: 40px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            text-align: center;
          ">
            <div style="
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 64px;
              height: 64px;
              border-radius: 20px;
              background: rgba(244, 63, 94, 0.1);
              color: #f43f5e;
              margin-bottom: 24px;
              font-size: 32px;
              font-weight: bold;
            ">
              ⚠️
            </div>
            
            <h1 style="
              font-size: 28px;
              font-weight: 900;
              margin: 0 0 12px 0;
              background: linear-gradient(to right, #f43f5e, #fda4af);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              letter-spacing: -0.02em;
            ">
              Kết Nối Hệ Thống Gián Đoạn
            </h1>
            
            <p style="
              font-size: 15px;
              color: #94a3b8;
              line-height: 1.6;
              margin: 0 0 24px 0;
            ">
              Đã xảy ra sự cố kết nối tới máy chủ dữ liệu hoặc lỗi ứng dụng cục bộ. Vui lòng kiểm tra xem Backend (Spring Boot) hoặc RAG Chatbot đã được khởi động chưa.
            </p>

            <div style="
              background: rgba(15, 23, 42, 0.8);
              border: 1px solid rgba(255, 255, 255, 0.04);
              padding: 18px;
              border-radius: 16px;
              font-size: 13px;
              color: #fda4af;
              font-family: monospace;
              text-align: left;
              overflow-x: auto;
              max-height: 200px;
              margin-bottom: 30px;
              white-space: pre-wrap;
              box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
            ">${message}${error && error.stack ? `\n\nStack Trace:\n${error.stack}` : ''}</div>

            <div style="
              display: flex;
              gap: 16px;
              justify-content: center;
            ">
              <button 
                onclick="window.location.reload()" 
                style="
                  background: linear-gradient(to right, #a3e635, #22c55e);
                  color: #020617;
                  border: none;
                  padding: 12px 28px;
                  border-radius: 14px;
                  font-weight: 700;
                  font-size: 14px;
                  cursor: pointer;
                  transition: transform 0.2s;
                  box-shadow: 0 10px 15px -3px rgba(163, 230, 53, 0.2);
                "
                onmouseover="this.style.transform='scale(1.03)'"
                onmouseout="this.style.transform='scale(1)'"
              >
                Tải lại trang
              </button>
              <button 
                onclick="window.location.href='/'" 
                style="
                  background: rgba(255, 255, 255, 0.08);
                  color: #f8fafc;
                  border: 1px solid rgba(255, 255, 255, 0.08);
                  padding: 12px 28px;
                  border-radius: 14px;
                  font-weight: 700;
                  font-size: 14px;
                  cursor: pointer;
                  transition: transform 0.2s;
                "
                onmouseover="this.style.transform='scale(1.03)'"
                onmouseout="this.style.transform='scale(1)'"
              >
                Về Trang chủ
              </button>
            </div>
          </div>
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
