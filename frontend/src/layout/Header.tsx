import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, LibraryBig, LogOut, Menu, Moon, Search, Shield, Sun, UserRound, X } from 'lucide-react'
import { Button } from '../common/Button'
import { SearchDropdown } from '../components/movies/SearchDropdown'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useDebounce } from '../hooks/useDebounce'
import { movieService } from '../services/movieService'
import type { Movie } from '../types/movie'

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
      <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2 whitespace-nowrap text-lg font-semibold tracking-wide text-app-primary">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:bg-cyan-400/15 dark:text-cyan-300 ring-1 ring-cyan-500/20 dark:ring-cyan-300/20">CF</span>
          <span>ChillFilm</span>
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center gap-1 xl:flex">
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
                  'whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition',
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

        <div className="relative hidden min-w-0 md:flex md:w-[200px] lg:w-[220px] xl:w-[200px] 2xl:w-[220px] ml-auto">
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
          {renderThemeToggle()}
          {renderAuthActions()}
          {isAdminPage ? <span className="whitespace-nowrap rounded-full border border-cyan-500/20 dark:border-cyan-400/20 px-3 py-1 text-xs text-cyan-600 dark:text-cyan-300">Admin</span> : null}
        </div>

        <div className="ml-auto flex items-center gap-2 lg:hidden">
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
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6">
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
