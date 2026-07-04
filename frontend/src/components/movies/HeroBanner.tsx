import { useEffect, useState, useRef } from 'react'
import { Info, Play, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Movie } from '../../types/movie'
import { formatRating, formatViews } from '../../utils/format'

export function HeroBanner({ movies }: { movies: Movie[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % movies.length)
  }

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + movies.length) % movies.length)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return
    const diff = touchStartX.current - touchEndX.current
    const swipeThreshold = 50 // minimum distance to trigger swipe

    if (diff > swipeThreshold) {
      handleNext()
    } else if (diff < -swipeThreshold) {
      handlePrev()
    }

    touchStartX.current = null
    touchEndX.current = null
  }

  useEffect(() => {
    if (movies.length <= 1 || isHovered) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }

    timerRef.current = setInterval(() => {
      handleNext()
    }, 5000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [movies.length, isHovered])

  if (!movies || !movies.length) return null

  return (
    <section
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative overflow-hidden rounded-[2rem] border border-slate-200 dark:border-white/10 bg-slate-950 shadow-2xl shadow-black/30 group"
    >
      <div className="relative min-h-[460px] w-full overflow-hidden">
        {/* Slides container */}
        <div
          className="w-full flex gap-6 transition-transform duration-700 ease-in-out h-full"
          style={{ transform: `translateX(calc(-${activeIndex * 100}% - ${activeIndex * 24}px))` }}
        >
          {movies.map((movie) => (
            <div key={movie.id} className="relative min-h-[460px] w-full flex-shrink-0">
              <img src={movie.backdropUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/30" />
              <div className="relative z-10 flex min-h-[460px] max-w-4xl flex-col justify-end px-12 py-8 sm:px-20 sm:py-10 lg:px-24 lg:py-12 text-white">
                <div className="mb-4 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.18em]">
                  <span className="rounded-full bg-lime-400 px-3 py-1 text-slate-950">{movie.quality}</span>
                  <span className="rounded-full bg-cyan-400/15 px-3 py-1 text-cyan-200 ring-1 ring-cyan-300/20">{movie.language}</span>
                </div>
                <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl line-clamp-1">{movie.title}</h1>
                <p className="mt-2 text-lg text-slate-300 sm:text-xl line-clamp-1">{movie.originalTitle}</p>
                <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-200">
                  <span className="rounded-full bg-white/10 px-3 py-1">{formatRating(movie.rating)} điểm</span>
                  <span className="rounded-full bg-white/10 px-3 py-1">{movie.year}</span>
                  <span className="rounded-full bg-white/10 px-3 py-1">{formatViews(movie.views)} lượt xem</span>
                </div>
                <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base line-clamp-2 sm:line-clamp-3">{movie.description}</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    to={`/watch/${movie.slug}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-lime-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:brightness-110"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    Xem ngay
                  </Link>
                  <Link
                    to={`/movie/${movie.slug}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/15"
                  >
                    <Info className="h-4 w-4" />
                    Chi tiết
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {movies.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 z-20 hidden sm:flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white backdrop-blur opacity-0 group-hover:opacity-100 transition duration-300 hover:bg-black/60 hover:scale-105"
              aria-label="Slide trước"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 z-20 hidden sm:flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white backdrop-blur opacity-0 group-hover:opacity-100 transition duration-300 hover:bg-black/60 hover:scale-105"
              aria-label="Slide sau"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Indicator Dots */}
        {movies.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {movies.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${index === activeIndex ? 'w-6 bg-lime-400' : 'w-2.5 bg-white/40 hover:bg-white/60'}`}
                aria-label={`Tới slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
