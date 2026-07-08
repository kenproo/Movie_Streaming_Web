import { Link, NavLink } from 'react-router-dom'
import { ArrowLeft, ChartColumn, Film, FlagTriangleRight, LayoutDashboard, MessageSquare, PlusCircle, Users, X } from 'lucide-react'
import logo from '../../assets/logo.jpg'

const items = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard },
  { label: 'Quản lý phim', to: '/admin/movies', icon: Film },
  { label: 'Thêm phim', to: '/admin/movies/create', icon: PlusCircle },
  { label: 'Bình luận', to: '/admin/comments', icon: MessageSquare },
  { label: 'Báo lỗi phim', to: '/admin/reports', icon: FlagTriangleRight },
  { label: 'Người dùng', to: '/admin/users', icon: Users },
  { label: 'Thống kê truy cập', to: '/admin/analytics', icon: ChartColumn },
]

type AdminSidebarProps = {
  mobileOpen?: boolean
  onClose?: () => void
}

export function AdminSidebar({ mobileOpen = false, onClose }: AdminSidebarProps) {
  return (
    <>
      {mobileOpen ? <button type="button" onClick={onClose} className="fixed inset-0 z-40 bg-black/70 lg:hidden" aria-label="Đóng menu admin" /> : null}
      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 w-72 shrink-0 border-r border-white/10 bg-slate-950 px-4 py-5 transition-transform lg:sticky lg:top-0 lg:flex lg:flex-col',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
        <div className="mb-6 flex items-center justify-between gap-3 lg:hidden">
          <Link to="/admin" onClick={onClose} className="flex items-center gap-2 text-lg font-bold text-white">
            <img src={logo} alt="ChillFilm Logo" className="h-10 w-10 rounded-xl object-cover" />
            ChillFilm Admin
          </Link>
          <button type="button" onClick={onClose} className="rounded-xl border border-white/10 bg-white/5 p-2 text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <Link to="/admin" className="mb-6 hidden items-center gap-2 text-lg font-bold text-white lg:flex">
          <img src={logo} alt="ChillFilm Logo" className="h-10 w-10 rounded-xl object-cover" />
          ChillFilm Admin
        </Link>

        <nav className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/admin'}
                onClick={onClose}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition',
                    isActive ? 'bg-cyan-400/10 text-cyan-300' : 'text-slate-300 hover:bg-white/5 hover:text-white',
                  ].join(' ')
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            )
          })}
          <Link to="/" onClick={onClose} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Về trang người dùng
          </Link>
        </nav>
      </aside>
    </>
  )
}
