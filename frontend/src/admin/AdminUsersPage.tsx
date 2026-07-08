import { useEffect, useState } from 'react'
import { AdminTable } from '../components/admin/AdminTable'
import { userService } from '../services/userService'
import { Badge } from '../common/Badge'

export function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    userService.getUsers()
      .then((data) => {
        if (active) setUsers(data)
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
        <p className="mt-3 text-sm">Đang tải danh sách người dùng...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Người dùng</p>
        <h1 className="mt-2 text-2xl font-black text-white">Danh sách user</h1>
      </section>

      <AdminTable headers={['Avatar', 'Tên', 'Email', 'Role', 'Trạng thái']}>
        {users.map((user) => (
          <tr key={user.id}>
            <td className="px-4 py-3">
              <img src={user.avatarUrl} alt={user.name} className="h-10 w-10 rounded-xl object-cover" />
            </td>
            <td className="px-4 py-3 text-white">{user.name}</td>
            <td className="px-4 py-3 text-slate-300">{user.email}</td>
            <td className="px-4 py-3"><Badge>{user.role}</Badge></td>
            <td className="px-4 py-3"><Badge>{user.status}</Badge></td>
          </tr>
        ))}
      </AdminTable>
    </div>
  )
}
