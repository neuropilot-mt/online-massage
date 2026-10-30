import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api'
import { useAuth } from '../../auth'
import type { CabinetCourse } from '../../types'

export function CabinetHomePage() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<CabinetCourse[] | null>(null)

  useEffect(() => {
    api<CabinetCourse[]>('/cabinet/courses').then(setCourses)
  }, [])

  return (
    <div>
      <h1 className="text-4xl font-medium tracking-tight">Здравствуйте, {user?.name}</h1>
      <p className="mt-2 text-muted">Здесь только курсы, к которым вам открыли доступ.</p>
      {courses === null ? (
        <p className="mt-8 text-muted">Загружаем курсы…</p>
      ) : courses.length === 0 ? (
        <div className="mt-8 max-w-xl rounded-2xl border border-line bg-white p-6">
          <p>Пока нет открытых курсов. Оставьте заявку на сайте — преподаватель зачислит вас вручную.</p>
          <Link to="/contacts" className="mt-4 inline-block font-medium text-forest">
            Оставить заявку
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {courses.map((course) => (
            <Link key={course.id} to={`/cabinet/courses/${course.id}`} className="rounded-2xl border border-line bg-white p-5 hover:border-forest/40">
              <h2 className="text-xl font-medium tracking-tight">{course.title}</h2>
              <p className="mt-2 text-sm text-muted">{course.excerpt}</p>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-paper-2">
                <div className="h-full bg-forest" style={{ width: `${course.progress.percent}%` }} />
              </div>
              <p className="mt-2 text-sm text-muted">
                {course.progress.completed} из {course.progress.total} уроков, {course.progress.percent}%
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
