import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth, isStaff } from '../auth'
import { Logo } from './Logo'

const nav = [
  { to: '/courses', label: 'Курсы' },
  { to: '/schedule', label: 'Расписание' },
  { to: '/about', label: 'О школе' },
  { to: '/contacts', label: 'Контакты' },
]

export function PublicLayout() {
  const { user } = useAuth()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  const account = user ? (
    <Link to={isStaff(user.role) ? '/admin' : '/cabinet'} className="font-medium text-ink">
      {isStaff(user.role) ? 'Админка' : 'Кабинет'}
    </Link>
  ) : (
    <Link to="/login" className="text-muted hover:text-ink">
      Войти
    </Link>
  )

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <Logo />
          <nav className="hidden items-center gap-7 text-sm md:flex">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive ? 'font-medium text-ink' : 'text-muted hover:text-ink')}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden sm:inline">{account}</span>
            <Link to="/contacts" className="btn px-4 py-2 text-sm">
              Записаться
            </Link>
            <button
              type="button"
              className="inline-flex h-11 items-center px-1 text-sm md:hidden"
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen((value) => !value)}
            >
              {open ? 'Закрыть' : 'Меню'}
            </button>
          </div>
        </div>
        {open && (
          <div id="site-menu" className="border-t border-line bg-white md:hidden">
            <nav className="mx-auto grid max-w-6xl gap-1 px-5 py-3 text-sm">
              {nav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded-lg px-2 py-3 ${isActive ? 'bg-mist font-medium text-ink' : 'text-muted'}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <div className="px-2 py-3 sm:hidden">{account}</div>
            </nav>
          </div>
        )}
      </header>
      <Outlet />
      <footer className="mt-20 border-t border-line">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-3">
          <div>
            <Logo className="h-10" />
            <p className="mt-3 max-w-xs text-sm text-muted">Академия массажа: онлайн-кабинет и практика в Гомеле.</p>
          </div>
          <div className="text-sm">
            <p>Гомель, ул. Ленина, 4</p>
            <p className="mt-1">
              <a href="tel:+375290000000" className="hover:text-forest">
                +375 (29) 000-00-00
              </a>
            </p>
            <p className="mt-1">
              <a href="mailto:hello@proxima-skill.academy" className="hover:text-forest">
                hello@proxima-skill.academy
              </a>
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/courses" className="hover:text-forest">
              Курсы
            </Link>
            <Link to="/schedule" className="hover:text-forest">
              Расписание
            </Link>
            <Link to="/login" className="hover:text-forest">
              Кабинет
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
