import { useMemo, useState, type FormEvent } from 'react'
import type { Movie, MovieType, ReleaseStatus, MovieStatus, AnimeSeason, Episode } from '../../types/movie'

type MovieFormProps = {
  initialMovie?: Movie
  onSubmit: (movie: Movie) => void
  submitLabel: string
}

const emptyMovie = (movieType: MovieType): Movie => ({
  id: crypto.randomUUID(),
  slug: '',
  title: '',
  originalTitle: '',
  description: '',
  year: new Date().getFullYear(),
  country: 'Vietnam',
  type: movieType,
  genres: [],
  quality: 'Full HD',
  language: 'Vietsub',
  rating: 0,
  duration: '',
  totalEpisodes: 1,
  currentEpisode: 1,
  releaseStatus: 'upcoming',
  status: 'draft',
  views: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  posterUrl: '',
  backdropUrl: '',
  trailerUrl: '',
  animeSeason: undefined,
  episodes: [],
})

const genreText = (genres: string[]) => genres.join(', ')

export function MovieForm({ initialMovie, onSubmit, submitLabel }: MovieFormProps) {
  const [movie, setMovie] = useState<Movie>(initialMovie ?? emptyMovie('single'))
  const [error, setError] = useState('')

  const isAnime = movie.type === 'anime'
  const genreValue = useMemo(() => genreText(movie.genres), [movie.genres])

  function updateField<K extends keyof Movie>(field: K, value: Movie[K]) {
    setMovie((current) => ({ ...current, [field]: value, updatedAt: new Date().toISOString() }))
  }

  const updateEpisode = (index: number, field: keyof Episode, value: string | number) => {
    setMovie((current) => ({
      ...current,
      episodes: current.episodes.map((episode, episodeIndex) =>
        episodeIndex === index ? { ...episode, [field]: value } : episode,
      ),
      updatedAt: new Date().toISOString(),
    }))
  }

  const addEpisode = () => {
    setMovie((current) => ({
      ...current,
      episodes: [
        ...current.episodes,
        {
          id: crypto.randomUUID(),
          episodeNumber: current.episodes.length + 1,
          title: `Tập ${current.episodes.length + 1}`,
          videoUrl: '/videos/sample.mp4',
        },
      ],
    }))
  }

  const removeEpisode = (index: number) => {
    setMovie((current) => ({
      ...current,
      episodes: current.episodes.filter((_, episodeIndex) => episodeIndex !== index),
    }))
  }

  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (!movie.title || !movie.originalTitle || !movie.description || !movie.duration || !movie.country) {
      setError('Vui lòng nhập đầy đủ trường bắt buộc.')
      return
    }

    const nextMovie: Movie = {
      ...movie,
      slug: movie.slug || movie.title.toLowerCase().replaceAll(' ', '-'),
      posterUrl: movie.posterUrl || `https://placehold.co/420x630/031525/67e8f9?text=${encodeURIComponent(movie.title || 'Movie')}`,
      backdropUrl: movie.backdropUrl || `https://placehold.co/1280x720/06111f/a3e635?text=${encodeURIComponent(movie.title || 'Backdrop')}`,
      animeSeason: isAnime ? (movie.animeSeason ?? 'Winter') : undefined,
      genres: genreValue
        .split(',')
        .map((genre) => genre.trim())
        .filter(Boolean),
    }

    onSubmit(nextMovie)
  }

  return (
    <form onSubmit={submitForm} className="space-y-6 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      {error ? <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p> : null}
      <div className="grid gap-4 md:grid-cols-2">
        {([
          ['title', 'title', 'Tên phim'],
          ['originalTitle', 'originalTitle', 'Tên gốc'],
          ['country', 'country', 'Quốc gia'],
          ['quality', 'quality', 'Chất lượng'],
          ['language', 'language', 'Ngôn ngữ'],
          ['duration', 'duration', 'Thời lượng'],
          ['posterUrl', 'posterUrl', 'Poster URL'],
          ['backdropUrl', 'backdropUrl', 'Backdrop URL'],
          ['trailerUrl', 'trailerUrl', 'Trailer URL'],
        ] as const).map(([field, key, label]) => (
          <label key={field} className="space-y-2">
            <span className="text-sm font-semibold text-slate-200">{label}</span>
            <input
              value={movie[key] as string}
              onChange={(event) => updateField(key as keyof Movie, event.target.value as never)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-300/60"
            />
          </label>
        ))}
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-200">Năm</span>
          <input type="number" value={movie.year} onChange={(event) => updateField('year', Number(event.target.value))} className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-200">Rating</span>
          <input type="number" step="0.1" value={movie.rating} onChange={(event) => updateField('rating', Number(event.target.value))} className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-200">Loại phim</span>
          <select value={movie.type} onChange={(event) => updateField('type', event.target.value as MovieType)} className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none">
            <option value="single">single</option>
            <option value="series">series</option>
            <option value="anime">anime</option>
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-200">Trạng thái phát hành</span>
          <select value={movie.releaseStatus} onChange={(event) => updateField('releaseStatus', event.target.value as ReleaseStatus)} className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none">
            <option value="ongoing">ongoing</option>
            <option value="completed">completed</option>
            <option value="upcoming">upcoming</option>
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-200">Trạng thái</span>
          <select value={movie.status} onChange={(event) => updateField('status', event.target.value as MovieStatus)} className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none">
            <option value="draft">draft</option>
            <option value="published">published</option>
            <option value="hidden">hidden</option>
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-200">Số tập</span>
          <input type="number" value={movie.totalEpisodes} onChange={(event) => updateField('totalEpisodes', Number(event.target.value))} className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-200">Current episode</span>
          <input type="number" value={movie.currentEpisode} onChange={(event) => updateField('currentEpisode', Number(event.target.value))} className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none" />
        </label>
        {isAnime ? (
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-200">Mùa anime</span>
            <select value={movie.animeSeason ?? ''} onChange={(event) => updateField('animeSeason', event.target.value as AnimeSeason)} className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none">
              <option value="">Chọn mùa</option>
              <option value="Winter">Winter</option>
              <option value="Spring">Spring</option>
              <option value="Summer">Summer</option>
              <option value="Fall">Fall</option>
            </select>
          </label>
        ) : null}
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-slate-200">Thể loại, cách nhau bằng dấu phẩy</span>
          <input value={genreValue} onChange={(event) => setMovie((current) => ({ ...current, genres: event.target.value.split(',').map((genre) => genre.trim()).filter(Boolean) }))} className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none" />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-slate-200">Mô tả</span>
          <textarea value={movie.description} onChange={(event) => updateField('description', event.target.value)} className="min-h-28 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none" />
        </label>
      </div>

      <section className="space-y-3 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-white">Episodes</h2>
          <button type="button" onClick={addEpisode} className="rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-white">Thêm tập</button>
        </div>
        <div className="space-y-3">
          {movie.episodes.map((episode, index) => (
            <div key={episode.id} className="grid gap-3 md:grid-cols-[120px_1fr_1fr_auto]">
              <input type="number" value={episode.episodeNumber} onChange={(event) => updateEpisode(index, 'episodeNumber', Number(event.target.value))} className="rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-white outline-none" />
              <input value={episode.title} onChange={(event) => updateEpisode(index, 'title', event.target.value)} className="rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-white outline-none" />
              <input value={episode.videoUrl} onChange={(event) => updateEpisode(index, 'videoUrl', event.target.value)} className="rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-white outline-none" />
              <button type="button" onClick={() => removeEpisode(index)} className="rounded-xl border border-red-400/20 px-3 py-2 text-xs font-bold text-red-200">Xóa</button>
            </div>
          ))}
        </div>
      </section>

      <button type="submit" className="rounded-xl bg-lime-400 px-5 py-3 text-sm font-bold text-slate-950 hover:brightness-110">
        {submitLabel}
      </button>
    </form>
  )
}
