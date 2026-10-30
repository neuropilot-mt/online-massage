import { createContext, createElement, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { api } from './api'
import type { AuthResponse, Role, User } from './types'

type AuthContextValue = {
  user: User | null
  ready: boolean
  login: (email: string, password: string) => Promise<User>
  register: (payload: { name: string; email: string; phone?: string; password: string; password_confirmation: string }) => Promise<User>
  logout: () => Promise<void>
  setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('soma_token')
    if (!token) {
      setReady(true)
      return
    }
    api<User>('/me')
      .then(setUser)
      .catch(() => {
        localStorage.removeItem('soma_token')
        setUser(null)
      })
      .finally(() => setReady(true))
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      ready,
      setUser,
      async login(email, password) {
        const data = await api<AuthResponse>('/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        })
        localStorage.setItem('soma_token', data.token)
        setUser(data.user)
        return data.user
      },
      async register(payload) {
        const data = await api<AuthResponse>('/register', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        localStorage.setItem('soma_token', data.token)
        setUser(data.user)
        return data.user
      },
      async logout() {
        try {
          await api('/logout', { method: 'POST' })
        } catch {
          /* token already invalid */
        }
        localStorage.removeItem('soma_token')
        setUser(null)
      },
    }),
    [user, ready],
  )

  return createElement(AuthContext.Provider, { value }, children)
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('AuthProvider is missing')
  return ctx
}

export function isStaff(role?: Role) {
  return role === 'admin' || role === 'teacher' || role === 'moderator'
}

export function canEnroll(role?: Role) {
  return role === 'admin' || role === 'teacher'
}

export function canManageUsers(role?: Role) {
  return role === 'admin'
}

export function canCreate(role?: Role) {
  return role === 'admin' || role === 'teacher'
}
