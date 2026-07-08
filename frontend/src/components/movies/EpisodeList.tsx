import { CheckCircle2, Circle } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Movie } from '../../types/movie'

type EpisodeListProps = {
  movie: Movie
  activeEpisode?: number
  watchedEpisodes?: number[]
}

export function EpisodeList({ movie, activeEpisode, watchedEpisodes = [] }: EpisodeListProps) {
  return (
    <div className="animate-tab-in grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6">
      {movie.episodes.map((episode) => {
        const isActive = activeEpisode === episode.episodeNumber
        const isWatched = watchedEpisodes.includes(episode.episodeNumber)

        return (
          <Link
            key={episode.id}
            to={`/watch/${movie.slug}?episode=${episode.episodeNumber}`}
            className={[
              'group flex items-center gap-2 rounded-2xl border px-3 py-3 text-sm font-semibold transition duration-300',
              isActive
                ? 'border-lime-300 bg-lime-300 text-slate-950 shadow-lg shadow-lime-950/20'
                : 'bg-black/5 dark:bg-white/5 text-app-primary hover:-translate-y-0.5 hover:border-cyan-500/30 dark:hover:border-cyan-300/30 hover:bg-black/10 dark:hover:bg-white/10 accent-ring',
            ].join(' ')}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-black/20 text-xs font-bold">
              {episode.episodeNumber}
            </span>
            <span className="min-w-0 flex-1 truncate">{episode.title}</span>
            {isWatched ? <CheckCircle2 className="h-4 w-4 text-lime-400" /> : <Circle className="h-4 w-4 opacity-50" />}
          </Link>
        )
      })}
    </div>
  )
}
