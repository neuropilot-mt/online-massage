import { useEffect, useState, type FormEvent } from 'react'
import { api } from '../../api'
import { canCreate, useAuth } from '../../auth'
import { formatDate } from '../../format'
import type { AdminCourse, ScheduleItem } from '../../types'

export function AdminSchedulePage() {
  const { user } = useAuth()
  const [items, setItems] = useState<ScheduleItem[]>([])
  const [courses, setCourses] = useState<AdminCourse[]>([])

  async function load() {
    setItems(await api<ScheduleItem[]>('/admin/schedule'))
    setCourses(await api<AdminCourse[]>('/admin/courses'))
  }

  useEffect(() => {
    void load()
  }, [])

  async function createEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formElement = event.currentTarget
    const form = new FormData(formElement)
    await api('/admin/schedule', {
      method: 'POST',
      body: JSON.stringify({
        title: form.get('title'),
        course_id: Number(form.get('course_id')) || null,
        city: form.get('city') || 'Минск',
        starts_at: form.get('starts_at'),
        hours: Number(form.get('hours')) || null,
        spots: Number(form.get('spots')) || null,
        published: true,
      }),
    })
    formElement.reset()
    await load()
  }

  return (
    <div>
      <h1 className="font-display text-4xl">Расписание</h1>
      {canCreate(user?.role) && (
        <form onSubmit={createEvent} className="mt-6 grid gap-3 rounded-3xl bg-card p-4 ring-1 ring-ink/5 md:grid-cols-2">
          <input name="title" required placeholder="Название группы" className="rounded-xl border border-ink/10 px-3 py-2" />
          <select name="course_id" className="rounded-xl border border-ink/10 px-3 py-2">
            <option value="">Курс не привязан</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
          <input name="starts_at" type="datetime-local" required className="rounded-xl border border-ink/10 px-3 py-2" />
          <input name="city" placeholder="Город" defaultValue="Минск" className="rounded-xl border border-ink/10 px-3 py-2" />
          <input name="hours" type="number" placeholder="Часы" className="rounded-xl border border-ink/10 px-3 py-2" />
          <input name="spots" type="number" placeholder="Мест" className="rounded-xl border border-ink/10 px-3 py-2" />
          <button className="rounded-full bg-forest px-4 py-2 font-semibold text-card md:col-span-2">Добавить группу</button>
        </form>
      )}
      <div className="mt-6 space-y-2">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl bg-card px-4 py-3 ring-1 ring-ink/5">
            <p className="font-semibold">{item.title}</p>
            <p className="text-sm text-muted">
              {item.city} · {formatDate(item.starts_at)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
