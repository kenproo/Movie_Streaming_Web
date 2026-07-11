/**
 * ChatbotWidget.tsx
 *
 * Widget gốc tích hợp toàn bộ chatbot vào layout.
 * Import component này vào MainLayout để chatbot hiển thị trên mọi trang.
 *
 * Usage:
 *   import { ChatbotWidget } from '../components/chatbot/ChatbotWidget'
 *   // Đặt trong JSX: <ChatbotWidget />
 */

import { useState } from 'react'
import { ChatbotButton } from './ChatbotButton'
import { ChatbotWindow } from './ChatbotWindow'

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = () => setIsOpen((prev) => !prev)
  const handleClose = () => setIsOpen(false)

  return (
    <>
      {/* ─── Chatbot panel ──────────────────────────────────────────────────── */}
      <div
        aria-live="polite"
        aria-label="ChillFilm AI Chatbot"
        style={{ transformOrigin: 'bottom right' }}
        className={`
          fixed z-[999]
          bottom-[88px] right-6
          w-[380px] h-[520px]
          max-sm:bottom-[80px] max-sm:right-3 max-sm:left-3 max-sm:w-auto max-sm:h-[65dvh]
          transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
          ${
            isOpen
              ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
              : 'opacity-0 translate-y-6 scale-[0.92] pointer-events-none blur-[2px]'
          }
        `}
      >
        <ChatbotWindow onClose={handleClose} />
      </div>

      {/* ─── Floating toggle button ─────────────────────────────────────────── */}
      <div className="fixed bottom-5 right-6 z-[1000]">
        <ChatbotButton isOpen={isOpen} onClick={handleToggle} />
      </div>
    </>
  )
}
