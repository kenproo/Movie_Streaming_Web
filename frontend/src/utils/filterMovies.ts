import type { Movie, MovieFilters } from '../types/movie'

const normalize = (value: string) => value.trim().toLowerCase()

const matchesEpisodeRange = (totalEpisodes: number, range?: string) => {
  if (!range) return true

  switch (range) {
    case 'under-10':
      return totalEpisodes < 10
    case '10-20':
      return totalEpisodes >= 10 && totalEpisodes <= 20
    case '20-50':
      return totalEpisodes > 20 && totalEpisodes <= 50
    case 'over-50':
      return totalEpisodes > 50
    default:
      return true
  }
}

const matchesYear = (movieYear: number, year?: string) => {
  if (!year) return true
  if (year === 'before-2020') return movieYear < 2020

  const parsedYear = Number(year)
  return Number.isNaN(parsedYear) ? true : movieYear === parsedYear
}

export function filterMovies(movies: Movie[], filters: MovieFilters = {}) {
  const keyword = filters.keyword ? normalize(filters.keyword) : ''

  const filteredMovies = movies.filter((movie) => {
    const matchesKeyword = keyword
      ? normalize(movie.title).includes(keyword) || normalize(movie.originalTitle).includes(keyword)
      : true

    return (
      (!filters.type || movie.type === filters.type) &&
      matchesKeyword &&
      (!filters.genre || movie.genres.includes(filters.genre)) &&
      (!filters.country || movie.country === filters.country) &&
      matchesYear(movie.year, filters.year) &&
      (!filters.quality || movie.quality === filters.quality) &&
      (!filters.language || movie.language === filters.language) &&
      (!filters.releaseStatus || movie.releaseStatus === filters.releaseStatus) &&
      matchesEpisodeRange(movie.totalEpisodes, filters.episodeRange) &&
      (!filters.animeSeason || movie.animeSeason === filters.animeSeason)
    )
  })

  return [...filteredMovies].sort((first, second) => {
    switch (filters.sortBy) {
      case 'latest':
        return new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime()
      case 'newest-year':
        return second.year - first.year
      case 'oldest-year':
        return first.year - second.year
      case 'rating-desc':
        return second.rating - first.rating
      case 'views-desc':
        return second.views - first.views
      case 'title-asc':
        return first.title.localeCompare(second.title)
      default:
        return 0
    }
  })
}
