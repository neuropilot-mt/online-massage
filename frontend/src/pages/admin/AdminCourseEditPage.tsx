import { useEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, firstError } from '../../api'
import { canCreate, useAuth } from '../../auth'
import type { AdminCourse, AdminLesson, AdminModule, Program } from '../../types'

export function AdminCourseEditPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [course, setCourse] = useState<AdminCourse | null>(null)
  const [programs, setPrograms] = useState<Program[]>([])
  const [lesson, setLesson] = useState<AdminLesson | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const allowCreate = canCreate(user?.role)

  async function reload() {
    if (!id) return
    const [nextCourse, nextPrograms] = await Promise.all([
      api<AdminCourse>(`/admin/courses/${id}`),
      api<Program[]>('/admin/programs'),
    ])
    setCourse(nextCourse)
    setPrograms(nextPrograms)
  }

  useEffect(() => {
    void reload()
  }, [id])

  async function saveCourse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!course) return
    const form = new FormData(event.currentTarget)
    try {
      const updated = await api<AdminCourse>(`/admin/courses/${course.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: form.get('title'),
          slug: form.get('slug'),
          excerpt: form.get('excerpt'),
          description: form.get('description'),
          cover_url: form.get('cover_url'),
          price: Number(form.get('price')) || null,
          duration_hours: Number(form.get('duration_hours')) || null,
          format: form.get('format'),
          level: form.get('level'),
          program_id: Number(form.get('program_id')) || null,
          published: form.get('published') === 'on',
          featured: form.get('featured') === 'on',
        }),
      })
      setCourse(updated)
      setError('')
      setMessage('Курс сохранён')
    } catch (err) {
      setMessage('')
      setError(firstError(err))
    }
  }

  async function addModule() {
    if (!course) return
    await api(`/admin/courses/${course.id}/modules`, {
      method: 'POST',
      body: JSON.stringify({ title: 'Новый модуль' }),
    })
    await reload()
  }

  async function addLesson(module: AdminModule) {
    const created = await api<AdminLesson>(`/admin/modules/${module.id}/lessons`, {
      method: 'POST',
      body: JSON.stringify({ title: 'Новый урок', content: '' }),
    })
    setLesson(created)
    await reload()
  }

  async function saveLesson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!lesson) return
    const form = new FormData(event.currentTarget)
    const updated = await api<AdminLesson>(`/admin/lessons/${lesson.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: form.get('title'),
        content: form.get('content'),
        video_url: form.get('video_url'),
        image_url: form.get('image_url'),
        duration_min: Number(form.get('duration_min')) || null,
      }),
    })
    setLesson(updated)
    await reload()
  }

  if (!course) return <p>Загрузка курса…</p>

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div>
        <Link to="/admin/courses" className="text-sm text-muted">
          ← К списку
        </Link>
        <h1 className="mt-2 font-display text-4xl">Редактор курса</h1>
        <form onSubmit={saveCourse} className="mt-6 grid gap-3 rounded-3xl bg-card p-5 ring-1 ring-ink/5">
          <input name="title" defaultValue={course.title} className="rounded-xl border border-ink/10 px-4 py-3" />
          <input name="slug" defaultValue={course.slug} className="rounded-xl border border-ink/10 px-4 py-3" />
          <select name="program_id" defaultValue={course.program_id ?? ''} className="rounded-xl border border-ink/10 px-4 py-3">
            <option value="">Без программы</option>
            {programs.map((program) => (
              <option key={program.id} value={program.id}>
                {program.title}
              </option>
            ))}
          </select>
          <textarea name="excerpt" defaultValue={course.excerpt ?? ''} rows={2} className="rounded-xl border border-ink/10 px-4 py-3" />
          <textarea name="description" defaultValue={course.description ?? ''} rows={5} className="rounded-xl border border-ink/10 px-4 py-3" />
          <input name="cover_url" defaultValue={course.cover_url ?? ''} placeholder="URL обложки" className="rounded-xl border border-ink/10 px-4 py-3" />
          <div className="grid grid-cols-2 gap-3">
            <input name="price" type="number" defaultValue={course.price ?? ''} placeholder="Цена BYN" className="rounded-xl border border-ink/10 px-4 py-3" />
            <input name="duration_hours" type="number" defaultValue={course.duration_hours ?? ''} placeholder="Часы" className="rounded-xl border border-ink/10 px-4 py-3" />
            <input name="format" defaultValue={course.format ?? ''} placeholder="Формат" className="rounded-xl border border-ink/10 px-4 py-3" />
            <input name="level" defaultValue={course.level ?? ''} placeholder="Уровень" className="rounded-xl border border-ink/10 px-4 py-3" />
          </div>
          <label className="text-sm">
            <input name="published" type="checkbox" defaultChecked={course.published} className="mr-2" />
            Опубликован на сайте
          </label>
          <label className="text-sm">
            <input name="featured" type="checkbox" defaultChecked={course.featured} className="mr-2" />
            В избранном
          </label>
          {message && <p className="text-sm text-forest">{message}</p>}
          {error && <p className="text-sm text-clay">{error}</p>}
          <button className="rounded-full bg-forest px-5 py-2 font-semibold text-card">Сохранить карточку</button>
        </form>

        <div className="mt-8 flex items-center justify-between">
          <h2 className="font-display text-3xl">Модули и уроки</h2>
          {allowCreate && (
            <button type="button" onClick={() => void addModule()} className="text-sm font-semibold text-forest">
              + модуль
            </button>
          )}
        </div>
        <div className="mt-4 space-y-4">
          {(course.modules ?? []).map((module) => (
            <section key={module.id} className="rounded-2xl bg-card p-4 ring-1 ring-ink/5">
              <div className="flex items-center justify-between gap-3">
                <input
                  defaultValue={module.title}
                  className="w-full rounded-xl border border-ink/10 px-3 py-2"
                  onBlur={(event) => {
                    void api(`/admin/modules/${module.id}`, {
                      method: 'PUT',
                      body: JSON.stringify({ title: event.target.value }),
                    })
                  }}
                />
                {allowCreate && (
                  <button type="button" className="shrink-0 text-sm text-forest" onClick={() => void addLesson(module)}>
                    + урок
                  </button>
                )}
              </div>
              <ul className="mt-3">
                {module.lessons.map((item) => (
                  <li key={item.id}>
                    <button type="button" className="w-full py-2 text-left text-sm hover:text-forest" onClick={() => setLesson(item)}>
                      {item.title}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      <aside>
        {lesson ? (
          <form onSubmit={saveLesson} className="sticky top-6 space-y-3 rounded-3xl bg-card p-4 ring-1 ring-ink/5">
            <h3 className="font-display text-2xl">Урок</h3>
            <input name="title" defaultValue={lesson.title} key={`t-${lesson.id}`} className="w-full rounded-xl border border-ink/10 px-3 py-2" />
            <input name="video_url" defaultValue={lesson.video_url ?? ''} key={`v-${lesson.id}`} placeholder="YouTube / Vimeo / Kinescope" className="w-full rounded-xl border border-ink/10 px-3 py-2" />
            <input name="image_url" defaultValue={lesson.image_url ?? ''} key={`i-${lesson.id}`} placeholder="URL картинки" className="w-full rounded-xl border border-ink/10 px-3 py-2" />
            <input name="duration_min" type="number" defaultValue={lesson.duration_min ?? ''} key={`d-${lesson.id}`} placeholder="Минуты" className="w-full rounded-xl border border-ink/10 px-3 py-2" />
            <textarea name="content" defaultValue={lesson.content ?? ''} key={`c-${lesson.id}`} rows={10} className="w-full rounded-xl border border-ink/10 px-3 py-2 text-sm" />
            <button className="btn w-full">Сохранить урок</button>
          </form>
        ) : (
          <p className="text-sm text-muted">Выберите урок слева, чтобы править текст, видео и картинку.</p>
        )}
      </aside>
    </div>
  )
}
