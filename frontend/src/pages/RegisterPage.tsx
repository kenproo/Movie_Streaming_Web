import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { User, Mail, Lock, Eye, EyeOff, Film } from 'lucide-react'

export function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [nameError, setNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const validateName = (value: string) => {
    const nameTrim = value.trim()
    if (!nameTrim) {
      return 'Tên hiển thị không được để trống.'
    } else if (nameTrim.length < 2) {
      return 'Tên hiển thị phải có ít nhất 2 ký tự.'
    }
    return ''
  }

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

  const validateConfirmPassword = (value: string, passVal: string) => {
    if (!value) {
      return 'Vui lòng xác nhận mật khẩu.'
    } else if (passVal !== value) {
      return 'Mật khẩu xác nhận không khớp.'
    }
    return ''
  }

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    const nError = validateName(name)
    const eError = validateEmail(email)
    const pError = validatePassword(password)
    const cpError = validateConfirmPassword(confirmPassword, password)

    setNameError(nError)
    setEmailError(eError)
    setPasswordError(pError)
    setConfirmPasswordError(cpError)

    if (nError || eError || pError || cpError) return

    setLoading(true)
    try {
      await register(name.trim(), email.trim(), password)
      navigate('/', { replace: true })
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Đăng ký thất bại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative mx-auto flex max-w-xl items-center justify-center py-6 sm:py-12 animate-page-in">
      {/* Decorative background glows */}
      <div className="absolute -left-20 top-1/4 -z-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute -right-20 bottom-1/4 -z-10 h-72 w-72 rounded-full bg-lime-400/10 blur-3xl" />

      {/* Main Container Card */}
      <section className="w-full rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl p-8 sm:p-12 shadow-2xl dark:shadow-none">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-lime-400 to-cyan-400 text-slate-950 shadow-md">
            <Film className="h-5 w-5" />
          </div>
          <span className="text-lg font-black tracking-wider text-slate-900 dark:text-white">CHILLFILM</span>
        </div>

        <h1 className="mt-8 text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">Đăng ký</h1>
        <p className="mt-2.5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Tạo tài khoản thành viên mới để mở khóa toàn bộ tính năng và trải nghiệm xem phim cá nhân hóa.
        </p>

        <form onSubmit={submitForm} className="mt-8 space-y-5" noValidate>
          {/* Display Name Field */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-200" htmlFor="name-input">Tên hiển thị</label>
            <div className={`relative ${nameError ? 'animate-shake' : ''}`}>
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <User className="h-4 w-4" />
              </span>
              <input
                id="name-input"
                type="text"
                value={name}
                disabled={loading}
                onChange={(event) => {
                  const val = event.target.value
                  setName(val)
                  setNameError(validateName(val))
                }}
                placeholder="Tên của bạn"
                className={[
                  'w-full rounded-2xl border pl-11 pr-4 py-3.5 text-sm text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-950/40 outline-none transition',
                  'focus:ring-2 focus:ring-lime-400/20 focus:border-lime-400',
                  nameError ? 'border-red-500/80 focus:ring-red-500/10' : 'border-slate-200 dark:border-white/10'
                ].join(' ')}
                required
              />
            </div>
            {nameError && <p className="text-xs font-bold text-red-500 mt-1 pl-1">{nameError}</p>}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-200" htmlFor="email-input">Email</label>
            <div className={`relative ${emailError ? 'animate-shake' : ''}`}>
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <Mail className="h-4 w-4" />
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
                  'w-full rounded-2xl border pl-11 pr-4 py-3.5 text-sm text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-950/40 outline-none transition',
                  'focus:ring-2 focus:ring-lime-400/20 focus:border-lime-400',
                  emailError ? 'border-red-500/80 focus:ring-red-500/10' : 'border-slate-200 dark:border-white/10'
                ].join(' ')}
                required
              />
            </div>
            {emailError && <p className="text-xs font-bold text-red-500 mt-1 pl-1">{emailError}</p>}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-200" htmlFor="password-input">Mật khẩu</label>
            <div className={`relative ${passwordError ? 'animate-shake' : ''}`}>
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <Lock className="h-4 w-4" />
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
                  if (confirmPassword) {
                    setConfirmPasswordError(validateConfirmPassword(confirmPassword, val))
                  }
                }}
                placeholder="••••••••"
                className={[
                  'w-full rounded-2xl border pl-11 pr-12 py-3.5 text-sm text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-950/40 outline-none transition',
                  'focus:ring-2 focus:ring-lime-400/20 focus:border-lime-400',
                  passwordError ? 'border-red-500/80 focus:ring-red-500/10' : 'border-slate-200 dark:border-white/10'
                ].join(' ')}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {passwordError && <p className="text-xs font-bold text-red-500 mt-1 pl-1">{passwordError}</p>}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-200" htmlFor="confirm-password-input">Nhập lại mật khẩu</label>
            <div className={`relative ${confirmPasswordError ? 'animate-shake' : ''}`}>
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                id="confirm-password-input"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                disabled={loading}
                onChange={(event) => {
                  const val = event.target.value
                  setConfirmPassword(val)
                  setConfirmPasswordError(validateConfirmPassword(val, password))
                }}
                placeholder="••••••••"
                className={[
                  'w-full rounded-2xl border pl-11 pr-12 py-3.5 text-sm text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-950/40 outline-none transition',
                  'focus:ring-2 focus:ring-lime-400/20 focus:border-lime-400',
                  confirmPasswordError ? 'border-red-500/80 focus:ring-red-500/10' : 'border-slate-200 dark:border-white/10'
                ].join(' ')}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-200"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {confirmPasswordError && <p className="text-xs font-bold text-red-500 mt-1 pl-1">{confirmPasswordError}</p>}
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
            className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-lime-400 to-emerald-400 py-3.5 text-sm font-bold text-slate-950 hover:brightness-110 shadow-lg shadow-lime-500/20 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? 'Đang đăng ký...' : 'Tạo tài khoản mới'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          Đã có tài khoản?{' '}
          <Link to="/login" className="font-bold text-cyan-600 dark:text-cyan-400 hover:underline">
            Đăng nhập ngay
          </Link>
        </p>

      </section>
    </div>
  )
}
