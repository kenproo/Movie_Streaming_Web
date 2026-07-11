import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, Loader2 } from 'lucide-react'
import type { Episode } from '../../types/movie'

type WatchPlayerProps = {
  episode: Episode
  dimmed?: boolean
  initialTime?: number
  onProgressUpdate?: (currentTime: number, duration: number) => void
}

export function WatchPlayer({ episode, dimmed = false, initialTime = 0, onProgressUpdate }: WatchPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(initialTime)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [resolution, setResolution] = useState('1080p')
  const [showResMenu, setShowResMenu] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showControls, setShowControls] = useState(true)
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Use the actual episode URL if available, otherwise fall back to empty to trigger loading/error state
  const videoUrl = episode.videoUrl || ''

  useEffect(() => {
    setIsLoading(true)
    setIsPlaying(false)
    setCurrentTime(initialTime)
    if (videoRef.current) {
      videoRef.current.load()
    }
  }, [episode, initialTime])

  // Trigger onProgressUpdate periodically while playing
  useEffect(() => {
    if (!isPlaying || !onProgressUpdate) return

    const interval = setInterval(() => {
      if (videoRef.current) {
        onProgressUpdate(videoRef.current.currentTime, videoRef.current.duration)
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [isPlaying, onProgressUpdate])

  // Save progress on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current && onProgressUpdate) {
        onProgressUpdate(videoRef.current.currentTime, videoRef.current.duration)
      }
    }
  }, [onProgressUpdate])

  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
      if (onProgressUpdate) {
        onProgressUpdate(videoRef.current.currentTime, videoRef.current.duration)
      }
    } else {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error('Play error:', err))
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
      if (initialTime && initialTime < videoRef.current.duration) {
        videoRef.current.currentTime = initialTime
        setCurrentTime(initialTime)
      }
      setIsLoading(false)
    }
  }

  const handleWaiting = () => {
    setIsLoading(true)
  }

  const handlePlaying = () => {
    setIsLoading(false)
  }

  const handleVideoError = () => {
    setIsLoading(true)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const newTime = Number(e.target.value)
      videoRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value)
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
      videoRef.current.muted = newVolume === 0
      setIsMuted(newVolume === 0)
    }
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    const nextMuted = !isMuted
    setIsMuted(nextMuted)
    videoRef.current.muted = nextMuted
  }

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen()
      }
    }
  }

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 3000)
  }

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [isPlaying])

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className={[
        'relative aspect-video w-full overflow-hidden rounded-[1.25rem] border border-white/10 bg-black group select-none',
        dimmed ? 'shadow-2xl shadow-black/80' : 'shadow-xl shadow-black/40',
      ].join(' ')}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoUrl}
        className="h-full w-full object-contain cursor-pointer"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onWaiting={handleWaiting}
        onPlaying={handlePlaying}
        onError={handleVideoError}
        playsInline
      />

      {/* Demo Notice Overlay */}
      <div className="absolute left-4 top-4 z-20 rounded-lg bg-black/60 px-3 py-1.5 text-xs text-slate-300 backdrop-blur border border-white/5 pointer-events-none">
        <span className="font-semibold text-lime-400">Demo Mode: </span>
        Đang phát mẫu {episode.title}
      </div>

      {/* Center Spinner Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-lime-400" />
            <p className="text-sm font-semibold text-slate-200">
              {!videoUrl ? 'Đang chờ nguồn phát video...' : 'Đang tải luồng phát...'}
            </p>
          </div>
        </div>
      )}

      {/* Custom Control Bar */}
      <div
        className={[
          'absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent p-4 transition-all duration-300 flex flex-col gap-3',
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none',
        ].join(' ')}
      >
        {/* Timeline Slider / Progress Seek */}
        <div className="flex items-center gap-3 w-full">
          <span className="text-xs text-slate-300 font-mono">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 h-1.5 rounded-lg bg-white/20 appearance-none cursor-pointer accent-lime-400 hover:h-2 transition-all"
            style={{
              background: `linear-gradient(to right, #a3e635 ${((currentTime / (duration || 100)) * 100)}%, rgba(255,255,255,0.2) ${((currentTime / (duration || 100)) * 100)}%)`
            }}
          />
          <span className="text-xs text-slate-300 font-mono">{formatTime(duration)}</span>
        </div>

        {/* Buttons Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={togglePlay}
              className="text-white hover:text-lime-400 transition"
              aria-label={isPlaying ? 'Tạm dừng' : 'Phát'}
            >
              {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current" />}
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-2 group/volume">
              <button
                type="button"
                onClick={toggleMute}
                className="text-white hover:text-lime-400 transition"
                aria-label={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 rounded-lg bg-white/20 appearance-none cursor-pointer accent-lime-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Resolution Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowResMenu((prev) => !prev)}
                className="flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1 text-xs font-semibold text-white hover:bg-white/20 transition"
              >
                <Settings className="h-3.5 w-3.5" />
                <span>{resolution}</span>
              </button>

              {showResMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowResMenu(false)} />
                  <div className="absolute bottom-8 right-0 z-20 w-24 rounded-lg bg-slate-900 border border-white/10 p-1 shadow-xl flex flex-col">
                    {['1080p', '720p', '480p', '360p'].map((res) => (
                      <button
                        key={res}
                        type="button"
                        onClick={() => {
                          setResolution(res)
                          setShowResMenu(false)
                        }}
                        className={[
                          'rounded-md px-2 py-1 text-left text-xs transition',
                          resolution === res ? 'bg-lime-400 text-slate-950 font-bold' : 'text-slate-300 hover:bg-white/10',
                        ].join(' ')}
                      >
                        {res}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Fullscreen Button */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="text-white hover:text-lime-400 transition"
              aria-label="Toàn màn hình"
            >
              <Maximize className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
