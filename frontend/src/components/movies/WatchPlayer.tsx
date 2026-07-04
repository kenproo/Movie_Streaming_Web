import { useMemo } from 'react'
import type { Episode } from '../../types/movie'

type WatchPlayerProps = {
  episode: Episode
  dimmed?: boolean
}

export function WatchPlayer({ episode, dimmed = false }: WatchPlayerProps) {
  const posterFallback = useMemo(
    () => `https://placehold.co/1280x720/020617/67e8f9?text=${encodeURIComponent(episode.title)}`,
    [episode.title],
  )

  return (
    <div className={dimmed ? 'rounded-[1.75rem] bg-black/80 p-3 shadow-2xl shadow-black/50' : 'rounded-[1.75rem] bg-slate-950 p-3 shadow-2xl shadow-black/40'}>
      <div className="aspect-video overflow-hidden rounded-[1.25rem] border border-white/10 bg-black">
        <iframe
          title={episode.title}
          src={`${posterFallback}&autoplay=0`}
          className="h-full w-full"
        />
      </div>
    </div>
  )
}
