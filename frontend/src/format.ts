export function embedUrl(url: string | null | undefined): string | null {
  if (!url) return null

  const youtube = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]+)/)
  if (youtube) return `https://www.youtube.com/embed/${youtube[1]}`

  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`

  const kinescope = url.match(/kinescope\.io\/(?:embed\/)?([\w-]+)/)
  if (kinescope) return `https://kinescope.io/embed/${kinescope[1]}`

  return url
}

export function formatDate(value: string): string {
  return new Date(value).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatSlot(value: string): { date: string; time: string } {
  const date = new Date(value)
  return {
    date: date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
    time: date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
  }
}

export function spotsLabel(count: number): string {
  const mod10 = count % 10
  const mod100 = count % 100
  const word = mod10 === 1 && mod100 !== 11 ? 'место' : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14) ? 'места' : 'мест'
  return `${count} ${word}`
}

export function formatPrice(value: number | null): string {
  if (value == null) return 'По запросу'
  return `${value.toLocaleString('ru-RU')} BYN`
}
