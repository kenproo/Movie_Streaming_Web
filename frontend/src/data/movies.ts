import type { AnimeSeason, Episode, Movie, MovieType, ReleaseStatus } from '../types/movie'

// Put a sample video file at public/videos/sample.mp4 when the watch player is implemented.
const sampleVideoUrl = '/videos/sample.mp4'
const gradientPoster = (id: number) => `https://placehold.co/420x630/031525/67e8f9?text=ChillFilm+${id}`
const gradientBackdrop = (id: number) => `https://placehold.co/1280x720/06111f/a3e635?text=ChillFilm+Backdrop+${id}`

const episodeList = (movieId: string, count: number): Episode[] =>
  Array.from({ length: Math.max(count, 1) }, (_, index) => ({
    id: `${movieId}-ep-${index + 1}`,
    episodeNumber: index + 1,
    title: `Episode ${index + 1}`,
    videoUrl: sampleVideoUrl,
  }))

const createMovie = (params: {
  index: number
  type: MovieType
  title: string
  year: number
  country: string
  genres: string[]
  quality: string
  language: string
  rating: number
  totalEpisodes: number
  currentEpisode: number
  releaseStatus: ReleaseStatus
  status?: Movie['status']
  views: number
  animeSeason?: AnimeSeason
}): Movie => {
  const id = `movie-${params.index}`
  const createdAt = new Date(Date.UTC(2026, 0, params.index)).toISOString()
  const updatedAt = new Date(Date.UTC(2026, 1, params.index)).toISOString()

  return {
    id,
    slug: params.title.toLowerCase().replaceAll(' ', '-'),
    title: params.title,
    originalTitle: `${params.title} Original`,
    description: `A fictional ChillFilm story for catalog testing, generated without copyrighted names or plots.`,
    year: params.year,
    country: params.country,
    type: params.type,
    genres: params.genres,
    quality: params.quality,
    language: params.language,
    rating: params.rating,
    duration: params.type === 'single' ? '112 phút' : '45 phút/tập',
    totalEpisodes: params.totalEpisodes,
    currentEpisode: params.currentEpisode,
    releaseStatus: params.releaseStatus,
    status: params.status ?? 'published',
    views: params.views,
    createdAt,
    updatedAt,
    posterUrl: gradientPoster(params.index),
    backdropUrl: gradientBackdrop(params.index),
    trailerUrl: '/videos/sample.mp4',
    animeSeason: params.animeSeason,
    episodes: episodeList(id, params.totalEpisodes),
  }
}

