import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, ChevronLeft, ChevronRight, Maximize2, MoonStar, Play, Radio, ShieldCheck, Heart } from 'lucide-react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { EmptyState } from '../common/EmptyState'
import { CommentSection } from '../components/comments/CommentSection'
import { EpisodeList } from '../components/movies/EpisodeList'
import { MovieRow } from '../components/movies/MovieRow'
import { WatchPlayer } from '../components/movies/WatchPlayer'
import { analyticsService } from '../services/analyticsService'
import { watchApi } from '../api/watchApi'

const reportOptions = ['Không xem được', 'Sai tập', 'Lỗi âm thanh', 'Lỗi phụ đề', 'Khác']

import { useMovieDetail } from '../hooks/useMovieDetail'
import { reportService } from '../services/reportService'
import { useAuth } from '../contexts/AuthContext'
import { useUserActionModal } from '../contexts/UserActionModalContext'
import { useLibrary } from '../contexts/LibraryContext'

export function WatchPage() {
  const { slug } = useParams()
  const [params] = useSearchParams()
  const { movie, relatedMovies, loading } = useMovieDetail(slug)
  const [lightsOff, setLightsOff] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [reportReason, setReportReason] = useState(reportOptions[0])
  const [reportDetail, setReportDetail] = useState('')
  const [submittingReport, setSubmittingReport] = useState(false)

  const { isAuthenticated } = useAuth()
  const { openLoginPrompt } = useUserActionModal()
  const { isFavorite, toggleFavorite, isFollowing, toggleFollow } = useLibrary()

  const episodes = useMemo(() => {
    if (!movie) return []
    if (movie.episodes && movie.episodes.length > 0) return movie.episodes
    return [{
      id: `${movie.id}-ep-default`,
      episodeNumber: 1,
      title: movie.type === 'single' ? 'Full Movie' : 'Tập 1',
      videoUrl: ''
    }]
  }, [movie])

  const movieWithEpisodes = useMemo(() => {
    if (!movie) return null
    return { ...movie, episodes }
  }, [movie, episodes])

  const requestedEpisode = Number(params.get('episode') ?? '1')
  const activeEpisode = episodes.find((episode) => episode.episodeNumber === requestedEpisode) ?? episodes[0]
  const activeIndex = movieWithEpisodes && activeEpisode ? episodes.findIndex((episode) => episode.episodeNumber === activeEpisode.episodeNumber) : -1
  const prevEpisode = movieWithEpisodes && activeIndex !== -1 ? episodes[Math.max(activeIndex - 1, 0)] : null
  const nextEpisode = movieWithEpisodes && activeIndex !== -1 ? episodes[Math.min(activeIndex + 1, episodes.length - 1)] : null
  
  const watchedEpisodes = useMemo(
    () => {
      if (!movieWithEpisodes || !activeEpisode) return []
      return episodes.filter((episode) => episode.episodeNumber < activeEpisode.episodeNumber).map((episode) => episode.episodeNumber)
    },
    [episodes, activeEpisode?.episodeNumber],
  )

  const [initialTime, setInitialTime] = useState(0)

  useEffect(() => {
    if (isAuthenticated && activeEpisode?.id && !activeEpisode.id.endsWith('-ep-default')) {
      watchApi.getProgress(activeEpisode.id)
        .then((progress) => {
          if (progress && progress.progressSeconds) {
            setInitialTime(progress.progressSeconds)
          } else {
            setInitialTime(0)
          }
        })
        .catch((err) => {
          console.error('Failed to get watch progress:', err)
          setInitialTime(0)
        })
    } else {
      setInitialTime(0)
    }
  }, [activeEpisode?.id, isAuthenticated])

  const handleProgressUpdate = (curTime: number, duration: number) => {
    if (!isAuthenticated || !movieWithEpisodes || !activeEpisode || activeEpisode.id.endsWith('-ep-default')) return
    watchApi.updateProgress(
      movieWithEpisodes.id,
      activeEpisode.id,
      activeEpisode.episodeNumber,
      Math.floor(curTime),
      Math.floor(duration)
    ).catch((err) => console.error('Failed to save watch progress:', err))
  }

  useEffect(() => {
    if (movie) {
      analyticsService.trackVisit(`/watch/${movie.slug}`)
      analyticsService.trackView(movie.id)
    }
  }, [movie])

  if (!loading && !movieWithEpisodes) {
    return (
      <EmptyState
        title="Không tìm thấy phim"
        description="Phim này chưa tồn tại hoặc hiện không được phát hành."
        actionLabel="Về trang phim"
        actionTo="/movies"
      />
    )
  }

  const handleSendReport = async () => {
    if (!isAuthenticated) {
      openLoginPrompt()
      return
    }

    if (!movieWithEpisodes) return

    setSubmittingReport(true)
    try {
      const detailText = reportDetail.trim() || `Người dùng báo cáo lỗi từ giao diện xem phim: ${reportReason}`
      await reportService.createReport(movieWithEpisodes.id, reportReason, detailText)
      alert('Cảm ơn bạn đã báo cáo lỗi! Quản trị viên sẽ sớm kiểm tra và khắc phục.')
      setReportDetail('')
      setReportOpen(false)
    } catch (err) {
      alert('Gửi báo cáo thất bại: ' + (err instanceof Error ? err.message : String(err)))
    } finally {
      setSubmittingReport(false)
    }
  }

  const handleToggleFollow = () => {
    if (!isAuthenticated) {
      openLoginPrompt()
      return
    }
    if (movieWithEpisodes) {
      toggleFollow(movieWithEpisodes as any)
    }
  }

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      openLoginPrompt()
      return
    }
    if (movieWithEpisodes) {
      toggleFavorite(movieWithEpisodes as any)
    }
  }

  const isMovieFollowed = movieWithEpisodes ? isFollowing(movieWithEpisodes.id) : false
  const isMovieFavorited = movieWithEpisodes ? isFavorite(movieWithEpisodes.id) : false

  return (
    <div className={lightsOff ? 'space-y-8 rounded-[2rem] bg-slate-950/95 p-4 text-white' : 'space-y-8'}>
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          <div className={lightsOff ? 'rounded-[1.75rem] bg-black/80 p-4' : 'rounded-[1.75rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] p-4 shadow-xl dark:shadow-none'}>
            <WatchPlayer 
              episode={activeEpisode ?? {
                id: 'loading-ep',
                episodeNumber: 1,
                title: 'Tập 1',
                videoUrl: ''
              }} 
              dimmed={lightsOff} 
              initialTime={initialTime} 
              onProgressUpdate={handleProgressUpdate} 
            />
          </div>

          <div className={['flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border p-4', lightsOff ? 'border-white/10 bg-slate-950/80' : 'border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950/80 shadow-sm dark:shadow-none'].join(' ')}>
            <div>
              <p className={['text-xs font-semibold uppercase tracking-[0.2em]', lightsOff ? 'text-cyan-300' : 'text-cyan-600 dark:text-cyan-300'].join(' ')}>
                {activeEpisode ? `Đang xem tập ${activeEpisode.episodeNumber}` : 'Đang chuẩn bị...'}
              </p>
              <h1 className={['mt-1 text-2xl font-bold sm:text-3xl', lightsOff ? 'text-white' : 'text-slate-900 dark:text-white'].join(' ')}>
                {movieWithEpisodes ? movieWithEpisodes.title : 'Đang tải tên phim...'}
              </h1>
              <p className={['mt-1 text-sm', lightsOff ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'].join(' ')}>
                {movieWithEpisodes ? movieWithEpisodes.originalTitle : ''}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setLightsOff((value) => !value)}
                className={['inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition', lightsOff ? 'border-white/10 text-white bg-white/5 hover:bg-white/10' : 'border-slate-200 dark:border-white/10 text-slate-700 dark:text-white bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'].join(' ')}
              >
                <MoonStar className="h-4 w-4" />
                Tắt đèn
              </button>
              <button
                type="button"
                className={['inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition', lightsOff ? 'border-white/10 text-white bg-white/5 hover:bg-white/10' : 'border-slate-200 dark:border-white/10 text-slate-700 dark:text-white bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'].join(' ')}
              >
                <Maximize2 className="h-4 w-4" />
                Phóng to
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!isAuthenticated) {
                    openLoginPrompt()
                  } else {
                    setReportOpen(true)
                  }
                }}
                className={['inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition cursor-pointer', lightsOff ? 'border-white/10 text-white bg-white/5 hover:bg-white/10' : 'border-slate-200 dark:border-white/10 text-slate-700 dark:text-white bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'].join(' ')}
              >
                <AlertTriangle className="h-4 w-4 text-rose-400" />
                Báo lỗi phim
              </button>
              <button
                type="button"
                onClick={handleToggleFollow}
                className={['inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition active:scale-95 cursor-pointer', 
                  isMovieFollowed
                    ? 'bg-cyan-500 border-cyan-500 text-white hover:bg-cyan-600'
                    : lightsOff 
                      ? 'border-white/10 text-white bg-white/5 hover:bg-white/10' 
                      : 'border-slate-200 dark:border-white/10 text-slate-700 dark:text-white bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'
                ].join(' ')}
              >
                <ShieldCheck className={`h-4 w-4 ${isMovieFollowed ? 'fill-current text-white' : ''}`} />
                {isMovieFollowed ? 'Đang theo dõi' : 'Theo dõi phim'}
              </button>
              <button
                type="button"
                onClick={handleToggleFavorite}
                className={['inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition active:scale-95 cursor-pointer', 
                  isMovieFavorited
                    ? 'bg-rose-500 border-rose-500 text-white hover:bg-rose-600'
                    : lightsOff 
                      ? 'border-white/10 text-white bg-white/5 hover:bg-white/10' 
                      : 'border-slate-200 dark:border-white/10 text-slate-700 dark:text-white bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'
                ].join(' ')}
              >
                <Heart className={`h-4 w-4 ${isMovieFavorited ? 'fill-current text-white animate-pulse' : ''}`} />
                {isMovieFavorited ? 'Đã yêu thích' : 'Yêu thích'}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {movieWithEpisodes && prevEpisode ? (
              <Link
                to={`/watch/${movieWithEpisodes.slug}?episode=${prevEpisode.episodeNumber}`}
                className={['inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition', lightsOff ? 'border-white/10 bg-white/5 text-white hover:bg-white/10' : 'border-slate-200 dark:border-white/10 bg-black/5 dark:bg-white/5 text-slate-700 dark:text-white hover:bg-black/10 dark:hover:bg-white/10'].join(' ')}
              >
                <ChevronLeft className="h-4 w-4" />
                Tập trước
              </Link>
            ) : null}
            {movieWithEpisodes && nextEpisode ? (
              <Link
                to={`/watch/${movieWithEpisodes.slug}?episode=${nextEpisode.episodeNumber}`}
                className={['inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition', lightsOff ? 'border-white/10 bg-white/5 text-white hover:bg-white/10' : 'border-slate-200 dark:border-white/10 bg-black/5 dark:bg-white/5 text-slate-700 dark:text-white hover:bg-black/10 dark:hover:bg-white/10'].join(' ')}
              >
                Tập sau
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : null}
            <button
              type="button"
              className={['inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition', lightsOff ? 'border-white/10 bg-white/5 text-white hover:bg-white/10' : 'border-slate-200 dark:border-white/10 bg-black/5 dark:bg-white/5 text-slate-700 dark:text-white hover:bg-black/10 dark:hover:bg-white/10'].join(' ')}
            >
              <Play className="h-4 w-4 fill-current" />
              Tiếp tục xem
            </button>
            <button
              type="button"
              className={['inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition', lightsOff ? 'border-white/10 bg-white/5 text-white hover:bg-white/10' : 'border-slate-200 dark:border-white/10 bg-black/5 dark:bg-white/5 text-slate-700 dark:text-white hover:bg-black/10 dark:hover:bg-white/10'].join(' ')}
            >
              <Radio className="h-4 w-4" />
              Phát ngẫu nhiên
            </button>
          </div>

          <section className={['space-y-4 rounded-[1.75rem] border p-5', lightsOff ? 'border-white/10 bg-white/[0.04]' : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] shadow-sm dark:shadow-none'].join(' ')}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className={['text-lg font-bold', lightsOff ? 'text-white' : 'text-slate-900 dark:text-white'].join(' ')}>Danh sách tập phim</h2>
                <p className={['text-sm', lightsOff ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'].join(' ')}>Tập đã xem và chưa xem được phân biệt bằng trạng thái mock.</p>
              </div>
            </div>
            {movieWithEpisodes && activeEpisode ? (
              <EpisodeList movie={movieWithEpisodes} activeEpisode={activeEpisode.episodeNumber} watchedEpisodes={watchedEpisodes} />
            ) : (
              <div className="py-6 text-center text-slate-400">
                <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-slate-700 border-t-lime-400"></div>
                <p className="mt-2 text-xs">Đang tải danh sách tập...</p>
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-4">
          <section className={['rounded-[1.75rem] border p-5', lightsOff ? 'border-white/10 bg-slate-950/80' : 'border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950/80 shadow-sm dark:shadow-none'].join(' ')}>
            <h3 className={['text-base font-bold', lightsOff ? 'text-white' : 'text-slate-900 dark:text-white'].join(' ')}>Thông tin phim</h3>
            {movieWithEpisodes ? (
              <div className={['mt-4 space-y-3 text-sm', lightsOff ? 'text-slate-300' : 'text-slate-600 dark:text-slate-300'].join(' ')}>
                <div className="flex justify-between gap-3"><span>Thể loại</span><span className={lightsOff ? 'text-white' : 'text-slate-900 dark:text-white'}>{movieWithEpisodes.genres.join(', ')}</span></div>
                <div className="flex justify-between gap-3"><span>Quốc gia</span><span className={lightsOff ? 'text-white' : 'text-slate-900 dark:text-white'}>{movieWithEpisodes.country}</span></div>
                <div className="flex justify-between gap-3"><span>Năm</span><span className={lightsOff ? 'text-white' : 'text-slate-900 dark:text-white'}>{movieWithEpisodes.year}</span></div>
                <div className="flex justify-between gap-3"><span>Chất lượng</span><span className={lightsOff ? 'text-white' : 'text-slate-900 dark:text-white'}>{movieWithEpisodes.quality}</span></div>
                <div className="flex justify-between gap-3"><span>Số tập</span><span className={lightsOff ? 'text-white' : 'text-slate-900 dark:text-white'}>{movieWithEpisodes.totalEpisodes}</span></div>
              </div>
            ) : (
              <div className="py-6 text-center text-slate-400">
                <p className="text-xs">Đang tải thông tin...</p>
              </div>
            )}
          </section>

          <section className={['rounded-[1.75rem] border p-5', lightsOff ? 'border-white/10 bg-white/[0.04]' : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] shadow-sm dark:shadow-none'].join(' ')}>
            <h3 className={['text-base font-bold', lightsOff ? 'text-white' : 'text-slate-900 dark:text-white'].join(' ')}>Mô tả ngắn</h3>
            <p className={['mt-3 text-sm leading-6', lightsOff ? 'text-slate-300' : 'text-slate-600 dark:text-slate-300'].join(' ')}>
              {movieWithEpisodes ? movieWithEpisodes.description : 'Đang tải mô tả...'}
            </p>
          </section>
        </aside>
      </section>

      {movieWithEpisodes ? (
        <CommentSection movieId={movieWithEpisodes.id} />
      ) : (
        <div className="py-10 text-center text-slate-400 rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6">
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-slate-700 border-t-lime-400"></div>
          <p className="mt-2 text-xs">Đang tải bình luận...</p>
        </div>
      )}

      {relatedMovies && relatedMovies.length > 0 ? (
        <MovieRow title="Phim đề xuất" movies={relatedMovies} />
      ) : (
        <div className="py-10 text-center text-slate-500">
          Đang tải danh sách phim đề xuất...
        </div>
      )}

      {reportOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-modal-in">
          <div className="w-full max-w-md rounded-[2rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Báo cáo sự cố phát phim</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Chọn loại lỗi bạn đang gặp phải và chia sẻ thêm mô tả chi tiết.</p>
            
            <div className="mt-4 space-y-2">
              {reportOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setReportReason(option)}
                  className={[
                    'w-full rounded-xl border px-4 py-2.5 text-left text-sm font-semibold transition cursor-pointer',
                    reportReason === option
                      ? 'border-cyan-400 bg-cyan-400/10 text-cyan-500 dark:text-cyan-300'
                      : 'border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10',
                  ].join(' ')}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Custom Detail Input */}
            <div className="mt-4 space-y-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400" htmlFor="report-detail">Mô tả chi tiết (không bắt buộc)</label>
              <textarea
                id="report-detail"
                value={reportDetail}
                disabled={submittingReport}
                onChange={(e) => setReportDetail(e.target.value)}
                placeholder="Nhập thông tin chi tiết lỗi (ví dụ: mất tiếng ở phút thứ 12, phụ đề bị lệch...)"
                rows={3}
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/40 p-3 text-sm text-slate-900 dark:text-white outline-none focus:border-cyan-400 transition resize-none"
              />
            </div>

            <div className="mt-5 flex justify-end gap-2.5">
              <button 
                type="button" 
                disabled={submittingReport}
                onClick={() => {
                  setReportDetail('')
                  setReportOpen(false)
                }} 
                className="rounded-xl border border-slate-200 dark:border-white/15 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition"
              >
                Hủy
              </button>
              <button 
                type="button" 
                disabled={submittingReport}
                onClick={handleSendReport} 
                className="rounded-xl bg-gradient-to-r from-lime-400 to-emerald-400 px-5 py-2 text-sm font-bold text-slate-950 hover:brightness-110 shadow-lg shadow-lime-500/10 transition active:scale-95 disabled:opacity-50"
              >
                {submittingReport ? 'Đang gửi...' : 'Gửi báo lỗi'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
