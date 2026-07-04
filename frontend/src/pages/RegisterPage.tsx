import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
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
    <section className="mx-auto max-w-xl rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] p-6 sm:p-8 shadow-xl dark:shadow-none">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-300">ChillFilm</p>
      <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">Đăng ký</h1>
      <p className="mt-3 text-slate-500 dark:text-slate-300">Tạo tài khoản người dùng thường để lưu hồ sơ và trải nghiệm cá nhân.</p>

      <form onSubmit={submitForm} className="mt-8 space-y-4" noValidate>
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Tên hiển thị</span>
          <input
            value={name}
            disabled={loading}
            onChange={(event) => {
              const val = event.target.value
              setName(val)
              setNameError(validateName(val))
            }}
            className={`w-full rounded-xl border px-4 py-3 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-950/70 outline-none transition focus:border-cyan-500 dark:focus:border-cyan-300/60 ${nameError ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-white/10'} disabled:opacity-60`}
            required
          />
          {nameError ? <p className="text-xs font-semibold text-red-500 mt-1">{nameError}</p> : null}
        </label>
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
              if (confirmPassword) {
                setConfirmPasswordError(validateConfirmPassword(confirmPassword, val))
              }
            }}
            className={`w-full rounded-xl border px-4 py-3 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-950/70 outline-none transition focus:border-cyan-500 dark:focus:border-cyan-300/60 ${passwordError ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-white/10'} disabled:opacity-60`}
            required
          />
          {passwordError ? <p className="text-xs font-semibold text-red-500 mt-1">{passwordError}</p> : null}
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Nhập lại mật khẩu</span>
          <input
            type="password"
            value={confirmPassword}
            disabled={loading}
            onChange={(event) => {
              const val = event.target.value
              setConfirmPassword(val)
              setConfirmPasswordError(validateConfirmPassword(val, password))
            }}
            className={`w-full rounded-xl border px-4 py-3 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-950/70 outline-none transition focus:border-cyan-500 dark:focus:border-cyan-300/60 ${confirmPasswordError ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-white/10'} disabled:opacity-60`}
            required
          />
          {confirmPasswordError ? <p className="text-xs font-semibold text-red-500 mt-1">{confirmPasswordError}</p> : null}
        </label>
        {error ? <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-200">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-lime-400 px-5 py-3 font-bold text-slate-950 hover:brightness-110 shadow-lg shadow-lime-500/15 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
        </button>
      </form>

      <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
        Đã có tài khoản? <Link to="/login" className="font-semibold text-cyan-600 dark:text-cyan-300 hover:underline">Đăng nhập</Link>
      </p>
    </section>
  )
}
