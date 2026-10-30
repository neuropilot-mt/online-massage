import { Navigate, Outlet } from 'react-router-dom'
import { isStaff, useAuth } from '../auth'

export function RequireAuth() {
  const { user, ready } = useAuth()
  if (!ready) return <p className="p-10 text-center text-muted">Проверяем сессию…</p>
  if (!user) return <Navigate to="/login" replace />
  return <Outlet />
}

export function RequireStaff() {
  const { user, ready } = useAuth()
  if (!ready) return <p className="p-10 text-center text-muted">Проверяем сессию…</p>
  if (!user) return <Navigate to="/login" replace />
  if (!isStaff(user.role)) return <Navigate to="/cabinet" replace />
  return <Outlet />
}
