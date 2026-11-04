import { Link, NavLink } from 'react-router-dom'
import { Logo } from '@/components/brand/Logo'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const links = [
  { to: '/', label: 'Home' },
  { to: '/#how-it-works', label: 'How It Works' },
  { to: '/#communities', label: 'Communities' },
  { to: '/about', label: 'About' },
]

export function PublicHeader() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-card/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <NavLink key={link.label} to={link.to} className="text-sm text-muted hover:text-ink">
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Link to="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link to="/register">
            <Button>Join Now</Button>
          </Link>
        </div>
        <button className="md:hidden" onClick={() => setOpen((value) => !value)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open ? (
        <div className="space-y-2 border-t border-line px-4 py-3 md:hidden">
          {links.map((link) => (
            <Link key={link.label} to={link.to} className="block py-1 text-sm" onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-2">
            <Link to="/login" className="flex-1">
              <Button variant="outline" className="w-full">
                Login
              </Button>
            </Link>
            <Link to="/register" className="flex-1">
              <Button className="w-full">Join Now</Button>
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  )
}
