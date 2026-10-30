import { useEffect, useState } from 'react'
import { api } from '../api'
import { LeadForm } from '../components/LeadForm'
import type { CourseCard, Settings } from '../types'

export function ContactsPage() {
  const [courses, setCourses] = useState<CourseCard[]>([])
  const [settings, setSettings] = useState<Settings | null>(null)

  useEffect(() => {
    api<CourseCard[]>('/public/courses').then(setCourses)
    api<{ settings: Settings }>('/public/home').then((data) => setSettings(data.settings))
  }, [])

  return (
    <main className="mx-auto grid max-w-6xl gap-12 px-5 py-12 lg:grid-cols-2">
      <div>
        <h1 className="text-4xl font-medium tracking-tight md:text-5xl">Контакты</h1>
        <p className="mt-4 max-w-md text-lg text-muted">Напишите или оставьте заявку. Ответим в рабочий день и подберём курс.</p>
        <dl className="mt-8 space-y-5 text-base">
          {settings?.phone && (
            <div>
              <dt className="text-sm text-muted">Телефон</dt>
              <dd className="mt-1">
                <a href={`tel:${settings.phone.replace(/[^\d+]/g, '')}`} className="hover:text-forest">
                  {settings.phone}
                </a>
              </dd>
            </div>
          )}
          {settings?.email && (
            <div>
              <dt className="text-sm text-muted">Почта</dt>
              <dd className="mt-1">
                <a href={`mailto:${settings.email}`} className="hover:text-forest">
                  {settings.email}
                </a>
              </dd>
            </div>
          )}
          {settings?.address && (
            <div>
              <dt className="text-sm text-muted">Адрес</dt>
              <dd className="mt-1">{settings.address}</dd>
            </div>
          )}
        </dl>
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          {settings?.telegram && (
            <a href={settings.telegram} className="font-medium text-forest">
              Telegram
            </a>
          )}
          {settings?.instagram && (
            <a href={settings.instagram} className="font-medium text-forest">
              Instagram
            </a>
          )}
        </div>
      </div>
      <LeadForm courses={courses} />
    </main>
  )
}
