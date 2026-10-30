import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../format'
import type { CourseCard } from '../types'

function Cover({ src }: { src: string | null }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) return <div className="aspect-[3/2] rounded-xl bg-mist" />
  return (
    <img
      src={src}
      alt=""
      onError={() => setFailed(true)}
      className="aspect-[3/2] w-full rounded-xl bg-paper-2 object-cover"
    />
  )
}

export function CourseCardView({ course }: { course: CourseCard }) {
  return (
    <Link
      to={`/courses/${course.slug}`}
      className="group grid gap-4 border-t border-line py-6 sm:grid-cols-[11rem_1fr] sm:items-center sm:gap-6"
    >
      <Cover src={course.cover_url} />
      <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end sm:gap-8">
        <div>
          <p className="text-sm text-muted">{course.level || course.format}</p>
          <h3 className="mt-1 text-xl font-medium tracking-tight group-hover:text-forest">{course.title}</h3>
          {course.excerpt && <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">{course.excerpt}</p>}
        </div>
        <div className="text-sm sm:text-right">
          <p className="font-medium">{formatPrice(course.price)}</p>
          <p className="text-muted">{course.duration_hours ? `${course.duration_hours} ак. ч.` : 'Гибкий график'}</p>
        </div>
      </div>
    </Link>
  )
}
