import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../../api'
import type { CabinetCourseDetail } from '../../types'

export function CabinetCoursePage() {
  const { id } = useParams()
  const [course, setCourse] = useState<CabinetCourseDetail | null>(null)

  useEffect(() => {
    if (!id) return
    api<CabinetCourseDetail>(`/cabinet/courses/${id}`).then(setCourse)
  }, [id])

  if (!course) return <p className="text-muted">Открываем курс…</p>

  const firstOpen = course.modules.flatMap((module) => module.lessons).find((lesson) => !lesson.completed) ?? course.modules[0]?.lessons[0]

  return (
    <div>
      <Link to="/cabinet" className="text-sm text-muted hover:text-ink">
        Все курсы
      </Link>
      <h1 className="mt-3 text-4xl font-medium tracking-tight">{course.title}</h1>
      <p className="mt-2 text-muted">{course.progress.percent}% пройдено</p>
      {firstOpen && (
        <Link to={`/cabinet/courses/${course.id}/lessons/${firstOpen.id}`} className="btn mt-5 text-sm">
          Продолжить
        </Link>
      )}
      <div className="mt-8 space-y-4">
        {course.modules.map((module) => (
          <section key={module.id} className="rounded-2xl border border-line bg-white px-5">
            <h2 className="pt-5 text-lg font-medium tracking-tight">{module.title}</h2>
            <ul className="mt-2 divide-y divide-line">
              {module.lessons.map((lesson) => (
                <li key={lesson.id}>
                  <Link to={`/cabinet/courses/${course.id}/lessons/${lesson.id}`} className="flex items-center justify-between gap-4 py-3 text-sm hover:text-forest">
                    <span>{lesson.title}</span>
                    <span className="shrink-0 text-muted">
                      {lesson.completed ? 'Пройден' : ''}
                      {lesson.completed && lesson.duration_min ? ', ' : ''}
                      {lesson.duration_min ? `${lesson.duration_min} мин` : ''}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
