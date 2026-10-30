import { useEffect, useState, type FormEvent } from 'react'
import { api, firstError } from '../../api'
import type { Settings } from '../../types'

export function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    api<Settings>('/admin/settings').then(setSettings)
  }, [])

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    try {
      const updated = await api<Settings>('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify({
          phone: form.get('phone'),
          email: form.get('email'),
          address: form.get('address'),
          telegram: form.get('telegram'),
          instagram: form.get('instagram'),
          hero_title: form.get('hero_title'),
          hero_subtitle: form.get('hero_subtitle'),
          about: form.get('about'),
        }),
      })
      setSettings(updated)
      setError('')
      setMessage('Сохранено')
    } catch (err) {
      setMessage('')
      setError(firstError(err))
    }
  }

  if (!settings) return <p>Загрузка…</p>

  return (
    <form onSubmit={save} className="grid max-w-2xl gap-3">
      <h1 className="font-display text-4xl">Сайт</h1>
      <input name="hero_title" defaultValue={settings.hero_title ?? ''} className="rounded-xl border border-ink/10 px-3 py-2" />
      <textarea name="hero_subtitle" defaultValue={settings.hero_subtitle ?? ''} rows={3} className="rounded-xl border border-ink/10 px-3 py-2" />
      <input name="phone" defaultValue={settings.phone ?? ''} className="rounded-xl border border-ink/10 px-3 py-2" />
      <input name="email" defaultValue={settings.email ?? ''} className="rounded-xl border border-ink/10 px-3 py-2" />
      <input name="address" defaultValue={settings.address ?? ''} className="rounded-xl border border-ink/10 px-3 py-2" />
      <input name="telegram" defaultValue={settings.telegram ?? ''} className="rounded-xl border border-ink/10 px-3 py-2" />
      <input name="instagram" defaultValue={settings.instagram ?? ''} className="rounded-xl border border-ink/10 px-3 py-2" />
      <textarea name="about" defaultValue={settings.about ?? ''} rows={8} className="rounded-xl border border-ink/10 px-3 py-2" />
      {message && <p className="text-sm text-forest">{message}</p>}
      {error && <p className="text-sm text-clay">{error}</p>}
      <button className="rounded-full bg-forest px-5 py-2 font-semibold text-card">Сохранить</button>
    </form>
  )
}
