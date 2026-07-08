/**
 * ChatbotWindow.tsx
 *
 * Cửa sổ chat chính của ChillFilm AI.
 * Hiển thị danh sách tin nhắn, ô nhập liệu và giao diện chat hiện đại.
 */

import { useEffect, useRef, useState } from 'react'
import type { Message } from './ChatMessage'
import { ChatMessage } from './ChatMessage'
import { sendChatMessage } from '../../services/chatbotService'

interface ChatbotWindowProps {
  onClose: () => void
}

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'bot',
  text: 'Xin chào! Tôi là ChillFilm AI 🎬 Bạn muốn tìm phim theo thể loại, tâm trạng hay phim tương tự một bộ phim nào đó?',
  movies: [],
}

const QUICK_SUGGESTIONS = [
  'Phim giống Inception',
  'Phim hành động hay nhất',
  'Phim kinh dị đáng xem',
  'Phim lãng mạn 2024',
]

let messageIdCounter = 1
function genId() {
  return `msg-${Date.now()}-${messageIdCounter++}`
}

export function ChatbotWindow({ onClose }: ChatbotWindowProps) {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto scroll xuống cuối khi có tin mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input khi mở
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300)
  }, [])

  const handleSend = async (text?: string) => {
    const messageText = (text ?? inputText).trim()
    if (!messageText || isLoading) return

    // Thêm tin nhắn user
    const userMsg: Message = {
      id: genId(),
      role: 'user',
      text: messageText,
    }

    // Thêm loading message của bot
    const loadingMsgId = genId()
    const loadingMsg: Message = {
      id: loadingMsgId,
      role: 'bot',
      text: '',
      isLoading: true,
    }

    setMessages((prev) => [...prev, userMsg, loadingMsg])
    setInputText('')
    setIsLoading(true)

    try {
      const response = await sendChatMessage(messageText)

      // Thay loading message bằng response thật
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMsgId
            ? {
                id: loadingMsgId,
                role: 'bot' as const,
                text: response.answer,
                movies: response.movies,
                isLoading: false,
              }
            : msg,
        ),
      )
    } catch (_err) {
      // Xử lý lỗi - hiển thị error message
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMsgId
            ? {
                id: loadingMsgId,
                role: 'bot' as const,
                text: 'Xin lỗi, có lỗi xảy ra khi kết nối. Vui lòng thử lại sau.',
                isLoading: false,
                isError: true,
              }
            : msg,
        ),
      )
    } finally {
      setIsLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleQuickSuggest = (text: string) => {
    handleSend(text)
  }

  return (
    <div
      id="chatbot-window"
      className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#111827] shadow-2xl shadow-black/50"
      style={{ width: '100%', height: '100%' }}
    >
      {/* ─── Header ──────────────────────────────────────────────────── */}
      <div className="relative flex items-center gap-2.5 border-b border-white/10 bg-[#0f172a] px-3.5 py-2.5">
        {/* Bot avatar */}
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30">
          <svg
            className="h-[16px] w-[16px] text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </div>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold leading-tight text-slate-100">ChillFilm AI</h3>
          <p className="text-[10px] text-slate-400 truncate leading-tight">Gợi ý phim theo sở thích của bạn</p>
        </div>

        {/* Online indicator */}
        <div className="flex items-center gap-1 mr-7">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500"></span>
          </span>
          <span className="text-[10px] text-green-400">Online</span>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          id="chatbot-close-btn"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition-all hover:bg-white/10 hover:text-slate-200 cursor-pointer"
          aria-label="Đóng chatbot"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* ─── Messages area ────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-3 py-3 scrollbar-thin">
        <div className="flex flex-col gap-3">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ─── Quick suggestions (hiện khi chưa có nhiều tin nhắn) ───────────────── */}
      {messages.length <= 1 && (
        <div className="border-t border-white/5 px-3 pb-2 pt-2">
          <p className="mb-1.5 text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Gợi ý nhanh</p>
          <div className="flex flex-wrap gap-1">
            {QUICK_SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleQuickSuggest(s)}
                disabled={isLoading}
                className="rounded-full border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-[10px] text-green-400 transition-all hover:bg-green-500/20 hover:border-green-400/50 disabled:opacity-50 cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── Input area ─────────────────────────────────────────────── */}
      <div className="border-t border-white/10 bg-[#0f172a]/60 px-3 py-2.5">
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-800/80 pr-1.5 pl-3 transition-all focus-within:border-green-500/50 focus-within:ring-1 focus-within:ring-green-500/20">
          <input
            ref={inputRef}
            id="chatbot-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder={isLoading ? 'ChillFilm AI đang trả lời...' : 'Nhập tin nhắn...'}
            className="flex-1 bg-transparent py-2 text-sm text-slate-200 placeholder-slate-500 outline-none disabled:opacity-60"
          />

          {/* Send button */}
          <button
            id="chatbot-send-btn"
            onClick={() => handleSend()}
            disabled={isLoading || !inputText.trim()}
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-green-500 text-white shadow-md shadow-green-500/30 transition-all hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-40 active:scale-95 cursor-pointer"
            aria-label="Gửi tin nhắn"
          >
            {isLoading ? (
              <svg className="h-3 w-3 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
