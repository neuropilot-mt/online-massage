import { useState, type FormEvent } from 'react'
import { api, firstError } from '../../api'
import { useAuth } from '../../auth'

export function ProfilePage() {
  const { user, setUser } = useAuth()
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const password = String(form.get('password') || '')
    try {
      const updated = await api<typeof user>('/me', {
        method: 'PATCH',
        body: JSON.stringify({
          name: form.get('name'),
          phone: form.get('phone'),
          ...(password
            ? { password, password_confirmation: form.get('password_confirmation') }
            : {}),
        }),
      })
      if (updated) setUser(updated)
      setError('')
      setMessage('Профиль сохранён')
    } catch (err) {
      setMessage('')
      setError(firstError(err))
    }
  }

  if (!user) return null

  return (
    <form onSubmit={onSubmit} className="max-w-md space-y-4">
      <h1 className="text-4xl font-medium tracking-tight">Профиль</h1>
      <label className="grid gap-1.5 text-sm">
        <span>Имя</span>
        <input name="name" defaultValue={user.name} className="field" />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span>Email</span>
        <input defaultValue={user.email} disabled className="field bg-paper-2 text-muted" />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span>Телефон</span>
        <input name="phone" defaultValue={user.phone ?? ''} autoComplete="tel" className="field" />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span>Новый пароль</span>
        <input name="password" type="password" autoComplete="new-password" className="field" />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span>Повтор пароля</span>
        <input name="password_confirmation" type="password" autoComplete="new-password" className="field" />
      </label>
      {message && <p className="text-sm text-forest">{message}</p>}
      {error && <p className="text-sm text-clay">{error}</p>}
      <button className="btn">Сохранить</button>
    </form>
  )
}
