import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Pagination } from '../components/common/Pagination'
import { ErrorState } from '../common/ErrorState'
import { EmptyState } from '../common/EmptyState'
import { Skeleton } from '../common/Skeleton'
import { MovieFilterPanel } from '../components/movies/MovieFilterPanel'
import { MovieGrid } from '../components/movies/MovieGrid'
import { movieService } from '../services/movieService'
import type { Movie, MovieFilters, MovieType } from '../types/movie'
import { createCacheKey, getCachedData, getOrSetCachedData } from '../utils/requestCache'

type ListingVariant = 'all' | MovieType

type MovieListingPageProps = {
  title: string
  description: string
  variant?: ListingVariant
  initialFilters?: MovieFilters
}

const loadingFallback = new Array(12).fill(null)
const emptyFilters: MovieFilters = {}

const queryKeys: (keyof MovieFilters)[] = ['keyword', 'genre', 'country', 'year', 'quality', 'releaseStatus', 'sortBy', 'page']

type ListingCacheData = {
  movies: Movie[]
  totalPages: number
  totalElements: number
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
      {loadingFallback.map((_, index) => (
        <div key={index} className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-900/80">
          <Skeleton className="aspect-[2/3] rounded-none" />
          <div className="space-y-2 p-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-12" />
              <Skeleton className="h-6 w-12" />
              <Skeleton className="h-6 w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function MovieListingPage({ title, description, variant = 'all', initialFilters = emptyFilters }: MovieListingPageProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [movies, setMovies] = useState<Movie[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [totalElements, setTotalElements] = useState(0)

  const filters = useMemo<MovieFilters>(() => {
    const nextFilters: MovieFilters = { ...initialFilters }
    
    const tab = searchParams.get('tab')
    if (tab === 'schedule' && !searchParams.has('releaseStatus')) {
      nextFilters.releaseStatus = 'ongoing'
    }

    queryKeys.forEach((key) => {
      const value = searchParams.get(key)
      if (!value) return

      switch (key) {
        case 'keyword':
          nextFilters.keyword = value
          break
        case 'genre':
          nextFilters.genre = value
          break
        case 'country':
          nextFilters.country = value
          break
        case 'year':
          nextFilters.year = value
          break
        case 'quality':
          nextFilters.quality = value
          break
        case 'releaseStatus':
          nextFilters.releaseStatus = value
          break
        case 'sortBy':
          nextFilters.sortBy = value
          break
        case 'page':
          nextFilters.page = Number(value)
          break
      }
    })
    return nextFilters
  }, [searchParams, initialFilters])

  const currentPage = filters.page !== undefined ? filters.page : 0
  const listingCacheKey = useMemo(
    () => createCacheKey('movie-listing', { variant, filters: { ...filters, page: currentPage, size: 20 } }),
    [variant, filters, currentPage],
  )

  useEffect(() => {
    let active = true

    const nextFilters: MovieFilters = {
      ...(variant === 'all' ? filters : { ...filters, type: variant as MovieType }),
      page: filters.page !== undefined ? filters.page : 0,
      size: 20,
    }

    const fetchFunc = () => {
      if (variant === 'single') return movieService.getSingleMovies(nextFilters)
      if (variant === 'series') return movieService.getSeriesMovies(nextFilters)
      if (variant === 'anime') return movieService.getAnimeMovies(nextFilters)
      return movieService.getFilteredMovies(nextFilters)
    }

    const cached = getCachedData<ListingCacheData>(listingCacheKey)
    if (cached) {
      setMovies(cached.movies)
      setTotalPages(cached.totalPages)
      setTotalElements(cached.totalElements)
      setLoading(false)
      setError(null)
      return () => {
        active = false
      }
    }

    setLoading(true)
    setError(null)

    getOrSetCachedData(listingCacheKey, async () => {
      const res = await fetchFunc()
      if (res && 'data' in res) {
        return {
          movies: res.data,
          totalPages: res.totalPages,
          totalElements: res.totalElements,
        }
      }

      const arrayData = Array.isArray(res) ? res : []
      return {
        movies: arrayData,
        totalPages: Math.max(1, Math.ceil(arrayData.length / 20)),
        totalElements: arrayData.length,
      }
    })
      .then((res) => {
        if (active) {
          setMovies(res.movies)
          setTotalPages(res.totalPages)
          setTotalElements(res.totalElements)
        }
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : 'Không tải được danh sách phim.')
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [searchParams, variant, filters, listingCacheKey])

  const updateParams = (nextFilters: MovieFilters) => {
    const nextParams = new URLSearchParams(searchParams)
    queryKeys.forEach((key) => nextParams.delete(key))

    Object.entries(nextFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        nextParams.set(key, String(value))
      }
    })

    setSearchParams(nextParams, { replace: true })
  }

  const clearFilters = () => {
    const nextParams = new URLSearchParams(searchParams)
    queryKeys.forEach((key) => nextParams.delete(key))
    setSearchParams(nextParams, { replace: true })
  }

  const handlePrevPage = () => {
    if (currentPage > 0) {
      updateParams({ ...filters, page: currentPage - 1 })
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      updateParams({ ...filters, page: currentPage + 1 })
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-lg shadow-black/20 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">ChillFilm</p>
        <h1 className="mt-2 text-2xl font-black text-white sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">{description}</p>
      </section>

      <MovieFilterPanel filters={filters} onChange={updateParams} onClear={clearFilters} variant={variant === 'all' ? 'all' : variant} />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-slate-300">
          Tìm thấy <span className="text-cyan-300">{totalElements}</span> phim
        </p>
        <p className="text-xs text-slate-500">Kết quả giữ nguyên theo URL, reload trang vẫn không mất bộ lọc.</p>
      </div>

      {loading ? (
        <LoadingGrid />
      ) : error ? (
        <ErrorState title="Không thể tải danh sách phim" description={error} onRetry={() => setLoading(true)} />
      ) : movies.length ? (
        <>
          <MovieGrid movies={movies} />
          <Pagination currentPage={currentPage + 1} totalPages={totalPages} onPrev={handlePrevPage} onNext={handleNextPage} />
        </>
      ) : (
        <EmptyState title="Không có phim phù hợp" description="Thử đổi bộ lọc hoặc xóa bớt điều kiện để xem thêm nội dung." />
      )}
    </div>
  )
}
