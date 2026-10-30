import { useEffect, useState } from 'react'
import { CourseCardView } from '../components/CourseCardView'
import { api } from '../api'
import type { CourseCard } from '../types'

export function CoursesPage() {
  const [courses, setCourses] = useState<CourseCard[] | null>(null)

  useEffect(() => {
    api<CourseCard[]>('/public/courses').then(setCourses)
  }, [])

  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="text-4xl font-medium tracking-tight md:text-5xl">Курсы массажа</h1>
      <p className="mt-4 max-w-xl text-lg text-muted">
        Программы для старта с нуля и повышения квалификации. Онлайн-материалы — в кабинете, практика — по расписанию в Минске.
      </p>
      {courses === null ? (
        <p className="mt-10 text-muted">Загружаем курсы…</p>
      ) : courses.length === 0 ? (
        <p className="mt-10 text-muted">Сейчас нет опубликованных курсов.</p>
      ) : (
        <div className="mt-8 border-b border-line">
          {courses.map((course) => (
            <CourseCardView key={course.id} course={course} />
          ))}
        </div>
      )}
    </main>
  )
}
