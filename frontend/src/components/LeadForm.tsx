import { useState, type FormEvent } from 'react'
import { api, firstError } from '../api'
import type { CourseCard } from '../types'

export function LeadForm({ courses, selectedCourseId }: { courses: CourseCard[]; selectedCourseId?: number }) {
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formElement = event.currentTarget
    const form = new FormData(formElement)
    try {
      await api('/public/leads', {
        method: 'POST',
        body: JSON.stringify({
          name: form.get('name'),
          phone: form.get('phone'),
          email: form.get('email') || null,
          course_id: Number(form.get('course_id')) || null,
          message: form.get('message') || null,
        }),
      })
      setStatus('ok')
      setMessage('Заявка отправлена. Мы свяжемся с вами, откроем доступ к курсу и подскажем ближайшую группу.')
      formElement.reset()
    } catch (error) {
      setStatus('error')
      setMessage(firstError(error))
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-2xl border border-line bg-white p-5 sm:p-6">
      <div>
        <h3 className="text-2xl font-medium tracking-tight">Заявка на обучение</h3>
        <p className="mt-2 text-sm text-muted">Оставьте контакты. Доступ в кабинет открывает преподаватель после разговора.</p>
      </div>
      <label className="grid gap-1.5 text-sm">
        <span>Имя</span>
        <input name="name" required autoComplete="name" className="field" />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span>Телефон</span>
        <input name="phone" required autoComplete="tel" className="field" />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span>Email</span>
        <input name="email" type="email" autoComplete="email" className="field" />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span>Курс</span>
        <select name="course_id" defaultValue={selectedCourseId ?? ''} className="field">
          <option value="">Пока не выбран</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1.5 text-sm">
        <span>Комментарий</span>
        <textarea name="message" rows={3} className="field" placeholder="Удобное время, онлайн или группа" />
      </label>
      <button type="submit" className="btn">
        Отправить заявку
      </button>
      {status !== 'idle' && <p className={status === 'ok' ? 'text-sm text-forest' : 'text-sm text-clay'}>{message}</p>}
    </form>
  )
}
