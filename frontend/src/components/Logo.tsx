import { Link } from 'react-router-dom'

export function Logo({ to = '/', className = 'h-11' }: { to?: string; className?: string }) {
  return (
    <Link to={to} className="inline-flex shrink-0 items-center">
      <img src="/logo.png" alt="SOMA" className={`${className} w-auto`} />
    </Link>
  )
}
