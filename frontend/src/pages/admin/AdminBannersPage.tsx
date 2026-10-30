import { useEffect, useState, type FormEvent } from 'react'
import { api } from '../../api'
import { canCreate, useAuth } from '../../auth'
import type { Banner } from '../../types'

export function AdminBannersPage() {
  const { user } = useAuth()
  const [items, setItems] = useState<Banner[]>([])

  async function load() {
    setItems(await api<Banner[]>('/admin/banners'))
  }

  useEffect(() => {
    void load()
  }, [])

  async function createBanner(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formElement = event.currentTarget
    const form = new FormData(formElement)
    await api('/admin/banners', {
      method: 'POST',
      body: JSON.stringify({
        title: form.get('title'),
        subtitle: form.get('subtitle'),
        badge: form.get('badge'),
        image_url: form.get('image_url'),
        cta_label: form.get('cta_label'),
        cta_href: form.get('cta_href'),
        active: true,
      }),
    })
    formElement.reset()
    await load()
  }

  async function toggle(banner: Banner) {
    await api(`/admin/banners/${banner.id}`, {
      method: 'PUT',
      body: JSON.stringify({ active: !banner.active }),
    })
    await load()
  }

  return (
    <div>
      <h1 className="font-display text-4xl">Баннеры</h1>
      {canCreate(user?.role) && (
        <form onSubmit={createBanner} className="mt-6 grid gap-3 rounded-3xl bg-card p-4 ring-1 ring-ink/5">
          <input name="title" required placeholder="Заголовок" className="rounded-xl border border-ink/10 px-3 py-2" />
          <input name="subtitle" placeholder="Подзаголовок" className="rounded-xl border border-ink/10 px-3 py-2" />
          <input name="badge" placeholder="Плашка, например Акция" className="rounded-xl border border-ink/10 px-3 py-2" />
          <input name="image_url" placeholder="URL картинки" className="rounded-xl border border-ink/10 px-3 py-2" />
          <input name="cta_label" placeholder="Текст кнопки" className="rounded-xl border border-ink/10 px-3 py-2" />
          <input name="cta_href" placeholder="Ссылка /courses/..." className="rounded-xl border border-ink/10 px-3 py-2" />
          <button className="rounded-full bg-forest px-4 py-2 font-semibold text-card">Добавить баннер</button>
        </form>
      )}
      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-2xl bg-card px-4 py-3 ring-1 ring-ink/5">
            <div>
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-muted">{item.subtitle}</p>
            </div>
            <button type="button" className="text-sm" onClick={() => void toggle(item)}>
              {item.active ? 'Скрыть' : 'Показать'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
