import { useEffect, useMemo, useState } from 'react'
import { Search, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AdminTable } from '../components/admin/AdminTable'
import { ConfirmModal } from '../common/ConfirmModal'
import { Pagination } from '../components/common/Pagination'
import { adminMovieService } from '../services/adminMovieService'
import type { Movie } from '../types/movie'
import { formatViews } from '../utils/format'

export function AdminMoviesPage() {
  const [query, setQuery] = useState('')
  const [type, setType] = useState('')
  const [deleteMovie, setDeleteMovie] = useState<Movie | null>(null)
  const [page, setPage] = useState(1)
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    adminMovieService.getAdminMovies()
      .then((data) => {
        if (active) setMovies(data)
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [refreshKey])

  const filtered = useMemo(() => {
    return movies.filter((movie) => {
      const matchesQuery =
        !query ||
        movie.title.toLowerCase().includes(query.toLowerCase()) ||
        movie.originalTitle.toLowerCase().includes(query.toLowerCase())
      const matchesType = !type || movie.type === type
      return matchesQuery && matchesType
    })
  }, [movies, query, type])

  const itemsPerPage = 10
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage))
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  const handleDelete = async () => {
    if (!deleteMovie) return
    try {
      await adminMovieService.deleteMovie(deleteMovie.id)
      setRefreshKey((k) => k + 1)
    } catch (err) {
      alert('Xóa phim thất bại: ' + (err instanceof Error ? err.message : String(err)))
    } finally {
      setDeleteMovie(null)
    }
  }

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-lime-400"></div>
        <p className="mt-3 text-sm">Đang tải danh sách phim...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Quản lý phim</p>
            <h1 className="mt-2 text-2xl font-black text-white">Danh sách phim</h1>
          </div>
          <Link to="/admin/movies/create" className="inline-flex items-center justify-center rounded-xl bg-lime-400 px-4 py-2 text-sm font-bold text-slate-950">
            Thêm phim
          </Link>
        </div>
      </section>

      <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 md:grid-cols-[1fr_220px]">
        <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2">
          <Search className="h-4 w-4 text-slate-400" />
          <input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1) }} placeholder="Tìm kiếm phim..." className="w-full bg-transparent text-sm text-white outline-none" />
        </label>
        <select value={type} onChange={(event) => { setType(event.target.value); setPage(1) }} className="rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none">
          <option value="">Tất cả loại phim</option>
          <option value="single">Phim lẻ</option>
          <option value="series">Phim bộ</option>
          <option value="anime">Anime</option>
        </select>
      </div>

      <p className="text-sm text-slate-300">Tìm thấy <span className="text-cyan-300">{filtered.length}</span> phim</p>

      <AdminTable headers={['Poster', 'Tên phim', 'Loại', 'Năm', 'Views', 'Trạng thái', 'Hành động']}>
        {paginated.map((movie) => (
          <tr key={movie.id} className="align-top">
            <td className="px-4 py-3">
              <img src={movie.posterUrl} alt={movie.title} className="h-20 w-14 rounded-lg object-cover" />
            </td>
            <td className="px-4 py-3">
              <p className="font-semibold text-white">{movie.title}</p>
              <p className="text-xs text-slate-400">{movie.originalTitle}</p>
            </td>
            <td className="px-4 py-3 capitalize">{movie.type}</td>
            <td className="px-4 py-3">{movie.year}</td>
            <td className="px-4 py-3">{formatViews(movie.views)}</td>
            <td className="px-4 py-3">{movie.status}</td>
            <td className="px-4 py-3">
              <div className="flex gap-2">
                <Link to={`/admin/movies/edit/${movie.id}`} className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-white">Sửa</Link>
                <button type="button" onClick={() => setDeleteMovie(movie)} className="rounded-lg border border-red-400/20 px-3 py-2 text-xs font-semibold text-red-200">
                  <Trash2 className="inline h-3.5 w-3.5" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>

      <Pagination currentPage={page} totalPages={totalPages} onPrev={() => setPage((current) => Math.max(1, current - 1))} onNext={() => setPage((current) => Math.min(totalPages, current + 1))} />

      <ConfirmModal
        open={Boolean(deleteMovie)}
        title="Xóa phim"
        description={`Xác nhận xóa phim ${deleteMovie?.title ?? ''}?`}
        onCancel={() => setDeleteMovie(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
