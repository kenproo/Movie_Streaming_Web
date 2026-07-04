import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MovieListingPage } from './MovieListingPage'

export function SearchResultPage() {
  const [params] = useSearchParams()
  const keyword = params.get('q')?.trim() ?? ''
  const initialFilters = useMemo(
    () => ({
      keyword: keyword || undefined,
      genre: params.get('genre') ?? undefined,
      year: params.get('year') ?? undefined,
    }),
    [keyword, params],
  )

  return (
    <MovieListingPage
      title="Kết quả tìm kiếm"
      description={keyword ? `Kết quả cho "${keyword}".` : 'Nhập từ khóa để tìm phim, thể loại hoặc diễn viên mock.'}
      initialFilters={initialFilters}
    />
  )
}
