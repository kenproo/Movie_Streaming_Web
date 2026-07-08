import { useEffect, useMemo, useState } from 'react'
import { AdminTable } from '../components/admin/AdminTable'
import { Pagination } from '../components/common/Pagination'
import { commentService } from '../services/commentService'
import { Badge } from '../common/Badge'

export function AdminCommentsPage() {
  const [filter, setFilter] = useState('')
  const [page, setPage] = useState(1)
  const [comments, setComments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    // getAllCommentsForAdmin returns [] synchronously or asynchronously, let's wrap it in Promise.resolve
    Promise.resolve(commentService.getAllCommentsForAdmin())
      .then((data) => {
        if (active) setComments(data)
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const filtered = useMemo(
    () => comments.filter((comment) => (!filter ? true : comment.status === filter)),
    [comments, filter],
  )

  const itemsPerPage = 10
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage))
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-lime-400"></div>
        <p className="mt-3 text-sm">Đang tải danh sách bình luận...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Quản lý comment</p>
        <h1 className="mt-2 text-2xl font-black text-white">Comment mới / bị report</h1>
      </section>

      <select value={filter} onChange={(event) => { setFilter(event.target.value); setPage(1) }} className="rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none">
        <option value="">Tất cả</option>
        <option value="visible">Đang hiển thị</option>
        <option value="hidden">Đã ẩn</option>
      </select>

      <AdminTable headers={['Người bình luận', 'Nội dung', 'Ngày tạo', 'Trạng thái', 'Report']}>
        {paginated.map((comment) => (
          <tr key={comment.id}>
            <td className="px-4 py-3">{comment.userName}</td>
            <td className="px-4 py-3 text-slate-300">{comment.content}</td>
            <td className="px-4 py-3 text-slate-400">{new Date(comment.createdAt).toLocaleString('vi-VN')}</td>
            <td className="px-4 py-3"><Badge>{comment.status}</Badge></td>
            <td className="px-4 py-3">{comment.reports ?? 0}</td>
          </tr>
        ))}
      </AdminTable>

      <Pagination currentPage={page} totalPages={totalPages} onPrev={() => setPage((current) => Math.max(1, current - 1))} onNext={() => setPage((current) => Math.min(totalPages, current + 1))} />
    </div>
  )
}
