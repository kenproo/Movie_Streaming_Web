/**
 * ChatbotButton.tsx
 *
 * Floating action button để mở/đóng chatbot.
 * Hiển thị fixed ở góc dưới bên phải màn hình.
 */

interface ChatbotButtonProps {
  isOpen: boolean
  onClick: () => void
  hasUnread?: boolean
}

export function ChatbotButton({ isOpen, onClick, hasUnread = false }: ChatbotButtonProps) {
  return (
    <button
      id="chatbot-toggle-btn"
      onClick={onClick}
      aria-label={isOpen ? 'Đóng chatbot' : 'Mở ChillFilm AI'}
      className={`
        group relative flex h-14 w-14 items-center justify-center
        rounded-full shadow-2xl shadow-green-500/30
        transition-all duration-300 active:scale-95 cursor-pointer
        focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
        ${
          isOpen
            ? 'bg-slate-700 hover:bg-slate-600 shadow-slate-900/50'
            : 'bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 hover:shadow-green-400/40 hover:scale-110'
        }
      `}
      style={{
        animation: isOpen ? 'none' : 'chatbotPulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }}
    >
      {/* Icon - chuyển đổi giữa chatbot icon và X */}
      <span
        className={`absolute transition-all duration-300 ${
          isOpen ? 'scale-100 rotate-0 opacity-100' : 'scale-0 rotate-90 opacity-0'
        }`}
      >
        <svg
          className="h-6 w-6 text-slate-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </span>

      <span
        className={`absolute transition-all duration-300 ${
          isOpen ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'
        }`}
      >
        {/* Robot/AI icon */}
        <svg
          className="h-7 w-7 text-white"
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
      </span>

      {/* Unread notification badge */}
      {hasUnread && !isOpen && (
        <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 ring-2 ring-slate-900 text-[8px] font-bold text-white">
          1
        </span>
      )}

      {/* Tooltip */}
      {!isOpen && (
        <span className="pointer-events-none absolute -top-10 right-0 whitespace-nowrap rounded-lg border border-white/10 bg-slate-800 px-2.5 py-1 text-xs text-slate-200 opacity-0 shadow-xl transition-opacity duration-200 group-hover:opacity-100">
          ChillFilm AI 🎬
        </span>
      )}
    </button>
  )
}
