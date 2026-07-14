import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, LibraryBig, Loader2, ArrowLeft, Bookmark } from 'lucide-react'
import { useLibrary } from '../contexts/LibraryContext'
import { MovieCard } from '../components/movies/MovieCard'
import type { Movie } from '../types/movie'

export function LibraryPage() {
  const { getFavoriteMoviesDetails, getFollowMoviesDetails, favorites, follows } = useLibrary()
  
  // Tab state: 'favorites' or 'follows'
  const [activeTab, setActiveTab] = useState<'favorites' | 'follows'>('favorites')
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  const fetchDetails = () => {
    setLoading(true)
    const fetchPromise = activeTab === 'favorites' 
      ? getFavoriteMoviesDetails() 
      : getFollowMoviesDetails()

    fetchPromise
      .then((data) => {
        setMovies(data)
      })
      .catch((err) => {
        console.error(`Failed to load ${activeTab} details:`, err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  // Refetch when active tab changes or corresponding length changes
  useEffect(() => {
    fetchDetails()
  }, [activeTab, favorites.length, follows.length])

  return (
    <div className="space-y-8 animate-page-in">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 dark:border-white/10 bg-slate-900/40 p-8 sm:p-12 backdrop-blur-xl">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-lime-400/10 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-lime-400 to-cyan-400 text-slate-950 shadow-lg shadow-lime-400/20">
                <LibraryBig className="h-5 w-5" />
              </div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white sm:text-4xl tracking-tight">Tủ phim của tôi</h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
              Lưu trữ những bộ phim yêu thích hoặc đang theo dõi của bạn. Dữ liệu được đồng bộ hóa trực tiếp vào tài khoản cá nhân.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white/5 px-4.5 py-2.5 text-sm font-bold text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition self-start md:self-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Về trang chủ
          </Link>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-200 dark:border-white/10 pb-px">
        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex items-center gap-2 border-b-2 px-6 py-3.5 text-sm font-bold transition-all relative ${
            activeTab === 'favorites'
              ? 'border-lime-400 text-lime-400 bg-lime-400/5'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Heart className={`h-4 w-4 ${activeTab === 'favorites' ? 'fill-current' : ''}`} />
          Phim yêu thích ({favorites.length})
        </button>
        <button
          onClick={() => setActiveTab('follows')}
          className={`flex items-center gap-2 border-b-2 px-6 py-3.5 text-sm font-bold transition-all relative ${
            activeTab === 'follows'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-400/5'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Bookmark className={`h-4 w-4 ${activeTab === 'follows' ? 'fill-current' : ''}`} />
          Phim đang theo dõi ({follows.length})
        </button>
      </div>

      {/* Movie Grid */}
      {loading ? (
        <div className="flex h-[30vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-lime-400" />
            <p className="text-xs font-semibold text-slate-400">Đang tải phim...</p>
          </div>
        </div>
      ) : movies.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-app-muted">
            <span>Hiển thị {movies.length} bộ phim</span>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex min-h-[350px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-200 dark:border-white/10 bg-slate-500/5 p-8 text-center backdrop-blur-sm animate-tab-in">
          <div className={`flex h-16 w-16 items-center justify-center rounded-full mb-5 ${activeTab === 'favorites' ? 'bg-rose-500/10 text-rose-500' : 'bg-cyan-500/10 text-cyan-500'}`}>
            {activeTab === 'favorites' ? <Heart className="h-8 w-8" /> : <Bookmark className="h-8 w-8" />}
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Tủ phim trống</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
            {activeTab === 'favorites'
              ? 'Bạn chưa có phim yêu thích nào. Hãy nhấn biểu tượng trái tim để lưu lại.'
              : 'Bạn chưa theo dõi phim nào. Hãy nhấn nút "Theo dõi" để không bỏ lỡ các tập phim mới.'}
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-lime-400 to-emerald-400 px-6 py-3 text-sm font-bold text-slate-950 hover:brightness-110 shadow-lg shadow-lime-500/10 transition"
          >
            Khám phá kho phim
          </Link>
        </div>
      )}
    </div>
  )
}
