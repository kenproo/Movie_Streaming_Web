import { useEffect, useState } from 'react'
import { ChartColumn, Clapperboard, Eye, MessageSquare, TriangleAlert, Users } from 'lucide-react'
import { adminService } from '../services/adminService'
import { analyticsService } from '../services/analyticsService'
import { movieService } from '../services/movieService'
import { reportService } from '../services/reportService'
import { StatCard } from '../components/admin/StatCard'
import { Badge } from '../common/Badge'
import { notificationApi } from '../api/notificationApi'

export function AdminDashboardPage() {
  const [summary, setSummary] = useState<any>()
  const [topMovies, setTopMovies] = useState<any[]>([])
  const [reports, setReports] = useState<any[]>([])
  const [traffic, setTraffic] = useState<any[]>([])
  const [movies, setMovies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [broadcastTitle, setBroadcastTitle] = useState('')
  const [broadcastContent, setBroadcastContent] = useState('')
  const [broadcastUrl, setBroadcastUrl] = useState('')
  const [sendingBroadcast, setSendingBroadcast] = useState(false)

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!broadcastTitle.trim() || !broadcastContent.trim()) return

    setSendingBroadcast(true)
    try {
      await notificationApi.broadcastNotification(
        broadcastTitle.trim(),
        broadcastContent.trim(),
        broadcastUrl.trim() || undefined
      )
      alert('Đã gửi thông báo hệ thống thành công đến toàn bộ thành viên!')
      setBroadcastTitle('')
      setBroadcastContent('')
      setBroadcastUrl('')
    } catch (err) {
      alert('Gửi thông báo thất bại: ' + (err instanceof Error ? err.message : String(err)))
    } finally {
      setSendingBroadcast(false)
    }
  }

  useEffect(() => {
    let active = true
    setLoading(true)

    Promise.all([
      adminService.getDashboardSummary(),
      analyticsService.getTopMovies(),
      reportService.getReports(),
      analyticsService.getDailyTraffic(),
      movieService.getMovies(),
    ])
      .then(([summaryData, topMoviesData, reportsData, trafficData, moviesData]) => {
        if (active) {
          setSummary(summaryData)
          setTopMovies(topMoviesData.slice(0, 5))
          setReports(reportsData)
          setTraffic(trafficData.slice(-7))
          setMovies(moviesData)
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  if (loading || !summary) {
    return (
      <div className="py-20 text-center text-slate-400">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-lime-400"></div>
        <p className="mt-3 text-sm">Đang tải dữ liệu dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Admin</p>
        <h1 className="mt-2 text-2xl font-black text-white">Dashboard</h1>
        <p className="mt-2 text-sm text-slate-300">Tổng quan dữ liệu mock hiện tại, đã sẵn đường để chuyển sang API sau này.</p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Tổng số phim" value={summary.totalMovies} icon={<Clapperboard className="h-4 w-4 text-cyan-300" />} />
        <StatCard title="Tổng lượt xem" value={summary.totalViews.toLocaleString('vi-VN')} icon={<Eye className="h-4 w-4 text-cyan-300" />} />
        <StatCard title="Số user" value={summary.totalUsers} icon={<Users className="h-4 w-4 text-cyan-300" />} />
        <StatCard title="Số comment" value={summary.totalComments} icon={<MessageSquare className="h-4 w-4 text-cyan-300" />} />
        <StatCard title="Báo lỗi chưa xử lý" value={summary.pendingReports} icon={<TriangleAlert className="h-4 w-4 text-amber-300" />} />
      </div>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Lượt xem theo ngày</h2>
            <ChartColumn className="h-5 w-5 text-cyan-300" />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-7">
            {traffic.map((item) => (
              <div key={item.date} className="rounded-xl border border-white/10 bg-slate-950/70 p-3">
                <p className="text-xs text-slate-400">{item.date}</p>
                <p className="mt-2 text-sm font-semibold text-white">{item.views.toLocaleString('vi-VN')}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <h2 className="text-lg font-bold text-white">Tỉ lệ phim</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <div className="flex items-center justify-between"><span>Phim lẻ</span><span>{movies.filter((movie) => movie.type === 'single').length}</span></div>
            <div className="flex items-center justify-between"><span>Phim bộ</span><span>{movies.filter((movie) => movie.type === 'series').length}</span></div>
            <div className="flex items-center justify-between"><span>Anime</span><span>{movies.filter((movie) => movie.type === 'anime').length}</span></div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <h2 className="text-lg font-bold text-white">Top phim xem nhiều</h2>
          <div className="mt-4 space-y-3">
            {topMovies.map((movie, index) => (
              <div key={movie.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-white">{index + 1}. {movie.title}</p>
                  <p className="text-xs text-slate-400">{movie.year} - {movie.country}</p>
                </div>
                <Badge>{movie.type}</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <h2 className="text-lg font-bold text-white">Báo lỗi gần đây</h2>
          <div className="mt-4 space-y-3">
            {reports.slice(0, 4).map((report) => (
              <div key={report.id} className="rounded-xl border border-white/10 bg-slate-950/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-white">{report.movieTitle}</p>
                  <Badge>{report.status}</Badge>
                </div>
                <p className="mt-2 text-sm text-slate-400">{report.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
        <h2 className="text-lg font-bold text-white">Tổng kết user</h2>
        <p className="mt-2 text-sm text-slate-300">Tổng user hiện tại: {summary.totalUsers}</p>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
        <h2 className="text-lg font-bold text-white">Gửi thông báo hệ thống</h2>
        <p className="mt-1 text-xs text-slate-400">Thông báo này sẽ được gửi tới tất cả người dùng đăng nhập hệ thống.</p>
        
        <form onSubmit={handleBroadcast} className="mt-4 space-y-4 max-w-xl">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400" htmlFor="broadcast-title">Tiêu đề thông báo</label>
            <input
              id="broadcast-title"
              type="text"
              required
              value={broadcastTitle}
              onChange={(e) => setBroadcastTitle(e.target.value)}
              placeholder="Ví dụ: Bảo trì hệ thống hoặc Ra mắt phim mới..."
              className="w-full rounded-xl border border-white/10 bg-slate-950/50 p-3 text-sm text-white outline-none focus:border-cyan-400 transition"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400" htmlFor="broadcast-content">Nội dung chi tiết</label>
            <textarea
              id="broadcast-content"
              required
              rows={3}
              value={broadcastContent}
              onChange={(e) => setBroadcastContent(e.target.value)}
              placeholder="Nhập nội dung thông báo cho mọi người..."
              className="w-full rounded-xl border border-white/10 bg-slate-950/50 p-3 text-sm text-white outline-none focus:border-cyan-400 transition resize-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400" htmlFor="broadcast-url">Đường dẫn liên kết (Không bắt buộc)</label>
            <input
              id="broadcast-url"
              type="text"
              value={broadcastUrl}
              onChange={(e) => setBroadcastUrl(e.target.value)}
              placeholder="Ví dụ: /movies hoặc /movie/slug-phim"
              className="w-full rounded-xl border border-white/10 bg-slate-950/50 p-3 text-sm text-white outline-none focus:border-cyan-400 transition"
            />
          </div>
          <button
            type="submit"
            disabled={sendingBroadcast}
            className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:brightness-110 shadow-lg px-5 py-2.5 text-sm font-bold text-white transition active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {sendingBroadcast ? 'Đang gửi...' : 'Gửi thông báo đến mọi người'}
          </button>
        </form>
      </section>
    </div>
  )
}
