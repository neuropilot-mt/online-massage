import { useEffect, useState } from 'react'
import { api } from '../../api'
import type { Lead } from '../../types'

const labels: Record<Lead['status'], string> = {
  new: 'Новая',
  contacted: 'Связались',
  enrolled: 'Зачислен',
  rejected: 'Отклонена',
}

export function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])

  useEffect(() => {
    api<Lead[]>('/admin/leads').then(setLeads).catch(() => setLeads([]))
  }, [])

  async function updateStatus(id: number, status: Lead['status']) {
    const updated = await api<Lead>(`/admin/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })
    setLeads((items) => items.map((item) => (item.id === id ? updated : item)))
  }

  return (
    <div>
      <h1 className="font-display text-4xl">Заявки</h1>
      <p className="mt-2 text-sm text-muted">После разговора откройте ученику доступ на странице «Доступ».</p>
      <div className="mt-6 space-y-3">
        {leads.map((lead) => (
          <article key={lead.id} className="rounded-2xl bg-card p-4 ring-1 ring-ink/5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{lead.name}</p>
                <p className="text-sm text-muted">
                  {lead.phone} {lead.email ? `· ${lead.email}` : ''}
                </p>
                <p className="mt-1 text-sm">{lead.course?.title ?? 'Курс не выбран'}</p>
                {lead.message && <p className="mt-2 text-sm">{lead.message}</p>}
              </div>
              <select
                value={lead.status}
                onChange={(event) => void updateStatus(lead.id, event.target.value as Lead['status'])}
                className="rounded-xl border border-ink/10 px-3 py-2 text-sm"
              >
                {Object.entries(labels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
