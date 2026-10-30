import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api'
import { LeadForm } from '../components/LeadForm'
import { formatPrice, formatSlot, spotsLabel } from '../format'
import type { CourseCard, PublicCourse } from '../types'

export function CoursePage() {
  const { slug } = useParams()
  const [course, setCourse] = useState<PublicCourse | null>(null)
  const [catalog, setCatalog] = useState<CourseCard[] | null>(null)

  useEffect(() => {
    if (!slug) return
    setCourse(null)
    setCatalog(null)
    api<PublicCourse>(`/public/courses/${slug}`).then(setCourse)
    api<CourseCard[]>('/public/courses').then(setCatalog)
  }, [slug])

  if (!course) return <p className="mx-auto max-w-6xl px-5 py-24 text-muted">Загружаем курс…</p>

  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <Link to="/courses" className="text-sm text-muted hover:text-ink">
        Все курсы
      </Link>
      <div className="mt-4 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <div>
          <h1 className="max-w-3xl text-4xl font-medium leading-tight tracking-tight md:text-5xl">{course.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">{course.excerpt}</p>
          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            {course.level && (
              <div>
                <dt className="text-muted">Уровень</dt>
                <dd className="font-medium">{course.level}</dd>
              </div>
            )}
            {course.format && (
              <div>
                <dt className="text-muted">Формат</dt>
                <dd className="font-medium">{course.format}</dd>
              </div>
            )}
            {course.duration_hours != null && (
              <div>
                <dt className="text-muted">Объём</dt>
                <dd className="font-medium">{course.duration_hours} ак. ч.</dd>
              </div>
            )}
            <div>
              <dt className="text-muted">Стоимость</dt>
              <dd className="font-medium">{formatPrice(course.price)}</dd>
            </div>
          </dl>
          {course.cover_url && (
            <img src={course.cover_url} alt="" className="mt-8 aspect-[16/9] w-full rounded-2xl bg-paper-2 object-cover" />
          )}
          <h2 className="mt-12 text-2xl font-medium tracking-tight">О курсе</h2>
          <p className="mt-4 max-w-2xl whitespace-pre-line leading-relaxed text-muted">{course.description}</p>

          <h2 className="mt-12 text-2xl font-medium tracking-tight">Программа</h2>
          <div className="mt-4 border-b border-line">
            {course.modules.map((module, index) => (
              <section key={module.id} className="grid gap-3 border-t border-line py-5 sm:grid-cols-[2.5rem_1fr]">
                <p className="text-sm text-muted">{index + 1}</p>
                <div>
                  <h3 className="text-lg font-medium tracking-tight">{module.title}</h3>
                  {module.description && <p className="mt-1 text-sm text-muted">{module.description}</p>}
                  <ul className="mt-3 space-y-1.5 text-sm">
                    {module.lessons.map((lesson) => (
                      <li key={lesson.id} className="flex justify-between gap-4">
                        <span>{lesson.title}</span>
                        {lesson.duration_min ? <span className="shrink-0 text-muted">{lesson.duration_min} мин</span> : null}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            ))}
          </div>

          {course.schedule.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-medium tracking-tight">Ближайшие группы</h2>
              <ul className="mt-4 border-b border-line">
                {course.schedule.map((item) => {
                  const slot = formatSlot(item.starts_at)
                  return (
                    <li key={item.id} className="grid gap-1 border-t border-line py-4 sm:grid-cols-[6.5rem_1fr_auto] sm:items-baseline">
                      <div>
                        <p className="font-medium">{slot.date}</p>
                        <p className="text-sm text-muted">{slot.time}</p>
                      </div>
                      <p className="text-sm text-muted">{item.city}</p>
                      {item.spots != null && <p className="text-sm text-muted">{spotsLabel(item.spots)}</p>}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>
        <div className="lg:sticky lg:top-24">
          {catalog && <LeadForm courses={catalog} selectedCourseId={course.id} />}
        </div>
      </div>
    </main>
  )
}
