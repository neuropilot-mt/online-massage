import { useEffect, useState } from 'react'
import { api } from '../../api'
import type { IssuedCertificate } from '../../types'

export function CabinetCertificatesPage() {
  const [items, setItems] = useState<IssuedCertificate[] | null>(null)

  useEffect(() => {
    api<IssuedCertificate[]>('/cabinet/certificates').then(setItems)
  }, [])

  return (
    <div>
      <h1 className="text-4xl font-medium tracking-tight">Мои сертификаты</h1>
      <p className="mt-2 text-muted">Документы появляются здесь, когда преподаватель их оформит.</p>
      {items === null ? (
        <p className="mt-8 text-muted">Загружаем…</p>
      ) : items.length === 0 ? (
        <p className="mt-8 max-w-xl rounded-2xl border border-line bg-white p-6 text-sm text-muted">Пока нет выданных сертификатов.</p>
      ) : (
        <div className="mt-8 space-y-3">
          {items.map((item) => (
            <article key={item.id} className="rounded-2xl border border-line bg-white p-5">
              {item.certificate.is_state_sample && <p className="text-sm text-forest">Государственный образец</p>}
              <h2 className="text-xl font-medium tracking-tight">{item.certificate.title}</h2>
              <p className="mt-1 text-sm text-muted">
                {item.course?.title ?? 'Без привязки к курсу'}
                {item.number ? `, № ${item.number}` : ''}
                {item.issued_on ? `, ${new Date(item.issued_on).toLocaleDateString('ru-RU')}` : ''}
              </p>
              {item.file_url && (
                <a href={item.file_url} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-medium text-forest">
                  Открыть файл
                </a>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
