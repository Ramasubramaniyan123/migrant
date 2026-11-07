import { Link } from 'react-router-dom';
import { APP_NAME } from '@/utils/constants';

/** Simple site footer with branding and quick auth links. */
export default function Footer() {
  const year = new Date().getFullYear();
  return <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-slate-500 sm:flex-row lg:px-8">
        <p className="font-medium text-slate-700">{APP_NAME}</p>
        <p>© {year} {APP_NAME}</p>
        <nav aria-label="Footer navigation" className="flex items-center gap-4">
          <Link to="/" className="hover:text-brand-700">
            Home
          </Link>
          <Link to="/login" className="hover:text-brand-700">
            Log in
          </Link>
          <Link to="/register" className="hover:text-brand-700">
            Register
          </Link>
        </nav>
      </div>
    </footer>;
}
