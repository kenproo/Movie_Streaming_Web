/**
 * ChatMessage.tsx
 *
 * Component hiển thị một tin nhắn trong chatbot.
 * Hỗ trợ: tin nhắn user (phải), tin nhắn bot (trái), trạng thái loading.
 */

import { Bot } from 'lucide-react'
import type { MovieSuggestion } from '../../services/chatbotService'
import { MovieSuggestionCard } from './MovieSuggestionCard'

export type MessageRole = 'user' | 'bot'

export interface Message {
  id: string
  role: MessageRole
  text: string
  movies?: MovieSuggestion[]
  isLoading?: boolean
  isError?: boolean
}

interface ChatMessageProps {
  message: Message
}

/** Bot avatar icon */
function BotAvatar() {
  return (
    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 p-[1px] shadow-md shadow-emerald-500/10">
      <div className="flex h-full w-full items-center justify-center rounded-[7px] bg-slate-950">
        <Bot className="h-3.5 w-3.5 text-emerald-400" strokeWidth={1.8} />
      </div>
    </div>
  )
}

/** Typing / loading animation */
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-green-400"
          style={{
            animation: 'chatbotBounce 1.2s infinite',
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
      <span className="ml-1 text-xs text-slate-400">Đang tìm phim phù hợp...</span>
    </div>
  )
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'

  // ─── Tin nhắn của User ───────────────────────────────────────────────────────
  if (isUser) {
    return (
      <div className="flex justify-end">
        <div
          className="max-w-[75%] rounded-2xl rounded-tr-sm bg-gradient-to-br from-green-500 to-emerald-600 px-3.5 py-2.5 shadow-md shadow-green-500/20"
          style={{ wordBreak: 'break-word' }}
        >
          <p className="text-sm leading-relaxed text-white">{message.text}</p>
        </div>
      </div>
    )
  }

  // ─── Tin nhắn của Bot ────────────────────────────────────────────────────────
  return (
    <div className="flex items-start gap-2">
      <BotAvatar />

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        {/* Bubble text */}
        <div
          className={`inline-block max-w-full rounded-2xl rounded-tl-sm px-3.5 py-2.5 ${
            message.isError
              ? 'border border-red-500/30 bg-red-900/20'
              : 'border border-white/8 bg-slate-800/80'
          }`}
        >
          {message.isLoading ? (
            <TypingIndicator />
          ) : (
            <p
              className={`text-sm leading-relaxed ${message.isError ? 'text-red-400' : 'text-slate-200'}`}
              style={{ wordBreak: 'break-word' }}
            >
              {message.text}
            </p>
          )}
        </div>

        {/* Movie suggestion cards */}
        {!message.isLoading && message.movies && message.movies.length > 0 && (
          <div className="flex flex-col gap-2">
            {message.movies.map((movie) => (
              <MovieSuggestionCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
