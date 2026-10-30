import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { formatSlot, spotsLabel } from '../format'
import type { ScheduleItem } from '../types'

export function SchedulePage() {
  const [items, setItems] = useState<ScheduleItem[] | null>(null)

  useEffect(() => {
    api<ScheduleItem[]>('/public/schedule').then(setItems)
  }, [])

  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="text-4xl font-medium tracking-tight md:text-5xl">Расписание групп</h1>
      <p className="mt-4 max-w-xl text-lg text-muted">
        Запись на группу — через заявку. Онлайн-доступ к материалам открывается отдельно в кабинете ученика.
      </p>
      {items === null ? (
        <p className="mt-10 text-muted">Загружаем расписание…</p>
      ) : items.length === 0 ? (
        <p className="mt-10 text-muted">Ближайших групп пока нет. Оставьте заявку — напишем, когда откроется набор.</p>
      ) : (
        <ul className="mt-10 border-b border-line">
          {items.map((item) => {
            const slot = formatSlot(item.starts_at)
            return (
              <li key={item.id} className="grid gap-2 border-t border-line py-5 sm:grid-cols-[6.5rem_1fr] sm:gap-6">
                <div>
                  <p className="font-medium">{slot.date}</p>
                  <p className="text-sm text-muted">{slot.time}</p>
                </div>
                <div>
                  <h2 className="text-lg font-medium tracking-tight">{item.title}</h2>
                  <p className="mt-1 text-sm text-muted">
                    {item.city}
                    {item.hours ? `, ${item.hours} ак. ч.` : ''}
                    {item.spots != null ? `, осталось ${spotsLabel(item.spots)}` : ''}
                  </p>
                  {item.course && (
                    <Link to={`/courses/${item.course.slug}`} className="mt-2 inline-block text-sm font-medium text-forest">
                      Программа курса
                    </Link>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </main>
  )
}
