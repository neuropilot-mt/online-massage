import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { firstError } from '../api'
import { useAuth } from '../auth'

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    try {
      await register({
        name: String(form.get('name')),
        email: String(form.get('email')),
        phone: String(form.get('phone') || ''),
        password: String(form.get('password')),
        password_confirmation: String(form.get('password_confirmation')),
      })
      navigate('/cabinet')
    } catch (err) {
      setError(firstError(err))
    }
  }

  return (
    <main className="mx-auto max-w-md px-5 py-16">
      <h1 className="text-4xl font-medium tracking-tight">Регистрация ученика</h1>
      <p className="mt-3 text-muted">Аккаунт создаётся сразу. Уроки откроются, когда преподаватель зачислит вас на курс.</p>
      <form onSubmit={onSubmit} className="mt-8 grid gap-4">
        <label className="grid gap-1.5 text-sm">
          <span>Имя</span>
          <input name="name" required autoComplete="name" className="field" />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span>Email</span>
          <input name="email" type="email" required autoComplete="email" className="field" />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span>Телефон</span>
          <input name="phone" autoComplete="tel" className="field" />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span>Пароль</span>
          <input name="password" type="password" required autoComplete="new-password" className="field" />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span>Повтор пароля</span>
          <input name="password_confirmation" type="password" required autoComplete="new-password" className="field" />
        </label>
        {error && <p className="text-sm text-clay">{error}</p>}
        <button type="submit" className="btn">
          Создать аккаунт
        </button>
      </form>
      <p className="mt-4 text-sm text-muted">
        Уже есть кабинет?{' '}
        <Link to="/login" className="font-medium text-forest">
          Войти
        </Link>
      </p>
    </main>
  )
}
