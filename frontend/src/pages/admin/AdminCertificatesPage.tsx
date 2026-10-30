import { useEffect, useState, type FormEvent } from 'react'
import { api } from '../../api'
import { canCreate, canEnroll, useAuth } from '../../auth'
import type { AdminCourse, CertificateType, IssuedCertificate } from '../../types'

type Student = { id: number; name: string; email: string; phone: string | null }

export function AdminCertificatesPage() {
  const { user } = useAuth()
  const [types, setTypes] = useState<CertificateType[]>([])
  const [issued, setIssued] = useState<IssuedCertificate[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [courses, setCourses] = useState<AdminCourse[]>([])
  const allowCreate = canCreate(user?.role)
  const allowIssue = canEnroll(user?.role)

  async function load() {
    setTypes(await api<CertificateType[]>('/admin/certificates'))
    if (allowIssue) {
      const [nextIssued, nextStudents, nextCourses] = await Promise.all([
        api<IssuedCertificate[]>('/admin/issued-certificates'),
        api<Student[]>('/admin/students'),
        api<AdminCourse[]>('/admin/courses'),
      ])
      setIssued(nextIssued)
      setStudents(nextStudents)
      setCourses(nextCourses)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  async function createType(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formElement = event.currentTarget
    const form = new FormData(formElement)
    await api('/admin/certificates', {
      method: 'POST',
      body: JSON.stringify({
        title: form.get('title'),
        subtitle: form.get('subtitle'),
        description: form.get('description'),
        image_url: form.get('image_url'),
        is_state_sample: form.get('is_state_sample') === 'on',
        published: true,
      }),
    })
    formElement.reset()
    await load()
  }

  async function togglePublished(item: CertificateType) {
    await api(`/admin/certificates/${item.id}`, {
      method: 'PUT',
      body: JSON.stringify({ published: !item.published }),
    })
    await load()
  }

  async function issue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formElement = event.currentTarget
    const form = new FormData(formElement)
    await api('/admin/issued-certificates', {
      method: 'POST',
      body: JSON.stringify({
        certificate_id: Number(form.get('certificate_id')),
        user_id: Number(form.get('user_id')),
        course_id: Number(form.get('course_id')) || null,
        number: form.get('number') || null,
        issued_on: form.get('issued_on') || null,
        file_url: form.get('file_url') || null,
      }),
    })
    formElement.reset()
    await load()
  }

  async function revoke(id: number) {
    await api(`/admin/issued-certificates/${id}`, { method: 'DELETE' })
    await load()
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-4xl">Сертификаты</h1>
        <p className="mt-2 text-sm text-muted">
          Типы документов показываются на главной. Выданные сертификаты ученик видит в кабинете.
        </p>
      </div>

      {allowCreate && (
        <form onSubmit={createType} className="grid gap-3 rounded-3xl bg-card p-4 ring-1 ring-ink/5">
          <h2 className="font-display text-2xl">Новый тип документа</h2>
          <input name="title" required placeholder="Название, например Свидетельство гос. образца" className="rounded-xl border border-ink/10 px-3 py-2" />
          <input name="subtitle" placeholder="Короткий подзаголовок" className="rounded-xl border border-ink/10 px-3 py-2" />
          <textarea name="description" placeholder="Описание для сайта" rows={3} className="rounded-xl border border-ink/10 px-3 py-2" />
          <input name="image_url" placeholder="URL изображения бланка" className="rounded-xl border border-ink/10 px-3 py-2" />
          <label className="text-sm">
            <input name="is_state_sample" type="checkbox" className="mr-2" />
            Государственный образец
          </label>
          <button className="rounded-full bg-forest px-4 py-2 font-semibold text-card">Сохранить тип</button>
        </form>
      )}

      <div className="space-y-3">
        {types.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-3 rounded-2xl bg-card px-4 py-3 ring-1 ring-ink/5">
            <div>
              <p className="font-semibold">
                {item.title}
                {item.is_state_sample ? ' · гос. образец' : ''}
              </p>
              <p className="text-sm text-muted">{item.subtitle}</p>
            </div>
            <button type="button" className="text-sm" onClick={() => void togglePublished(item)}>
              {item.published ? 'Скрыть с сайта' : 'Показать на сайте'}
            </button>
          </div>
        ))}
      </div>

      {allowIssue && (
        <section>
          <h2 className="font-display text-3xl">Выдать ученику</h2>
          <form onSubmit={issue} className="mt-4 grid gap-3 rounded-3xl bg-card p-4 ring-1 ring-ink/5 md:grid-cols-2">
            <select name="certificate_id" required className="rounded-xl border border-ink/10 px-3 py-2">
              <option value="">Тип документа</option>
              {types.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
            <select name="user_id" required className="rounded-xl border border-ink/10 px-3 py-2">
              <option value="">Ученик</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} · {student.email}
                </option>
              ))}
            </select>
            <select name="course_id" className="rounded-xl border border-ink/10 px-3 py-2">
              <option value="">Курс (необязательно)</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
            <input name="number" placeholder="Номер, например SOMA-2026-014" className="rounded-xl border border-ink/10 px-3 py-2" />
            <input name="issued_on" type="date" className="rounded-xl border border-ink/10 px-3 py-2" />
            <input name="file_url" placeholder="Ссылка на скан / PDF" className="rounded-xl border border-ink/10 px-3 py-2" />
            <button className="btn md:col-span-2">Выдать сертификат</button>
          </form>
          <div className="mt-4 space-y-2">
            {issued.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-2xl bg-card px-4 py-3 text-sm ring-1 ring-ink/5">
                <span>
                  {item.user?.name} · {item.certificate.title}
                  {item.number ? ` · № ${item.number}` : ''}
                </span>
                <button type="button" className="text-clay" onClick={() => void revoke(item.id)}>
                  Удалить
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
