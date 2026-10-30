import { useEffect, useState } from 'react'
import { api } from '../api'
import type { Settings, Testimonial } from '../types'

export function AboutPage() {
  const [about, setAbout] = useState<string>('')
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    api<{ settings: Settings; testimonials: Testimonial[] }>('/public/about').then((data) => {
      setAbout(data.settings.about ?? '')
      setTestimonials(data.testimonials)
      setReady(true)
    })
  }, [])

  return (
    <main className="mx-auto max-w-2xl px-5 py-12">
      <h1 className="text-4xl font-medium tracking-tight md:text-5xl">О академии SOMA</h1>
      {ready ? (
        <p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-muted">{about}</p>
      ) : (
        <p className="mt-6 text-muted">Загружаем…</p>
      )}
      {testimonials.length > 0 && (
        <div className="mt-12 border-b border-line">
          {testimonials.map((item) => (
            <blockquote key={item.id} className="border-t border-line py-6">
              <p className="text-lg leading-relaxed">{item.text}</p>
              <footer className="mt-3 text-sm">
                <span className="font-medium">{item.name}</span>
                {item.role && <span className="mt-0.5 block text-muted">{item.role}</span>}
              </footer>
            </blockquote>
          ))}
        </div>
      )}
    </main>
  )
}
