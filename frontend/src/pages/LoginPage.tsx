import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Mail, Lock, Eye, EyeOff, Film, ShieldCheck, UserCheck } from 'lucide-react'

export function LoginPage() {
  const [email, setEmail] = useState('user@chillfilm.com')
  const [password, setPassword] = useState('userpassword')
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname

  const validateEmail = (value: string) => {
    const emailTrim = value.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailTrim) {
      return 'Email không được để trống.'
    } else if (!emailRegex.test(emailTrim)) {
      return 'Email không đúng định dạng.'
    }
    return ''
  }

  const validatePassword = (value: string) => {
    if (!value) {
      return 'Mật khẩu không được để trống.'
    } else if (value.length < 6) {
      return 'Mật khẩu phải có ít nhất 6 ký tự.'
    } else if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) {
      return 'Mật khẩu phải chứa cả chữ cái và số.'
    }
    return ''
  }

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    const eError = validateEmail(email)
    const pError = validatePassword(password)

    setEmailError(eError)
    setPasswordError(pError)

    if (eError || pError) {
      // Trigger temporary shake effect by resetting/adding error state
      return
    }

    setLoading(true)
    try {
      const user = await login(email.trim(), password)
      navigate(from ?? (user.role === 'admin' ? '/admin' : '/'), { replace: true })
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Đăng nhập thất bại.')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (role: 'admin' | 'user') => {
    if (role === 'admin') {
      setEmail('admin@chillfilm.com')
      setPassword('adminpassword1')
    } else {
      setEmail('user@chillfilm.com')
      setPassword('userpassword1')
    }
    setEmailError('')
    setPasswordError('')
  }

  return (
    <div className="relative mx-auto flex max-w-5xl w-full items-center justify-center py-6 sm:py-12 px-4 animate-page-in">
      {/* Decorative background glows */}
      <div className="absolute -left-20 top-1/4 -z-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl animate-pulse" />
      <div className="absolute -right-20 bottom-1/4 -z-10 h-72 w-72 rounded-full bg-lime-400/10 blur-3xl animate-pulse" />
 
      {/* Main Container Card */}
      <div className="w-full grid overflow-hidden rounded-[2.5rem] border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#0d1224]/85 backdrop-blur-2xl shadow-2xl dark:shadow-[0_0_50px_rgba(6,182,212,0.05)] lg:grid-cols-[1fr_400px] transition-all duration-500 hover:border-cyan-500/20">
        
        {/* Left Side: Login Form */}
        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-lime-400 to-cyan-400 text-slate-950 shadow-md">
              <Film className="h-4.5 w-4.5" />
            </div>
            <span className="text-base font-black tracking-wider text-slate-900 dark:text-white">CHILLFILM</span>
          </div>
 
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Đăng nhập</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Xem trọn vẹn kho phim chất lượng cao 4K, lưu trữ danh sách yêu thích và sử dụng trợ lý RAG AI.
          </p>
 
          <form onSubmit={submitForm} className="mt-8 space-y-5" noValidate>
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400" htmlFor="email-input">Email</label>
              <div className={`relative group ${emailError ? 'animate-shake' : ''}`}>
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-cyan-400 transition-colors duration-300">
                  <Mail className="h-4.5 w-4.5" />
                </span>
                <input
                  id="email-input"
                  type="email"
                  value={email}
                  disabled={loading}
                  onChange={(event) => {
                    const val = event.target.value
                    setEmail(val)
                    setEmailError(validateEmail(val))
                  }}
                  placeholder="nhap-email@chillfilm.com"
                  className={[
                    'w-full rounded-2xl border pl-12 pr-4 py-3.5 text-sm text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-950/40 outline-none transition-all duration-300',
                    'focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-400 dark:focus:border-cyan-400',
                    emailError ? 'border-red-500/80 focus:ring-red-500/10' : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                  ].join(' ')}
                  required
                />
              </div>
              {emailError && <p className="text-[10px] font-bold text-red-500 mt-0.5 pl-1">{emailError}</p>}
            </div>
 
            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400" htmlFor="password-input">Mật khẩu</label>
              <div className={`relative group ${passwordError ? 'animate-shake' : ''}`}>
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-cyan-400 transition-colors duration-300">
                  <Lock className="h-4.5 w-4.5" />
                </span>
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  disabled={loading}
                  onChange={(event) => {
                    const val = event.target.value
                    setPassword(val)
                    setPasswordError(validatePassword(val))
                  }}
                  placeholder="••••••••"
                  className={[
                    'w-full rounded-2xl border pl-12 pr-12 py-3.5 text-sm text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-950/40 outline-none transition-all duration-300',
                    'focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-400 dark:focus:border-cyan-400',
                    passwordError ? 'border-red-500/80 focus:ring-red-500/10' : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                  ].join(' ')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
              {passwordError && <p className="text-[10px] font-bold text-red-500 mt-0.5 pl-1">{passwordError}</p>}
            </div>
 
            {/* General Error message */}
            {error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs font-semibold text-red-500 animate-shake">
                {error}
              </div>
            )}
 
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-lime-400 via-emerald-400 to-cyan-400 py-3.5 text-sm font-bold text-slate-950 shadow-[0_4px_20px_rgba(163,230,53,0.15)] hover:shadow-[0_4px_30px_rgba(163,230,53,0.3)] hover:brightness-110 active:scale-[0.99] transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              {loading ? 'Đang xác thực tài khoản...' : 'Đăng nhập vào ChillFilm'}
            </button>
          </form>
 
          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="font-bold text-cyan-600 dark:text-cyan-400 hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </div>
 
        {/* Right Side: Demo Accounts Banner */}
        <div className="relative hidden flex-col justify-between border-l border-slate-200/50 dark:border-white/5 bg-slate-50/30 dark:bg-slate-950/15 p-8 sm:p-10 lg:flex">
          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-black tracking-wider uppercase text-slate-900 dark:text-white">Tài khoản trải nghiệm</h2>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Nhấp chuột vào một trong hai tài khoản dưới đây để tự động điền nhanh dữ liệu đăng nhập.
              </p>
            </div>
 
            <div className="space-y-3.5">
              {/* Admin Demo Button */}
              <button
                type="button"
                onClick={() => fillDemo('admin')}
                className="w-full flex items-start gap-4 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-4 text-left transition-all duration-300 hover:border-lime-400/30 hover:bg-lime-400/5 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-lime-500/5 group cursor-pointer"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-lime-400/10 text-lime-400 group-hover:bg-lime-400 group-hover:text-slate-950 transition">
                  <ShieldCheck className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">Hồ sơ Admin</h3>
                  <p className="mt-0.5 text-[10px] font-mono text-slate-400 leading-none">admin@chillfilm.com</p>
                  <p className="mt-1.5 text-[10px] text-slate-500 dark:text-slate-400 leading-normal">Xem báo cáo, cấu hình chatbot.</p>
                </div>
              </button>
 
              {/* User Demo Button */}
              <button
                type="button"
                onClick={() => fillDemo('user')}
                className="w-full flex items-start gap-4 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-4 text-left transition-all duration-300 hover:border-cyan-400/30 hover:bg-cyan-400/5 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/5 group cursor-pointer"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400 group-hover:bg-cyan-400 group-hover:text-slate-950 transition">
                  <UserCheck className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">Hồ sơ Thành viên</h3>
                  <p className="mt-0.5 text-[10px] font-mono text-slate-400 leading-none">user@chillfilm.com</p>
                  <p className="mt-1.5 text-[10px] text-slate-500 dark:text-slate-400 leading-normal">Xem phim mẫu, chat với AI.</p>
                </div>
              </button>
            </div>
          </div>
 
          <div className="rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-4 text-center">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">ChillFilm Streaming</span>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Version 2.0 (Powered by RAG AI)</p>
          </div>
        </div>
 
      </div>
    </div>
  )
}
