import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CourseCardView } from '../components/CourseCardView'
import { LeadForm } from '../components/LeadForm'
import { api } from '../api'
import { formatSlot, spotsLabel } from '../format'
import type { HomeData } from '../types'

const ways = [
  ['Онлайн-кабинет', 'Видео, тексты и прогресс только по своему курсу.'],
  ['Практика в Минске', 'Мини-группы по расписанию: ставим руки, а не только теорию.'],
  ['Сертификат', 'Документ академии, а по профпрограммам — государственного образца.'],
]

export function HomePage() {
  const [data, setData] = useState<HomeData | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  useEffect(() => {
    api<HomeData>('/public/home').then(setData)
  }, [])

  if (!data) return <p className="mx-auto max-w-6xl px-5 py-24 text-muted">Загружаем…</p>

  const heroBanner = data.banners[0]
  const photo = heroBanner?.image_url ?? data.courses[0]?.cover_url

  return (
    <main>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div>
          <h1 className="max-w-xl text-4xl font-medium leading-[1.15] tracking-tight md:text-5xl">
            {data.settings.hero_title}
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted">{data.settings.hero_subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/courses" className="btn">
              Смотреть курсы
            </Link>
            <a href="#enroll" className="btn btn-quiet">
              Оставить заявку
            </a>
          </div>
        </div>
        <figure>
          {photo ? (
            <img src={photo} alt="" className="aspect-[5/4] w-full rounded-2xl bg-paper-2 object-cover lg:aspect-[4/5]" />
          ) : (
            <div className="aspect-[5/4] rounded-2xl bg-mist lg:aspect-[4/5]" />
          )}
          {heroBanner && (
            <figcaption className="mt-3 max-w-sm text-sm text-muted">
              <span className="font-medium text-ink">{heroBanner.title}.</span> {heroBanner.subtitle}
            </figcaption>
          )}
        </figure>
      </section>

      {data.banners.length > 1 && (
        <section className="border-t border-line">
          <ul className="mx-auto max-w-6xl divide-y divide-line px-5">
            {data.banners.slice(1).map((banner) => (
              <li key={banner.id}>
                <Link to={banner.cta_href || '/courses'} className="grid gap-1 py-5 hover:text-forest sm:grid-cols-[9rem_1fr] sm:gap-6">
                  <span className="text-sm text-muted">{banner.badge}</span>
                  <span>
                    <span className="font-medium">{banner.title}</span>
                    {banner.subtitle && <span className="mt-1 block text-sm text-muted">{banner.subtitle}</span>}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="border-t border-line">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-3">
          {ways.map(([title, text]) => (
            <div key={title}>
              <h2 className="text-lg font-medium tracking-tight">{title}</h2>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <h2 className="max-w-lg text-3xl font-medium leading-tight tracking-tight md:text-4xl">
              Сертификаты, которые можно показать работодателю
            </h2>
            <p className="mt-4 max-w-xl text-muted">
              По программам профессиональной подготовки выпускник получает свидетельство государственного образца. По коротким
              курсам — сертификат академии SOMA. Документ оформляет преподаватель, после этого он появляется в кабинете.
            </p>
            <ul className="mt-6 max-w-xl space-y-2 text-sm">
              <li>В документе фиксируются фамилия, программа и объём часов.</li>
              <li>Государственный образец нужен для трудоустройства и подтверждения квалификации.</li>
              <li>Электронный дубликат открывается в личном кабинете.</li>
            </ul>
          </div>
          <div className="divide-y divide-line border-y border-line">
            {(data.certificates ?? []).map((item) => (
              <article key={item.id} className="flex gap-4 py-4">
                {item.image_url && (
                  <img src={item.image_url} alt="" className="h-20 w-16 shrink-0 rounded-lg bg-paper-2 object-cover" />
                )}
                <div>
                  {item.is_state_sample && <p className="text-sm text-forest">Государственный образец</p>}
                  <h3 className="text-lg font-medium tracking-tight">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted">{item.subtitle}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="mb-2 flex items-end justify-between gap-4">
          <h2 className="text-3xl font-medium tracking-tight">Курсы</h2>
          <Link to="/courses" className="text-sm font-medium text-forest">
            Все программы
          </Link>
        </div>
        <div className="border-b border-line">
          {data.courses.map((course) => (
            <CourseCardView key={course.id} course={course} />
          ))}
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="text-3xl font-medium tracking-tight">Ближайшие группы</h2>
            <p className="mt-3 max-w-sm text-muted">Очная отработка в Минске. Онлайн-материалы открываются после зачисления.</p>
            <Link to="/schedule" className="mt-4 inline-block text-sm font-medium text-forest">
              Полное расписание
            </Link>
          </div>
          {data.schedule.length === 0 ? (
            <p className="border-t border-line pt-4 text-muted">Ближайших групп пока нет. Оставьте заявку — напишем, когда откроется набор.</p>
          ) : (
            <ul className="border-b border-line">
              {data.schedule.map((item) => {
                const slot = formatSlot(item.starts_at)
                return (
                  <li key={item.id} className="grid gap-1 border-t border-line py-4 sm:grid-cols-[6.5rem_1fr_auto] sm:items-baseline sm:gap-4">
                    <div>
                      <p className="font-medium">{slot.date}</p>
                      <p className="text-sm text-muted">{slot.time}</p>
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted">{item.city}</p>
                    </div>
                    {item.spots != null && <p className="text-sm text-muted">{spotsLabel(item.spots)}</p>}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14">
        <h2 className="text-3xl font-medium tracking-tight">Отзывы</h2>
        <div className="mt-8 grid gap-10 md:grid-cols-3">
          {data.testimonials.map((item) => (
            <blockquote key={item.id} className="flex flex-col">
              <p className="flex-1 text-[1.05rem] leading-relaxed">{item.text}</p>
              <footer className="mt-4 text-sm">
                <span className="font-medium">{item.name}</span>
                <span className="mt-0.5 block text-muted">{item.role}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section id="enroll" className="border-t border-line">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-14 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-medium tracking-tight">Частые вопросы</h2>
            <div className="mt-6 border-b border-line">
              {data.faqs.map((faq, index) => {
                const open = openFaq === index
                return (
                  <div key={faq.id} className="border-t border-line">
                    <button
                      type="button"
                      className="flex w-full items-start justify-between gap-4 py-4 text-left"
                      aria-expanded={open}
                      onClick={() => setOpenFaq(open ? null : index)}
                    >
                      <span className="font-medium">{faq.question}</span>
                      <span className="text-muted" aria-hidden="true">
                        {open ? '–' : '+'}
                      </span>
                    </button>
                    {open && <p className="max-w-xl pb-4 text-sm leading-relaxed text-muted">{faq.answer}</p>}
                  </div>
                )
              })}
            </div>
          </div>
          <LeadForm courses={data.courses} />
        </div>
      </section>
    </main>
  )
}
