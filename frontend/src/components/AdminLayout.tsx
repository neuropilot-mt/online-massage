import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { canEnroll, canManageUsers, useAuth } from '../auth'
import { Logo } from './Logo'

export function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const links = [
    { to: '/admin', label: 'Обзор', end: true },
    { to: '/admin/courses', label: 'Курсы' },
    { to: '/admin/certificates', label: 'Сертификаты' },
    { to: '/admin/banners', label: 'Баннеры' },
    { to: '/admin/schedule', label: 'Расписание' },
    { to: '/admin/settings', label: 'Сайт' },
    ...(canEnroll(user?.role) ? [{ to: '/admin/leads', label: 'Заявки' }, { to: '/admin/enrollments', label: 'Доступ' }] : []),
    ...(canManageUsers(user?.role) ? [{ to: '/admin/users', label: 'Пользователи' }] : []),
  ]

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <Logo to="/admin" />
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted">{user?.role_label}</span>
            <Link to="/cabinet" className="text-muted hover:text-ink">
              Кабинет
            </Link>
            <Link to="/" className="text-muted hover:text-ink">
              Сайт
            </Link>
            <button
              type="button"
              className="text-muted hover:text-ink"
              onClick={async () => {
                await logout()
                navigate('/')
              }}
            >
              Выйти
            </button>
          </div>
        </div>
      </header>
      <div className="mx-auto flex max-w-6xl gap-8 px-5 py-8">
        <aside className="hidden w-44 shrink-0 md:block">
          <nav className="grid gap-0.5 text-sm">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 ${isActive ? 'bg-mist font-medium text-ink' : 'text-muted hover:bg-white hover:text-ink'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <div className="min-w-0 flex-1">
          <nav className="mb-6 flex gap-2 overflow-x-auto md:hidden">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `shrink-0 rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-mist font-medium text-ink' : 'text-muted'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
