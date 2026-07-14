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
    <div className="relative mx-auto flex max-w-2xl w-full items-center justify-center py-6 sm:py-12 px-4 animate-page-in">
      {/* Decorative background glows */}
      <div className="absolute -left-20 top-1/4 -z-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute -right-20 bottom-1/4 -z-10 h-72 w-72 rounded-full bg-lime-400/10 blur-3xl" />

      {/* Main Container Card */}
      <section className="w-full rounded-[2.5rem] border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#0d1224]/85 backdrop-blur-2xl shadow-2xl dark:shadow-[0_0_50px_rgba(6,182,212,0.05)] p-8 sm:p-12 lg:p-14 transition-all duration-500 hover:border-cyan-500/20">
        
        {/* Logo and Title */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 dark:border-white/5 pb-5 mb-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-lime-400 to-cyan-400 text-slate-950 shadow-md">
              <Film className="h-4.5 w-4.5" />
            </div>
            <span className="text-base font-black tracking-wider text-slate-900 dark:text-white">CHILLFILM</span>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">Đăng ký</h1>
        </div>

        <form onSubmit={submitForm} className="mt-4 space-y-5" noValidate>
          {/* Display Name Field */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400" htmlFor="name-input">Tên hiển thị</label>
            <div className={`relative group ${nameError ? 'animate-shake' : ''}`}>
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-cyan-400 transition-colors duration-300">
                <User className="h-4.5 w-4.5" />
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
                  'w-full rounded-2xl border pl-12 pr-4 py-3.5 text-sm text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-950/40 outline-none transition-all duration-300',
                  'focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-400 dark:focus:border-cyan-400',
                  nameError ? 'border-red-500/80 focus:ring-red-500/10' : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                ].join(' ')}
                required
              />
            </div>
            {nameError && <p className="text-[10px] font-bold text-red-500 mt-0.5 pl-1">{nameError}</p>}
          </div>

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
                  if (confirmPassword) {
                    setConfirmPasswordError(validateConfirmPassword(confirmPassword, val))
                  }
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

          {/* Confirm Password Field */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400" htmlFor="confirm-password-input">Nhập lại mật khẩu</label>
            <div className={`relative group ${confirmPasswordError ? 'animate-shake' : ''}`}>
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-cyan-400 transition-colors duration-300">
                <Lock className="h-4.5 w-4.5" />
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
                  'w-full rounded-2xl border pl-12 pr-12 py-3.5 text-sm text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-950/40 outline-none transition-all duration-300',
                  'focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-400 dark:focus:border-cyan-400',
                  confirmPasswordError ? 'border-red-500/80 focus:ring-red-500/10' : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                ].join(' ')}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>
            {confirmPasswordError && <p className="text-[10px] font-bold text-red-500 mt-0.5 pl-1">{confirmPasswordError}</p>}
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
            {loading ? 'Đang đăng ký...' : 'Tạo tài khoản mới'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Đã có tài khoản?{' '}
          <Link to="/login" className="font-bold text-cyan-600 dark:text-cyan-400 hover:underline">
            Đăng nhập ngay
          </Link>
        </p>

      </section>
    </div>
  )
}
