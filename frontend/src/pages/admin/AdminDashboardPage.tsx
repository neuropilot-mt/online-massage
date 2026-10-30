import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api'
import { canEnroll, useAuth } from '../../auth'
import type { Lead } from '../../types'

type Dashboard = {
  leads_new: number
  leads_total: number
  students: number
  courses: number
  enrollments: number
  recent_leads: Lead[]
}

export function AdminDashboardPage() {
  const { user } = useAuth()
  const [data, setData] = useState<Dashboard | null>(null)

  useEffect(() => {
    api<Dashboard>('/admin/dashboard').then(setData)
  }, [])

  if (!data) return <p>Загрузка…</p>

  const cards = [
    ['Новые заявки', data.leads_new],
    ['Ученики', data.students],
    ['Курсы', data.courses],
    ['Доступы', data.enrollments],
  ]

  return (
    <div>
      <h1 className="font-display text-4xl">Обзор</h1>
      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        {cards.map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-line bg-white p-4">
            <p className="text-sm text-muted">{label}</p>
            <p className="mt-1 text-3xl font-medium tabular-nums tracking-tight">{value}</p>
          </div>
        ))}
      </div>
      <h2 className="mt-10 font-display text-2xl">Последние заявки</h2>
      <div className="mt-3 space-y-2">
        {data.recent_leads.map((lead) => (
          <div key={lead.id} className="flex justify-between rounded-2xl bg-card px-4 py-3 text-sm ring-1 ring-ink/5">
            <span>
              {lead.name} · {lead.phone}
            </span>
            <span className="text-muted">{lead.course?.title ?? 'без курса'}</span>
          </div>
        ))}
      </div>
      {canEnroll(user?.role) && (
        <Link to="/admin/leads" className="mt-4 inline-block text-sm font-semibold text-forest">
          Все заявки
        </Link>
      )}
    </div>
  )
}
