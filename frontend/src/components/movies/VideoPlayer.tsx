import type { Episode } from '../../types/movie'

export function VideoPlayer({ episode }: { episode: Episode }) {
  return (
    <div className="aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black">
      <video key={episode.id} className="h-full w-full" controls preload="metadata">
        <source src={episode.videoUrl} type="video/mp4" />
      </video>
    </div>
  )
}
