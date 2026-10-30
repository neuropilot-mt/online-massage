import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api'
import { canCreate } from '../../auth'
import { useAuth } from '../../auth'
import type { AdminCourse } from '../../types'

export function AdminCoursesPage() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<AdminCourse[]>([])

  useEffect(() => {
    api<AdminCourse[]>('/admin/courses').then(setCourses)
  }, [])

  async function createCourse() {
    const created = await api<AdminCourse>('/admin/courses', {
      method: 'POST',
      body: JSON.stringify({ title: 'Новый курс', published: false }),
    })
    window.location.href = `/admin/courses/${created.id}`
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl">Курсы</h1>
        {canCreate(user?.role) && (
          <button type="button" onClick={() => void createCourse()} className="rounded-full bg-forest px-4 py-2 text-sm font-semibold text-card">
            Создать курс
          </button>
        )}
      </div>
      <div className="mt-6 space-y-3">
        {courses.map((course) => (
          <Link key={course.id} to={`/admin/courses/${course.id}`} className="flex items-center justify-between rounded-2xl bg-card px-4 py-4 ring-1 ring-ink/5">
            <div>
              <p className="font-semibold">{course.title}</p>
              <p className="text-xs text-muted">
                {course.published ? 'опубликован' : 'черновик'} · {course.modules_count ?? 0} модулей · {course.enrollments_count ?? 0} учеников
              </p>
            </div>
            <span className="text-sm text-forest">Редактировать</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
