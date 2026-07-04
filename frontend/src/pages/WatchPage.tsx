import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, ChevronLeft, ChevronRight, Maximize2, MoonStar, Play, Radio, ShieldCheck } from 'lucide-react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { EmptyState } from '../common/EmptyState'
import { CommentSection } from '../components/comments/CommentSection'
import { EpisodeList } from '../components/movies/EpisodeList'
import { MovieRow } from '../components/movies/MovieRow'
import { WatchPlayer } from '../components/movies/WatchPlayer'
import { analyticsService } from '../services/analyticsService'

const reportOptions = ['Không xem được', 'Sai tập', 'Lỗi âm thanh', 'Lỗi phụ đề', 'Khác']

import { useMovieDetail } from '../hooks/useMovieDetail'
import { reportService } from '../services/reportService'

export function WatchPage() {
  const { slug } = useParams()
  const [params] = useSearchParams()
  const { movie, relatedMovies, loading } = useMovieDetail(slug)
  const [lightsOff, setLightsOff] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [reportReason, setReportReason] = useState(reportOptions[0])

  useEffect(() => {
    if (movie) {
      analyticsService.trackVisit(`/watch/${movie.slug}`)
      analyticsService.trackView(movie.id)
    }
  }, [movie])

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-lime-400"></div>
        <p className="mt-3 text-sm">Đang tải phim...</p>
      </div>
    )
  }

  if (!movie) {
    return (
      <EmptyState
        title="Không tìm thấy phim"
        description="Phim này chưa tồn tại hoặc hiện không được phát hành."
        actionLabel="Về trang phim"
        actionTo="/movies"
      />
    )
  }

  const requestedEpisode = Number(params.get('episode') ?? '1')
  const activeEpisode = movie.episodes.find((episode) => episode.episodeNumber === requestedEpisode) ?? movie.episodes[0]
  const activeIndex = movie.episodes.findIndex((episode) => episode.episodeNumber === activeEpisode.episodeNumber)
  const prevEpisode = movie.episodes[Math.max(activeIndex - 1, 0)]
  const nextEpisode = movie.episodes[Math.min(activeIndex + 1, movie.episodes.length - 1)]
  const watchedEpisodes = useMemo(
    () => movie.episodes.filter((episode) => episode.episodeNumber < activeEpisode.episodeNumber).map((episode) => episode.episodeNumber),
    [movie.episodes, activeEpisode.episodeNumber],
  )

  const handleSendReport = async () => {
    try {
      await reportService.createReport(movie.id, reportReason, 'Người dùng báo cáo lỗi từ giao diện xem phim.')
      alert('Đã gửi báo cáo lỗi thành công!')
    } catch (err) {
      alert('Gửi báo cáo thất bại: ' + (err instanceof Error ? err.message : String(err)))
    } finally {
      setReportOpen(false)
    }
  }

  return (
    <div className={lightsOff ? 'space-y-8 rounded-[2rem] bg-slate-950/95 p-4 text-white' : 'space-y-8'}>
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          <div className={lightsOff ? 'rounded-[1.75rem] bg-black/80 p-4' : 'rounded-[1.75rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] p-4 shadow-xl dark:shadow-none'}>
            <WatchPlayer episode={activeEpisode} dimmed={lightsOff} />
          </div>

          <div className={['flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border p-4', lightsOff ? 'border-white/10 bg-slate-950/80' : 'border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950/80 shadow-sm dark:shadow-none'].join(' ')}>
            <div>
              <p className={['text-xs font-semibold uppercase tracking-[0.2em]', lightsOff ? 'text-cyan-300' : 'text-cyan-600 dark:text-cyan-300'].join(' ')}>Đang xem tập {activeEpisode.episodeNumber}</p>
              <h1 className={['mt-1 text-2xl font-bold sm:text-3xl', lightsOff ? 'text-white' : 'text-slate-900 dark:text-white'].join(' ')}>{movie.title}</h1>
              <p className={['mt-1 text-sm', lightsOff ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'].join(' ')}>{movie.originalTitle}</p>
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
                onClick={() => setReportOpen(true)}
                className={['inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition', lightsOff ? 'border-white/10 text-white bg-white/5 hover:bg-white/10' : 'border-slate-200 dark:border-white/10 text-slate-700 dark:text-white bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'].join(' ')}
              >
                <AlertTriangle className="h-4 w-4" />
                Báo lỗi phim
              </button>
              <button
                type="button"
                className={['inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition', lightsOff ? 'border-white/10 text-white bg-white/5 hover:bg-white/10' : 'border-slate-200 dark:border-white/10 text-slate-700 dark:text-white bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'].join(' ')}
              >
                <ShieldCheck className="h-4 w-4" />
                Theo dõi phim
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              to={`/watch/${movie.slug}?episode=${prevEpisode.episodeNumber}`}
              className={['inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition', lightsOff ? 'border-white/10 bg-white/5 text-white hover:bg-white/10' : 'border-slate-200 dark:border-white/10 bg-black/5 dark:bg-white/5 text-slate-700 dark:text-white hover:bg-black/10 dark:hover:bg-white/10'].join(' ')}
            >
              <ChevronLeft className="h-4 w-4" />
              Tập trước
            </Link>
            <Link
              to={`/watch/${movie.slug}?episode=${nextEpisode.episodeNumber}`}
              className={['inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition', lightsOff ? 'border-white/10 bg-white/5 text-white hover:bg-white/10' : 'border-slate-200 dark:border-white/10 bg-black/5 dark:bg-white/5 text-slate-700 dark:text-white hover:bg-black/10 dark:hover:bg-white/10'].join(' ')}
            >
              Tập sau
              <ChevronRight className="h-4 w-4" />
            </Link>
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
            <EpisodeList movie={movie} activeEpisode={activeEpisode.episodeNumber} watchedEpisodes={watchedEpisodes} />
          </section>
        </div>

        <aside className="space-y-4">
          <section className={['rounded-[1.75rem] border p-5', lightsOff ? 'border-white/10 bg-slate-950/80' : 'border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950/80 shadow-sm dark:shadow-none'].join(' ')}>
            <h3 className={['text-base font-bold', lightsOff ? 'text-white' : 'text-slate-900 dark:text-white'].join(' ')}>Thông tin phim</h3>
            <div className={['mt-4 space-y-3 text-sm', lightsOff ? 'text-slate-300' : 'text-slate-600 dark:text-slate-300'].join(' ')}>
              <div className="flex justify-between gap-3"><span>Thể loại</span><span className={lightsOff ? 'text-white' : 'text-slate-900 dark:text-white'}>{movie.genres.join(', ')}</span></div>
              <div className="flex justify-between gap-3"><span>Quốc gia</span><span className={lightsOff ? 'text-white' : 'text-slate-900 dark:text-white'}>{movie.country}</span></div>
              <div className="flex justify-between gap-3"><span>Năm</span><span className={lightsOff ? 'text-white' : 'text-slate-900 dark:text-white'}>{movie.year}</span></div>
              <div className="flex justify-between gap-3"><span>Chất lượng</span><span className={lightsOff ? 'text-white' : 'text-slate-900 dark:text-white'}>{movie.quality}</span></div>
              <div className="flex justify-between gap-3"><span>Số tập</span><span className={lightsOff ? 'text-white' : 'text-slate-900 dark:text-white'}>{movie.totalEpisodes}</span></div>
            </div>
          </section>

          <section className={['rounded-[1.75rem] border p-5', lightsOff ? 'border-white/10 bg-white/[0.04]' : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] shadow-sm dark:shadow-none'].join(' ')}>
            <h3 className={['text-base font-bold', lightsOff ? 'text-white' : 'text-slate-900 dark:text-white'].join(' ')}>Mô tả ngắn</h3>
            <p className={['mt-3 text-sm leading-6', lightsOff ? 'text-slate-300' : 'text-slate-600 dark:text-slate-300'].join(' ')}>{movie.description}</p>
          </section>
        </aside>
      </section>

      <CommentSection movieId={movie.id} />
      <MovieRow title="Phim đề xuất" movies={relatedMovies} />

      {reportOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-[1.75rem] border border-white/10 bg-slate-950 p-5 shadow-2xl shadow-black/40">
            <h3 className="text-lg font-bold text-white">Báo lỗi phim</h3>
            <div className="mt-4 space-y-2">
              {reportOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setReportReason(option)}
                  className={[
                    'w-full rounded-xl border px-4 py-3 text-left text-sm transition',
                    reportReason === option
                      ? 'border-cyan-300/40 bg-cyan-300/10 text-cyan-100'
                      : 'border-white/10 bg-white/5 text-white hover:bg-white/10',
                  ].join(' ')}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setReportOpen(false)} className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white">
                Hủy
              </button>
              <button type="button" onClick={handleSendReport} className="rounded-xl bg-lime-400 px-4 py-2 text-sm font-bold text-slate-950">
                Gửi báo lỗi
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
