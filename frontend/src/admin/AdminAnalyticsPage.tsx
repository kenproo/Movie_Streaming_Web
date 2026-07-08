import { useEffect, useState } from 'react'
import { analyticsService } from '../services/analyticsService'
import { AdminTable } from '../components/admin/AdminTable'

export function AdminAnalyticsPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [traffic, setTraffic] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)

    Promise.all([
      analyticsService.getAccessLogs(),
      analyticsService.getDailyTraffic(),
    ])
      .then(([logsData, trafficData]) => {
        if (active) {
          setLogs(logsData)
          setTraffic(trafficData)
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

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-lime-400"></div>
        <p className="mt-3 text-sm">Đang tải dữ liệu truy cập...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Thống kê truy cập</p>
        <h1 className="mt-2 text-2xl font-black text-white">Analytics mock</h1>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <h2 className="text-lg font-bold text-white">Traffic 7 ngày</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-7">
            {traffic.slice(-7).map((item) => (
              <div key={item.date} className="rounded-xl border border-white/10 bg-slate-950/70 p-3">
                <p className="text-xs text-slate-400">{item.date}</p>
                <p className="mt-2 text-sm font-semibold text-white">{item.visits}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <h2 className="text-lg font-bold text-white">Top access log</h2>
          <div className="mt-4 space-y-2 text-sm text-slate-300">
            {logs.slice(0, 5).map((log) => (
              <p key={log.id} className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3">{log.action} - {log.page}</p>
            ))}
          </div>
        </div>
      </section>

      <AdminTable headers={['Page', 'Action', 'Keyword', 'Time']}>
        {logs.slice(0, 10).map((log) => (
          <tr key={log.id}>
            <td className="px-4 py-3">{log.page}</td>
            <td className="px-4 py-3">{log.action}</td>
            <td className="px-4 py-3">{log.keyword ?? '-'}</td>
            <td className="px-4 py-3">{new Date(log.createdAt).toLocaleString('vi-VN')}</td>
          </tr>
        ))}
      </AdminTable>
    </div>
  )
}
