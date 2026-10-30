import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api'
import { embedUrl } from '../../format'
import type { LessonDetail } from '../../types'

export function CabinetLessonPage() {
  const { id, lessonId } = useParams()
  const navigate = useNavigate()
  const [lesson, setLesson] = useState<LessonDetail | null>(null)

  async function load() {
    if (!lessonId) return
    setLesson(await api<LessonDetail>(`/cabinet/lessons/${lessonId}`))
  }

  useEffect(() => {
    void load()
  }, [lessonId])

  async function complete() {
    if (!lessonId) return
    await api(`/cabinet/lessons/${lessonId}/complete`, { method: 'POST' })
    await load()
    if (lesson?.next_id) navigate(`/cabinet/courses/${id}/lessons/${lesson.next_id}`)
  }

  if (!lesson) return <p className="text-muted">Загружаем урок…</p>
  const embed = embedUrl(lesson.video_url)

  return (
    <article className="mx-auto max-w-3xl">
      <Link to={`/cabinet/courses/${id}`} className="text-sm text-muted hover:text-ink">
        {lesson.course.title}
      </Link>
      <p className="mt-4 text-sm text-muted">{lesson.module.title}</p>
      <h1 className="mt-1 text-4xl font-medium tracking-tight">{lesson.title}</h1>
      {embed && (
        <div className="mt-6 overflow-hidden rounded-2xl bg-ink">
          <iframe title={lesson.title} src={embed} className="aspect-video w-full" allowFullScreen />
        </div>
      )}
      {lesson.image_url && <img src={lesson.image_url} alt="" className="mt-6 w-full rounded-2xl object-cover" />}
      {lesson.content && <div className="mt-6 whitespace-pre-line leading-relaxed text-ink/90">{lesson.content}</div>}
      <div className="mt-8 flex flex-wrap gap-3">
        {!lesson.completed && (
          <button type="button" onClick={() => void complete()} className="btn text-sm">
            Отметить пройденным
          </button>
        )}
        {lesson.completed && <span className="rounded-lg bg-mist px-4 py-2 text-sm text-forest">Урок пройден</span>}
        {lesson.prev_id && (
          <Link to={`/cabinet/courses/${id}/lessons/${lesson.prev_id}`} className="btn btn-quiet text-sm">
            Назад
          </Link>
        )}
        {lesson.next_id && (
          <Link to={`/cabinet/courses/${id}/lessons/${lesson.next_id}`} className="btn btn-quiet text-sm">
            Следующий урок
          </Link>
        )}
      </div>
    </article>
  )
}
