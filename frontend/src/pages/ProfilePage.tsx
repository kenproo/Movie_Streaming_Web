import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { formatDate } from '../utils/format'

export function ProfilePage() {
  const { currentUser, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/', { replace: true })
  }

  if (!currentUser) return null

  return (
    <section className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <img
          src={currentUser.avatarUrl}
          alt={currentUser.name}
          className="h-24 w-24 rounded-2xl border border-white/10 object-cover"
        />
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Hồ sơ</p>
          <h1 className="mt-2 text-3xl font-bold text-white">{currentUser.name}</h1>
          <p className="mt-1 text-slate-400">{currentUser.email}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Vai trò</p>
          <p className="mt-1 font-semibold text-white">{isAdmin ? 'Admin' : 'User'}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Trạng thái</p>
          <p className="mt-1 font-semibold text-lime-300">{currentUser.status}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 sm:col-span-2">
          <p className="text-xs uppercase tracking-wide text-slate-500">Ngày tạo</p>
          <p className="mt-1 font-semibold text-white">{formatDate(currentUser.createdAt)}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-8 rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-white hover:bg-white/10"
      >
        Đăng xuất
      </button>
    </section>
  )
}
