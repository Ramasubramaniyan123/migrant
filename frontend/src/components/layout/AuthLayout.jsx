import { Outlet } from 'react-router-dom';
import { APP_NAME } from '@/utils/constants';
const BENEFITS = ['Find people from your hometown, wherever you are', 'Discover neighbours who speak your language', 'Join communities and settle in faster'];

/** Split layout for auth screens: marketing panel on the left, form card on the right. */
export default function AuthLayout() {
  return <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="hidden flex-col justify-between bg-gradient-to-br from-brand-600 to-brand-800 p-10 text-white lg:flex">
        <p className="text-lg font-semibold tracking-tight">{APP_NAME}</p>
        <div>
          <h1 className="text-3xl font-semibold leading-tight">
            Your community, closer than you think.
          </h1>
          <p className="mt-3 max-w-md text-brand-100">
            Connect with migrants who share your roots, your language and your neighbourhood.
          </p>
          <ul className="mt-8 space-y-3">
            {BENEFITS.map(benefit => <li key={benefit} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3" aria-hidden="true">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-sm text-brand-50">{benefit}</span>
              </li>)}
          </ul>
        </div>
        <p className="text-xs text-brand-200">A prototype experience — no real accounts required.</p>
      </aside>

      <main className="flex items-center justify-center bg-slate-50 p-6">
        <div className="card w-full max-w-md">
          <Outlet />
        </div>
      </main>
    </div>;
}
