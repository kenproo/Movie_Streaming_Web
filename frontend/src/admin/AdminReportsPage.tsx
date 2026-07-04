import { useEffect, useState } from 'react'
import { AdminTable } from '../components/admin/AdminTable'
import { Badge } from '../common/Badge'
import { reportService } from '../services/reportService'

export function AdminReportsPage() {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    reportService.getReports()
      .then((data) => {
        if (active) setReports(data)
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-lime-400"></div>
        <p className="mt-3 text-sm">Đang tải danh sách báo cáo...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Báo lỗi phim</p>
        <h1 className="mt-2 text-2xl font-black text-white">Danh sách lỗi người dùng gửi</h1>
      </section>

      <AdminTable headers={['Phim', 'Người gửi', 'Lý do', 'Trạng thái', 'Cập nhật']}>
        {reports.map((report) => (
          <tr key={report.id}>
            <td className="px-4 py-3 text-white">{report.movieTitle}</td>
            <td className="px-4 py-3 text-slate-300">{report.reporterName}</td>
            <td className="px-4 py-3 text-slate-300">{report.reason}</td>
            <td className="px-4 py-3"><Badge>{report.status}</Badge></td>
            <td className="px-4 py-3 text-slate-400">{new Date(report.updatedAt).toLocaleString('vi-VN')}</td>
          </tr>
        ))}
      </AdminTable>
    </div>
  )
}
