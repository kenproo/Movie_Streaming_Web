import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, LibraryBig, LogOut, Menu, Moon, Search, Shield, Sun, UserRound, X, Bell, CheckCheck } from 'lucide-react'
import logo from '../assets/logo.jpg'
import { Button } from '../common/Button'
import { SearchDropdown } from '../components/movies/SearchDropdown'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useDebounce } from '../hooks/useDebounce'
import { movieService } from '../services/movieService'
import type { Movie } from '../types/movie'
import { notificationApi, type NotificationItem } from '../api/notificationApi'

const navItems = [
  { label: 'Trang chủ', to: '/' },
  { label: 'Phim lẻ', to: '/movies/single' },
  { label: 'Phim bộ', to: '/movies/series' },
  { label: 'Anime', to: '/movies/anime' },
  { label: 'Thể loại', to: '/movies?tab=genre' },
  { label: 'Quốc gia', to: '/movies?tab=country' },
  { label: 'Lịch chiếu', to: '/movies?tab=schedule' },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser, isAuthenticated, isAdmin, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const debouncedQuery = useDebounce(query, 300)

  const isAdminPage = useMemo(() => location.pathname.startsWith('/admin'), [location.pathname])
  const [searchResults, setSearchResults] = useState<Movie[]>([])

  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifOpen, setNotifOpen] = useState(false)

  const fetchNotifications = () => {
    if (!isAuthenticated) return
    notificationApi.getMyNotifications()
      .then((data) => setNotifications(data ?? []))
      .catch((err) => console.error(err))
    notificationApi.getUnreadCount()
      .then((count) => setUnreadCount(count ?? 0))
      .catch((err) => console.error(err))
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications()
      const interval = setInterval(() => {
        notificationApi.getUnreadCount()
          .then((count) => setUnreadCount(count ?? 0))
          .catch((err) => console.error(err))
      }, 30000)
      return () => clearInterval(interval)
    } else {
      setNotifications([])
      setUnreadCount(0)
    }
  }, [isAuthenticated])

  const handleOpenNotifications = () => {
    setNotifOpen((prev) => !prev)
    setUserMenuOpen(false)
    if (!notifOpen) {
      fetchNotifications()
    }
  }

  const handleNotifClick = async (notif: NotificationItem) => {
    setNotifOpen(false)
    if (!notif.read) {
      try {
        await notificationApi.markAsRead(notif.id)
        setUnreadCount((c) => Math.max(0, c - 1))
        setNotifications((prev) => prev.map((n) => n.id === notif.id ? { ...n, read: true } : n))
      } catch (err) {
        console.error(err)
      }
    }
    if (notif.targetUrl) {
      navigate(notif.targetUrl)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead()
      setUnreadCount(0)
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    } catch (err) {
      console.error(err)
    }
  }

  const renderNotifications = () => {
    if (!isAuthenticated) return null
    return (
      <div className="relative">
        <button
          type="button"
          onClick={handleOpenNotifications}
          className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-black/5 dark:bg-white/5 text-app-primary transition hover:-translate-y-0.5 hover:bg-black/10 dark:hover:bg-white/10 accent-ring cursor-pointer"
          title="Thông báo"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {notifOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-2xl p-2 z-40 animate-dropdown-in">
              <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-white/5">
                <p className="text-xs font-bold text-app-primary">Thông báo</p>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllAsRead}
                    className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck className="h-3 w-3" />
                    Đọc tất cả
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto py-1 scrollbar-thin">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <button
                      key={notif.id}
                      type="button"
                      onClick={() => handleNotifClick(notif)}
                      className={`w-full text-left flex gap-3.5 px-3 py-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition border-b border-slate-50 dark:border-white/5 last:border-b-0 cursor-pointer ${
                        !notif.read ? 'bg-cyan-500/5' : ''
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-1">
                          <p className={`text-xs truncate font-bold ${!notif.read ? 'text-cyan-600 dark:text-cyan-400' : 'text-app-primary'}`}>{notif.title}</p>
                          {!notif.read && <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 shrink-0 mt-1.5" />}
                        </div>
                        <p className="text-[11px] text-app-secondary line-clamp-2 mt-0.5 leading-relaxed">{notif.message}</p>
                        <p className="text-[9px] text-app-muted mt-1.5">{new Date(notif.createdAt).toLocaleDateString('vi-VN', {hour: '2-digit', minute:'2-digit'})}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="py-8 text-center text-xs text-app-muted">
                    Không có thông báo nào.
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    )
  }
  useEffect(() => {
    const trimmed = debouncedQuery.trim()
    if (!trimmed) {
      setSearchResults([])
      return
    }
    movieService.searchAllMovies(trimmed)
      .then((data) => setSearchResults(data))
      .catch((err) => console.error(err))
  }, [debouncedQuery])

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    setSearchOpen(false)
    setMobileOpen(false)
  }

  const handleLogout = async () => {
    await logout()
    setMobileOpen(false)
    navigate('/')
  }

  const renderThemeToggle = () => (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-black/5 dark:bg-white/5 text-app-primary transition hover:-translate-y-0.5 hover:bg-black/10 dark:hover:bg-white/10 accent-ring"
      aria-label={theme === 'dark' ? 'Chuyển sang light mode' : 'Chuyển sang dark mode'}
      title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
    >
      {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-300" /> : <Moon className="h-4 w-4 text-cyan-700" />}
    </button>
  )

  const renderAuthActions = () =>
    isAuthenticated && currentUser ? (
      <div className="relative">
        <button
          type="button"
          onClick={() => setUserMenuOpen((value) => !value)}
          className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3.5 py-2 text-sm font-semibold text-app-primary hover:bg-black/10 dark:hover:bg-white/10 transition outline-none"
        >
          <img src={currentUser.avatarUrl} alt="" className="h-5 w-5 rounded-full object-cover ring-1 ring-cyan-500/30" />
          <span>{currentUser.name}</span>
        </button>

        {userMenuOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setUserMenuOpen(false)} />
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-2xl p-2 z-40 animate-dropdown-in">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-white/5">
                <p className="text-[11px] text-app-muted font-semibold uppercase tracking-[0.05em]">Tài khoản</p>
                <p className="text-sm font-bold text-app-primary truncate mt-0.5">{currentUser.name}</p>
                <p className="text-xs text-app-muted truncate">{currentUser.email}</p>
              </div>
              <div className="py-1">
                <Link
                  to="/profile"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-app-secondary hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition"
                >
                  <UserRound className="h-4 w-4" />
                  Trang cá nhân
                </Link>
                <Link
                  to="/library"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-app-secondary hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition"
                >
                  <LibraryBig className="h-4 w-4" />
                  Tủ phim của tôi
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-app-secondary hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Admin Dashboard
                  </Link>
                )}
              </div>
              <div className="border-t border-slate-100 dark:border-white/5 pt-1 mt-1">
                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen(false)
                    handleLogout()
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-xl transition font-semibold text-left"
                >
                  <LogOut className="h-4 w-4" />
                  Đăng xuất
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    ) : (
      <>
        <Button variant="ghost" to="/login" icon={<UserRound className="h-4 w-4" />}>
          Đăng nhập
        </Button>
        <Button variant="primary" to="/register" icon={<Shield className="h-4 w-4" />}>
          Đăng ký
        </Button>
      </>
    )

  return (
    <header className="app-header sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1600px] items-center gap-3 px-4 py-3 sm:px-6 lg:px-10 xl:px-16">
        <Link to="/" className="group relative flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-500 p-[1.5px] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20" aria-label="ChillFilm Home">
          <img src={logo} alt="ChillFilm Logo" width={56} height={56} className="h-14 w-14 rounded-[14px] object-cover bg-slate-950" />
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center gap-1.5 2xl:gap-4 xl:flex xl:ml-3 2xl:ml-8">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => {
                let isTabActive = isActive
                if (item.to.startsWith('/movies?tab=')) {
                  const tabName = item.to.split('tab=')[1]
                  const hasTabParam = location.search.includes('tab=')
                  isTabActive =
                    location.pathname === '/movies' &&
                    (location.search.includes(`tab=${tabName}`) || (tabName === 'genre' && !hasTabParam))
                }
                return [
                  'whitespace-nowrap rounded-xl px-2.5 py-2 text-sm xl:text-[13px] xl:px-2 2xl:text-[15px] 2xl:px-4 font-bold transition',
                  isTabActive
                    ? 'bg-cyan-500/10 text-cyan-600 dark:bg-cyan-400/10 dark:text-cyan-300'
                    : 'text-app-secondary hover:bg-black/5 dark:hover:bg-white/5 hover:text-app-primary',
                ].join(' ')
              }}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="relative hidden min-w-0 md:flex md:w-[180px] lg:w-[200px] xl:w-[220px] 2xl:w-[380px] ml-auto">
          <form onSubmit={submitSearch} className="flex w-full items-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3 py-1.5 accent-ring">
            <Search className="h-4 w-4 text-app-muted" />
            <input
              value={query}
              onFocus={() => setSearchOpen(true)}
              onChange={(event) => {
                setQuery(event.target.value)
                setSearchOpen(true)
              }}
              placeholder="Tìm kiếm phim, diễn viên..."
              className="w-full bg-transparent text-sm text-app-primary outline-none placeholder:text-app-muted"
            />
          </form>
          <SearchDropdown query={query} movies={searchResults} open={searchOpen} onClose={() => setSearchOpen(false)} />
        </div>

        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          {renderNotifications()}
          {renderThemeToggle()}
          {renderAuthActions()}
          {isAdminPage ? <span className="whitespace-nowrap rounded-full border border-cyan-500/20 dark:border-cyan-400/20 px-3 py-1 text-xs text-cyan-600 dark:text-cyan-300">Admin</span> : null}
        </div>

        <div className="ml-auto flex items-center gap-2 lg:hidden">
          {renderNotifications()}
          {renderThemeToggle()}
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-black/5 dark:bg-white/5 text-app-primary accent-ring"
            aria-label="Mở menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="app-header animate-dropdown-in border-t lg:hidden">
          <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-4 py-4 sm:px-6">
            <form onSubmit={submitSearch} className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3 py-1.5 accent-ring">
              <Search className="h-4 w-4 text-app-muted" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tìm kiếm phim, diễn viên..."
                className="w-full bg-transparent text-sm text-app-primary outline-none placeholder:text-app-muted"
              />
            </form>
            <nav className="grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => {
                    let isTabActive = isActive
                    if (item.to.startsWith('/movies?tab=')) {
                      const tabName = item.to.split('tab=')[1]
                      const hasTabParam = location.search.includes('tab=')
                      isTabActive =
                        location.pathname === '/movies' &&
                        (location.search.includes(`tab=${tabName}`) || (tabName === 'genre' && !hasTabParam))
                    }
                    return [
                      'whitespace-nowrap rounded-xl border px-3 py-2 text-sm font-medium transition',
                      isTabActive
                        ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-300'
                        : 'bg-black/5 dark:bg-white/5 text-app-secondary accent-ring',
                    ].join(' ')
                  }}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="grid gap-2">
              {isAuthenticated && currentUser ? (
                <>
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-white/5 text-app-primary">
                    <p className="text-xs text-app-muted">Đăng nhập với</p>
                    <p className="font-bold">{currentUser.name}</p>
                  </div>
                  <Button variant="ghost" to="/profile" onClick={() => setMobileOpen(false)} icon={<UserRound className="h-4 w-4" />}>
                    Trang cá nhân
                  </Button>
                  <Button variant="ghost" to="/library" onClick={() => setMobileOpen(false)} icon={<LibraryBig className="h-4 w-4" />}>
                    Tủ phim của tôi
                  </Button>
                  {isAdmin ? (
                    <Button variant="ghost" to="/admin" onClick={() => setMobileOpen(false)} icon={<LayoutDashboard className="h-4 w-4" />}>
                      Admin Dashboard
                    </Button>
                  ) : null}
                  <Button variant="ghost" onClick={handleLogout} icon={<LogOut className="h-4 w-4" />}>
                    Đăng xuất
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" to="/login" onClick={() => setMobileOpen(false)} icon={<UserRound className="h-4 w-4" />}>
                    Đăng nhập
                  </Button>
                  <Button variant="primary" to="/register" onClick={() => setMobileOpen(false)} icon={<Shield className="h-4 w-4" />}>
                    Đăng ký
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
