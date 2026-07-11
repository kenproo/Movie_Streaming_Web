import { AnimatedBot } from './AnimatedBot'

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
        rounded-full transition-all duration-500 active:scale-95 cursor-pointer
        focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
        ${
          isOpen
            ? 'bg-slate-800/90 border border-white/10 text-slate-300 shadow-slate-950/60 shadow-xl'
            : 'bg-slate-950/80 border border-emerald-500/30 text-white shadow-emerald-500/20 shadow-lg hover:shadow-emerald-500/40 hover:scale-110 hover:border-emerald-400/50'
        }
      `}
    >
      {/* Animated glowing backdrop - only when closed */}
      {!isOpen && (
        <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 opacity-60 blur-md transition-all duration-500 group-hover:opacity-90 group-hover:blur-lg animate-pulse" />
      )}
      
      {/* Internal glass face */}
      <span className={`absolute inset-[1.5px] rounded-full transition-all duration-300 ${
        isOpen ? 'bg-slate-800' : 'bg-slate-950 group-hover:bg-slate-900'
      }`} />

      {/* Icon - close X */}
      <span
        className={`absolute z-10 transition-all duration-300 ${
          isOpen ? 'scale-100 rotate-0 opacity-100' : 'scale-0 rotate-90 opacity-0'
        }`}
      >
        <svg
          className="h-5 w-5 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </span>

      {/* Icon - Bot */}
      <span
        className={`absolute z-10 transition-all duration-300 ${
          isOpen ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'
        }`}
      >
        <AnimatedBot size="lg" />
      </span>

      {/* Unread notification badge */}
      {hasUnread && !isOpen && (
        <span className="absolute z-20 -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 ring-2 ring-slate-900 text-[8px] font-bold text-white">
          1
        </span>
      )}

      {/* Tooltip */}
      {!isOpen && (
        <span className="pointer-events-none absolute -top-10 right-0 whitespace-nowrap rounded-lg border border-white/10 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 text-xs text-slate-200 opacity-0 shadow-xl transition-opacity duration-200 group-hover:opacity-100">
          ChillFilm AI 🎬
        </span>
      )}
    </button>
  )
}