export const movies: Movie[] = [
  createMovie({ index: 1, type: 'single', title: 'Neon Harbor', year: 2026, country: 'Vietnam', genres: ['hanh-dong', 'tam-ly'], quality: '4K', language: 'Vietsub', rating: 8.7, totalEpisodes: 1, currentEpisode: 1, releaseStatus: 'completed', views: 98210 }),
  createMovie({ index: 2, type: 'single', title: 'Midnight Atlas', year: 2025, country: 'Japan', genres: ['phieu-luu', 'bi-an'], quality: 'Full HD', language: 'Vietsub', rating: 8.1, totalEpisodes: 1, currentEpisode: 1, releaseStatus: 'completed', views: 76210 }),
  createMovie({ index: 3, type: 'single', title: 'Silver Dawn Run', year: 2024, country: 'Korea', genres: ['hanh-dong', 'toi-pham'], quality: 'Full HD', language: 'Thuyết minh', rating: 7.9, totalEpisodes: 1, currentEpisode: 1, releaseStatus: 'completed', views: 55210 }),

  createMovie({ index: 4, type: 'single', title: 'Echoes Of Rain', year: 2023, country: 'Thailand', genres: ['tinh-cam', 'tam-ly'], quality: 'HD', language: 'Vietsub', rating: 7.5, totalEpisodes: 1, currentEpisode: 1, releaseStatus: 'completed', views: 31200 }),
  createMovie({ index: 5, type: 'single', title: 'Crimson Metro', year: 2022, country: 'USA', genres: ['hanh-dong', 'vien-tuong'], quality: '4K', language: 'Vietsub', rating: 8.4, totalEpisodes: 1, currentEpisode: 1, releaseStatus: 'completed', views: 112300 }),
  createMovie({ index: 6, type: 'single', title: 'Paper Moon Cafe', year: 2021, country: 'France', genres: ['hai-huoc', 'doi-thuong'], quality: 'Full HD', language: 'Vietsub', rating: 7.3, totalEpisodes: 1, currentEpisode: 1, releaseStatus: 'completed', views: 22100 }),
  createMovie({ index: 7, type: 'single', title: 'Quiet Signal', year: 2020, country: 'UK', genres: ['kinh-di', 'bi-an'], quality: 'HD', language: 'Vietsub', rating: 7.8, totalEpisodes: 1, currentEpisode: 1, releaseStatus: 'completed', views: 43200 }),
  createMovie({ index: 8, type: 'single', title: 'Golden Circuit', year: 2019, country: 'Spain', genres: ['the-thao', 'tam-ly'], quality: 'Full HD', language: 'Lồng tiếng', rating: 7.1, totalEpisodes: 1, currentEpisode: 1, releaseStatus: 'completed', views: 18100 }),
  createMovie({ index: 9, type: 'single', title: 'Shadow Lantern', year: 2018, country: 'China', genres: ['co-trang', 'vo-thuat'], quality: 'HD', language: 'Thuyết minh', rating: 8.0, totalEpisodes: 1, currentEpisode: 1, releaseStatus: 'completed', views: 67300 }),
  createMovie({ index: 10, type: 'single', title: 'Blue Orbit', year: 2027, country: 'Canada', genres: ['vien-tuong', 'phieu-luu'], quality: '4K', language: 'Vietsub', rating: 0, totalEpisodes: 1, currentEpisode: 0, releaseStatus: 'upcoming', status: 'draft', views: 0 }),

  createMovie({ index: 11, type: 'series', title: 'City Of Glass Lines', year: 2026, country: 'Korea', genres: ['tam-ly', 'doi-thuong'], quality: 'Full HD', language: 'Vietsub', rating: 8.6, totalEpisodes: 16, currentEpisode: 6, releaseStatus: 'ongoing', views: 198200 }),
  createMovie({ index: 12, type: 'series', title: 'Northern Desk', year: 2025, country: 'UK', genres: ['toi-pham', 'bi-an'], quality: '4K', language: 'Vietsub', rating: 8.3, totalEpisodes: 8, currentEpisode: 8, releaseStatus: 'completed', views: 144000 }),
  createMovie({ index: 13, type: 'series', title: 'Sunset Couriers', year: 2024, country: 'Vietnam', genres: ['hai-huoc', 'doi-thuong'], quality: 'Full HD', language: 'Thuyết minh', rating: 7.6, totalEpisodes: 20, currentEpisode: 20, releaseStatus: 'completed', views: 80400 }),
  createMovie({ index: 14, type: 'series', title: 'Marble District', year: 2023, country: 'USA', genres: ['chinh-kich', 'tam-ly'], quality: 'HD', language: 'Vietsub', rating: 8.2, totalEpisodes: 12, currentEpisode: 12, releaseStatus: 'completed', views: 99300 }),
  createMovie({ index: 15, type: 'series', title: 'Rain Valley Files', year: 2022, country: 'Thailand', genres: ['bi-an', 'kinh-di'], quality: 'Full HD', language: 'Vietsub', rating: 7.4, totalEpisodes: 24, currentEpisode: 17, releaseStatus: 'ongoing', views: 60300 }),
  createMovie({ index: 16, type: 'series', title: 'Signal Room Nine', year: 2021, country: 'Japan', genres: ['vien-tuong', 'hanh-dong'], quality: '4K', language: 'Vietsub', rating: 8.8, totalEpisodes: 10, currentEpisode: 10, releaseStatus: 'completed', views: 203400 }),
  createMovie({ index: 17, type: 'series', title: 'Velvet Avenue', year: 2020, country: 'France', genres: ['tinh-cam', 'doi-thuong'], quality: 'HD', language: 'Lồng tiếng', rating: 7.2, totalEpisodes: 30, currentEpisode: 30, releaseStatus: 'completed', views: 45300 }),
  createMovie({ index: 18, type: 'series', title: 'Copper Academy', year: 2019, country: 'Canada', genres: ['hoc-duong', 'hai-huoc'], quality: 'Full HD', language: 'Vietsub', rating: 7.0, totalEpisodes: 52, currentEpisode: 52, releaseStatus: 'completed', views: 70300 }),
  createMovie({ index: 19, type: 'series', title: 'Tidewatch Bureau', year: 2018, country: 'Australia', genres: ['phieu-luu', 'hanh-dong'], quality: 'HD', language: 'Vietsub', rating: 7.7, totalEpisodes: 40, currentEpisode: 40, releaseStatus: 'completed', views: 38100 }),
  createMovie({ index: 20, type: 'series', title: 'Future Library', year: 2027, country: 'Singapore', genres: ['vien-tuong', 'bi-an'], quality: '4K', language: 'Vietsub', rating: 0, totalEpisodes: 12, currentEpisode: 0, releaseStatus: 'upcoming', status: 'hidden', views: 0 }),

  createMovie({ index: 21, type: 'anime', title: 'Starlit Bento Club', year: 2026, country: 'Japan', genres: ['hoc-duong', 'hai-huoc'], quality: 'Full HD', language: 'Vietsub', rating: 8.5, totalEpisodes: 12, currentEpisode: 4, releaseStatus: 'ongoing', views: 122000, animeSeason: 'Spring' }),
  createMovie({ index: 22, type: 'anime', title: 'Skygear Orchard', year: 2025, country: 'Japan', genres: ['phieu-luu', 'vien-tuong'], quality: '4K', language: 'Vietsub', rating: 8.9, totalEpisodes: 24, currentEpisode: 24, releaseStatus: 'completed', views: 234000, animeSeason: 'Winter' }),
  createMovie({ index: 23, type: 'anime', title: 'Moon Rabbit Workshop', year: 2024, country: 'Japan', genres: ['doi-thuong', 'gia-dinh'], quality: 'Full HD', language: 'Lồng tiếng', rating: 7.9, totalEpisodes: 13, currentEpisode: 13, releaseStatus: 'completed', views: 82300, animeSeason: 'Fall' }),
  createMovie({ index: 24, type: 'anime', title: 'Circuit Bloom', year: 2023, country: 'Japan', genres: ['hanh-dong', 'vien-tuong'], quality: 'HD', language: 'Vietsub', rating: 8.0, totalEpisodes: 26, currentEpisode: 26, releaseStatus: 'completed', views: 110400, animeSeason: 'Summer' }),
  createMovie({ index: 25, type: 'anime', title: 'Tiny Comet Notes', year: 2022, country: 'Japan', genres: ['am-nhac', 'doi-thuong'], quality: 'Full HD', language: 'Vietsub', rating: 7.6, totalEpisodes: 10, currentEpisode: 10, releaseStatus: 'completed', views: 52300, animeSeason: 'Spring' }),
  createMovie({ index: 26, type: 'anime', title: 'Lantern Mecha Days', year: 2021, country: 'Japan', genres: ['mecha', 'hanh-dong'], quality: '4K', language: 'Vietsub', rating: 8.1, totalEpisodes: 50, currentEpisode: 50, releaseStatus: 'completed', views: 157000, animeSeason: 'Winter' }),
  createMovie({ index: 27, type: 'anime', title: 'Garden Of Static', year: 2020, country: 'Japan', genres: ['bi-an', 'tam-ly'], quality: 'HD', language: 'Vietsub', rating: 8.4, totalEpisodes: 11, currentEpisode: 11, releaseStatus: 'completed', views: 90400, animeSeason: 'Fall' }),
  createMovie({ index: 28, type: 'anime', title: 'Crystal Lunch Rush', year: 2019, country: 'Japan', genres: ['hai-huoc', 'am-thuc'], quality: 'Full HD', language: 'Thuyết minh', rating: 7.4, totalEpisodes: 64, currentEpisode: 64, releaseStatus: 'completed', views: 68300, animeSeason: 'Summer' }),
  createMovie({ index: 29, type: 'anime', title: 'Ocean Byte Patrol', year: 2018, country: 'Japan', genres: ['phieu-luu', 'gia-dinh'], quality: 'HD', language: 'Vietsub', rating: 7.8, totalEpisodes: 36, currentEpisode: 36, releaseStatus: 'completed', views: 77100, animeSeason: 'Spring' }),
  createMovie({ index: 30, type: 'anime', title: 'Aurora Spell Lab', year: 2027, country: 'Japan', genres: ['phep-thuat', 'phieu-luu'], quality: '4K', language: 'Vietsub', rating: 0, totalEpisodes: 12, currentEpisode: 0, releaseStatus: 'upcoming', status: 'draft', views: 0, animeSeason: 'Winter' }),
]
