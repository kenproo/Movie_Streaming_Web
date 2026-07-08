import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function LoginPage() {
  const [email, setEmail] = useState('user@chillfilm.com')
  const [password, setPassword] = useState('123456')
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

    if (eError || pError) return

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

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_380px]">
      <section className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] p-6 sm:p-8 shadow-xl dark:shadow-none">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-300">ChillFilm</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">Đăng nhập</h1>
        <p className="mt-3 text-slate-500 dark:text-slate-300">Truy cập hồ sơ, danh sách yêu thích và khu vực admin nếu tài khoản có quyền.</p>

        <form onSubmit={submitForm} className="mt-8 space-y-4" noValidate>
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Email</span>
            <input
              type="email"
              value={email}
              disabled={loading}
              onChange={(event) => {
                const val = event.target.value
                setEmail(val)
                setEmailError(validateEmail(val))
              }}
              className={`w-full rounded-xl border px-4 py-3 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-950/70 outline-none transition focus:border-cyan-500 dark:focus:border-cyan-300/60 ${emailError ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-white/10'} disabled:opacity-60`}
              required
            />
            {emailError ? <p className="text-xs font-semibold text-red-500 mt-1">{emailError}</p> : null}
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Mật khẩu</span>
            <input
              type="password"
              value={password}
              disabled={loading}
              onChange={(event) => {
                const val = event.target.value
                setPassword(val)
                setPasswordError(validatePassword(val))
              }}
              className={`w-full rounded-xl border px-4 py-3 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-950/70 outline-none transition focus:border-cyan-500 dark:focus:border-cyan-300/60 ${passwordError ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-white/10'} disabled:opacity-60`}
              required
            />
            {passwordError ? <p className="text-xs font-semibold text-red-500 mt-1">{passwordError}</p> : null}
          </label>
          {error ? <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-200">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-lime-400 px-5 py-3 font-bold text-slate-950 hover:brightness-110 shadow-lg shadow-lime-500/15 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
          Chưa có tài khoản? <Link to="/register" className="font-semibold text-cyan-600 dark:text-cyan-300 hover:underline">Đăng ký</Link>
        </p>
      </section>

      <aside className="rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-900/70 p-6 shadow-sm dark:shadow-none">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Tài khoản demo</h2>
        <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-4 shadow-sm">
            <p className="font-semibold text-slate-900 dark:text-white">Admin</p>
            <p>admin@chillfilm.com / 123456</p>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-4 shadow-sm">
            <p className="font-semibold text-slate-900 dark:text-white">User</p>
            <p>user@chillfilm.com / 123456</p>
          </div>
        </div>
      </aside>
    </div>
  )
}
