/**
 * MovieSuggestionCard.tsx
 *
 * Component hiển thị card gợi ý phim trong chatbot.
 * Dùng mock data hiện tại, sau này sẽ nhận data thật từ API backend.
 */

import { Link } from 'react-router-dom'
import type { MovieSuggestion } from '../../services/chatbotService'

interface MovieSuggestionCardProps {
  movie: MovieSuggestion
}

/**
 * Render sao rating
 */
function StarRating({ rating }: { rating: number }) {
  const filled = Math.round(rating / 2) // scale 10 → 5 sao
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`h-2.5 w-2.5 ${i < filled ? 'text-yellow-400' : 'text-slate-600'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-[10px] text-slate-400">{rating.toFixed(1)}</span>
    </div>
  )
}

export function MovieSuggestionCard({ movie }: MovieSuggestionCardProps) {
  const posterFallback = `https://placehold.co/60x90/1e293b/94a3b8?text=${encodeURIComponent(movie.title.slice(0, 2))}`

  return (
    <div className="flex gap-2.5 rounded-xl border border-white/10 bg-slate-800/60 p-2.5 transition-all duration-200 hover:border-green-500/30 hover:bg-slate-800/90">
      {/* Poster */}
      <div className="relative h-[72px] w-[48px] flex-shrink-0 overflow-hidden rounded-lg">
        <img
          src={movie.posterUrl || posterFallback}
          alt={movie.title}
          className="h-full w-full object-cover"
          onError={(e) => {
            ;(e.target as HTMLImageElement).src = posterFallback
          }}
        />
        {/* Rating badge */}
        <div className="absolute bottom-0.5 right-0.5 rounded bg-black/70 px-0.5 py-px text-[9px] font-bold text-yellow-400 backdrop-blur-sm">
          {movie.rating.toFixed(1)}
        </div>
      </div>

      {/* Info */}
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <h4 className="truncate text-xs font-semibold text-slate-100">{movie.title}</h4>
          <div className="mt-0.5 flex items-center gap-1.5">
            <span className="text-[10px] text-slate-400">{movie.year}</span>
            <span className="h-1 w-1 rounded-full bg-slate-600"></span>
            <StarRating rating={movie.rating} />
          </div>
          {movie.reason && (
            <p className="mt-1 text-[10px] leading-tight text-slate-400 line-clamp-2">
              {movie.reason}
            </p>
          )}
        </div>

        {/* Nút xem phim */}
        <div className="mt-2">
          <Link
            to={movie.slug ? `/movie/${movie.slug}` : '#'}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 px-3 py-1.5 text-[10px] font-bold text-slate-950 shadow-md shadow-emerald-500/10 hover:from-emerald-400 hover:to-cyan-400 hover:shadow-emerald-500/20 active:scale-95 transition-all duration-200"
          >
            <svg className="h-3 w-3 fill-current" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
            Xem phim
          </Link>
        </div>
      </div>
    </div>
  )
}
