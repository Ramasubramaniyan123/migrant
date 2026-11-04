import { Link } from 'react-router-dom'
import { Globe } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'

export function PublicFooter() {
  return (
    <footer className="border-t border-line bg-card">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-3 text-sm text-muted">A community platform for people who have moved to a new city and want it to feel familiar.</p>
        </div>
        <div>
          <p className="font-semibold">Product</p>
          <div className="mt-3 space-y-2 text-sm text-muted">
            <Link className="block hover:text-ink" to="/about">About</Link>
            <Link className="block hover:text-ink" to="/#how-it-works">How it works</Link>
            <Link className="block hover:text-ink" to="/#communities">Communities</Link>
          </div>
        </div>
        <div>
          <p className="font-semibold">Legal</p>
          <div className="mt-3 space-y-2 text-sm text-muted">
            <Link className="block hover:text-ink" to="/privacy">Privacy Policy</Link>
            <Link className="block hover:text-ink" to="/terms">Terms</Link>
            <Link className="block hover:text-ink" to="/contact">Contact</Link>
          </div>
        </div>
        <div>
          <p className="font-semibold">Social</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-muted">
            <a href="https://instagram.com" className="inline-flex items-center gap-2 hover:text-brand"><Globe className="h-4 w-4" /> Instagram</a>
            <a href="https://x.com" className="inline-flex items-center gap-2 hover:text-brand"><Globe className="h-4 w-4" /> X / Twitter</a>
            <a href="https://linkedin.com" className="inline-flex items-center gap-2 hover:text-brand"><Globe className="h-4 w-4" /> LinkedIn</a>
          </div>
        </div>
      </div>
      <p className="border-t border-line py-4 text-center text-xs text-muted">© 2026 Project Connect. Prototype for demonstration.</p>
    </footer>
  )
}
