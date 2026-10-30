import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { firstError } from '../api'
import { isStaff, useAuth } from '../auth'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    try {
      const user = await login(String(form.get('email')), String(form.get('password')))
      navigate(isStaff(user.role) ? '/admin' : '/cabinet')
    } catch (err) {
      setError(firstError(err))
    }
  }

  return (
    <main className="mx-auto max-w-md px-5 py-16">
      <h1 className="text-4xl font-medium tracking-tight">Вход в кабинет</h1>
      <p className="mt-3 text-muted">Email и пароль, указанные при регистрации.</p>
      <form onSubmit={onSubmit} className="mt-8 grid gap-4">
        <label className="grid gap-1.5 text-sm">
          <span>Email</span>
          <input name="email" type="email" required autoComplete="email" className="field" />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span>Пароль</span>
          <input name="password" type="password" required autoComplete="current-password" className="field" />
        </label>
        {error && <p className="text-sm text-clay">{error}</p>}
        <button type="submit" className="btn">
          Войти
        </button>
      </form>
      <p className="mt-4 text-sm text-muted">
        Нет аккаунта?{' '}
        <Link to="/register" className="font-medium text-forest">
          Регистрация
        </Link>
      </p>
      <p className="mt-8 border-t border-line pt-4 text-sm text-muted">
        Демо: admin@soma.academy, teacher@soma.academy, moderator@soma.academy, student@soma.academy. Пароль у всех — password.
      </p>
    </main>
  )
}
