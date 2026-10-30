import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { isStaff, useAuth } from '../auth'
import { Logo } from './Logo'

const links = [
  { to: '/cabinet', label: 'Мои курсы', end: true },
  { to: '/cabinet/certificates', label: 'Сертификаты' },
  { to: '/cabinet/profile', label: 'Профиль' },
]

export function CabinetLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <Logo />
          <nav className="flex items-center gap-4 overflow-x-auto text-sm">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => (isActive ? 'font-medium text-ink' : 'text-muted hover:text-ink')}
              >
                {link.label}
              </NavLink>
            ))}
            {user && isStaff(user.role) && (
              <Link to="/admin" className="text-muted hover:text-ink">
                Админка
              </Link>
            )}
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
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-5 py-10">
        <Outlet />
      </div>
    </div>
  )
}
