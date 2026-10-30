const API =
  import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? 'http://localhost:8000/api' : '/api')

export class ApiError extends Error {
  status: number
  errors: Record<string, string[]>

  constructor(message: string, status: number, errors: Record<string, string[]> = {}) {
    super(message)
    this.status = status
    this.errors = errors
  }
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('soma_token')
  const headers = new Headers(options.headers)
  headers.set('Accept', 'application/json')
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const response = await fetch(`${API}${path}`, { ...options, headers })
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new ApiError(
      data.message ?? 'Не удалось выполнить запрос',
      response.status,
      data.errors ?? {},
    )
  }

  return data as T
}

export function firstError(error: unknown): string {
  if (error instanceof ApiError) {
    const nested = Object.values(error.errors)[0]?.[0]
    return nested ?? error.message
  }
  return 'Что-то пошло не так'
}
