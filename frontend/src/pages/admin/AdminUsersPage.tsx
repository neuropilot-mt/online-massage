import { useEffect, useState, type FormEvent } from 'react'
import { api } from '../../api'
import type { User } from '../../types'

export function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])

  async function load() {
    setUsers(await api<User[]>('/admin/users'))
  }

  useEffect(() => {
    void load()
  }, [])

  async function createUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formElement = event.currentTarget
    const form = new FormData(formElement)
    await api('/admin/users', {
      method: 'POST',
      body: JSON.stringify({
        name: form.get('name'),
        email: form.get('email'),
        phone: form.get('phone'),
        password: form.get('password'),
        role: form.get('role'),
      }),
    })
    formElement.reset()
    await load()
  }

  return (
    <div>
      <h1 className="font-display text-4xl">Пользователи</h1>
      <form onSubmit={createUser} className="mt-6 grid gap-3 rounded-3xl bg-card p-4 ring-1 ring-ink/5 md:grid-cols-2">
        <input name="name" required placeholder="Имя" className="rounded-xl border border-ink/10 px-3 py-2" />
        <input name="email" type="email" required placeholder="Email" className="rounded-xl border border-ink/10 px-3 py-2" />
        <input name="phone" placeholder="Телефон" className="rounded-xl border border-ink/10 px-3 py-2" />
        <input name="password" required placeholder="Пароль" className="rounded-xl border border-ink/10 px-3 py-2" />
        <select name="role" className="rounded-xl border border-ink/10 px-3 py-2">
          <option value="student">Ученик</option>
          <option value="moderator">Модератор</option>
          <option value="teacher">Преподаватель</option>
          <option value="admin">Администратор</option>
        </select>
        <button className="rounded-full bg-forest px-4 py-2 font-semibold text-card">Создать</button>
      </form>
      <div className="mt-6 space-y-2">
        {users.map((item) => (
          <div key={item.id} className="flex justify-between rounded-2xl bg-card px-4 py-3 text-sm ring-1 ring-ink/5">
            <span>
              {item.name} · {item.email}
            </span>
            <span className="text-muted">{item.role_label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
