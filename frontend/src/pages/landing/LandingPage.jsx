import { Link, Navigate, useNavigate } from 'react-router-dom';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Footer from '@/components/layout/Footer';
import communitiesSeed from '@/data/communities.json';
import { useAuth } from '@/hooks/useAuth';
import { languages } from '@/services/userService';
import { APP_NAME, ROUTES } from '@/utils/constants';
/** Demo coordinate legend used purely for decoration, never presented as real chart data. */
const DISCOVERY_RADIUS_KM = 25;
function HomeIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
      <path d="M3 10.5 12 3l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 9.8V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>;
}
function GlobeIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" strokeLinecap="round" />
    </svg>;
}
function PinIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
      <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>;
}
function ShieldIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
      <path d="M12 3 5 6v6c0 4.4 3 7.9 7 9 4-1.1 7-4.6 7-9V6l-7-3Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>;
}
const FEATURES = [{
  title: 'Hometown match',
  description: 'See who grew up in your city and instantly have something to talk about.',
  icon: <HomeIcon />,
  tone: 'bg-brand-50 text-brand-700'
}, {
  title: 'Language communities',
  description: 'Join spaces for the languages you speak and never feel lost in translation.',
  icon: <GlobeIcon />,
  tone: 'bg-emerald-50 text-emerald-700'
}, {
  title: 'Nearby people',
  description: 'Discover migrants living close by so a friendly face is never far away.',
  icon: <PinIcon />,
  tone: 'bg-amber-50 text-amber-700'
}, {
  title: 'Privacy first',
  description: 'Share only your city, never your address — you stay in control at all times.',
  icon: <ShieldIcon />,
  tone: 'bg-rose-50 text-rose-700'
}];
const STEPS = [{
  title: 'Create your profile',
  description: 'Tell us your hometown, languages and interests in a two-minute setup.'
}, {
  title: 'Get matched',
  description: 'We highlight people who share your hometown, language and neighbourhood.'
}, {
  title: 'Connect and settle in',
  description: 'Send a request, join a community and start feeling at home again.'
}];

/** Marketing landing page: converts visitors into new members. */
export default function LandingPage() {
  const {
    isAuthenticated
  } = useAuth();
  const navigate = useNavigate();
  if (isAuthenticated) {
    return <Navigate to={ROUTES.dashboard} replace />;
  }
  const stats = [{
    value: String(languages.length),
    label: 'languages supported'
  }, {
    value: String(communitiesSeed.length),
    label: 'active communities'
  }, {
    value: `${DISCOVERY_RADIUS_KM} km`,
    label: 'discovery radius'
  }];
  return <div className="min-h-full bg-white">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to={ROUTES.landing} className="flex items-center gap-2 text-sm font-semibold text-slate-900 sm:text-base">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
              M
            </span>
            <span className="truncate">{APP_NAME}</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link to={ROUTES.login} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
              Sign in
            </Link>
            <Link to={ROUTES.register} className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700">
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/60 to-white">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
            <div>
              <Badge variant="brand">Built for newcomers</Badge>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                Find your people in a new city
              </h1>
              <p className="mt-5 max-w-xl text-lg text-slate-600">
                Reconnect with people from your hometown, share the languages you love and meet
                migrants living nearby — with privacy you stay in control of.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" onClick={() => navigate(ROUTES.register)}>
                  Get started free
                </Button>
                <Button size="lg" variant="secondary" onClick={() => navigate(ROUTES.login)}>
                  Sign in
                </Button>
              </div>
              <p className="mt-4 text-sm text-slate-500">
                No credit card required · Demo account ready in seconds
              </p>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-brand-100/50 blur-2xl" aria-hidden="true" />
              <div className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700">
                    AS
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">Aarav Sharma</p>
                    <p className="text-sm text-slate-500">Jaipur → Dubai</p>
                  </div>
                  <span className="ml-auto rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    92% match
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="success">Same hometown</Badge>
                  <Badge variant="brand">Hindi</Badge>
                  <Badge variant="neutral">Nearby</Badge>
                </div>
                <p className="mt-4 text-sm text-slate-600">
                  &ldquo;It took me a week to feel at home here. Meeting people from Jaipur made all
                  the difference.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="page-title">Everything you need to settle in</h2>
            <p className="muted mt-2">
              Purpose-built tools that help migrants rebuild a circle of friends in a brand new city.
            </p>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(feature => <div key={feature.title} className="card">
                <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${feature.tone}`}>
                  {feature.icon}
                </span>
                <h3 className="mt-4 font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{feature.description}</p>
              </div>)}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-slate-50">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:grid-cols-3 sm:px-6">
            {stats.map(stat => <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-brand-700 sm:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm font-medium uppercase tracking-wide text-slate-500">
                  {stat.label}
                </p>
              </div>)}
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="page-title">How it works</h2>
            <p className="muted mt-2">Three simple steps from arriving to belonging.</p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {STEPS.map((step, index) => <div key={step.title} className="card relative">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-4 font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{step.description}</p>
              </div>)}
          </div>
        </section>

        <section className="bg-brand-700">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Your new city is full of people like you
            </h2>
            <p className="max-w-2xl text-brand-100">
              Join thousands of migrants rebuilding their community — one friendly hello at a time.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button size="lg" variant="secondary" onClick={() => navigate(ROUTES.register)}>
                Create your profile
              </Button>
              <Link to={ROUTES.login} className="inline-flex items-center rounded-lg border border-white/40 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10">
                I already have an account
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>;
}
