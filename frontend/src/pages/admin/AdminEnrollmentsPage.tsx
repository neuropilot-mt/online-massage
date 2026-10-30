import { useEffect, useState, type FormEvent } from 'react'
import { api } from '../../api'
import type { AdminCourse, Enrollment } from '../../types'

type Student = { id: number; name: string; email: string; phone: string | null }

export function AdminEnrollmentsPage() {
  const [items, setItems] = useState<Enrollment[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [courses, setCourses] = useState<AdminCourse[]>([])

  async function load() {
    const [nextItems, nextStudents, nextCourses] = await Promise.all([
      api<Enrollment[]>('/admin/enrollments'),
      api<Student[]>('/admin/students'),
      api<AdminCourse[]>('/admin/courses'),
    ])
    setItems(nextItems)
    setStudents(nextStudents)
    setCourses(nextCourses)
  }

  useEffect(() => {
    void load()
  }, [])

  async function grant(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    await api('/admin/enrollments', {
      method: 'POST',
      body: JSON.stringify({
        user_id: Number(form.get('user_id')),
        course_id: Number(form.get('course_id')),
      }),
    })
    await load()
  }

  async function revoke(id: number) {
    await api(`/admin/enrollments/${id}`, { method: 'DELETE' })
    await load()
  }

  return (
    <div>
      <h1 className="font-display text-4xl">Доступ к курсам</h1>
      <form onSubmit={grant} className="mt-6 grid gap-3 rounded-3xl bg-card p-4 ring-1 ring-ink/5 md:grid-cols-[1fr_1fr_auto]">
        <select name="user_id" required className="rounded-xl border border-ink/10 px-3 py-2">
          <option value="">Ученик</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name} · {student.email}
            </option>
          ))}
        </select>
        <select name="course_id" required className="rounded-xl border border-ink/10 px-3 py-2">
          <option value="">Курс</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
        <button className="rounded-full bg-forest px-4 py-2 font-semibold text-card">Выдать доступ</button>
      </form>
      <div className="mt-6 space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-2xl bg-card px-4 py-3 text-sm ring-1 ring-ink/5">
            <span>
              {item.user.name} → {item.course.title}
            </span>
            <button type="button" className="text-clay" onClick={() => void revoke(item.id)}>
              Закрыть
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
