import { Link } from 'react-router-dom'

export const HeroSection = () => (
  <section className="relative overflow-hidden py-24 md:py-32">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          'radial-gradient(60rem 30rem at 85% -10%, var(--color-accent-soft), transparent 60%), radial-gradient(50rem 25rem at -10% 20%, var(--color-accent-soft), transparent 55%)',
      }}
    />
    <div className="relative mx-auto max-w-7xl px-4 md:px-8">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <span className="badge mb-6 bg-accent-soft text-accent">For migrants, by migrants</span>
        <h1 className="font-display text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
          Find your community, wherever you are
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-2">
          Connect with people from your hometown, speak your native language, and build
          meaningful relationships in your new city.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link to="/register" className="btn-accent px-8 py-3.5 text-base">
            Join the community
          </Link>
          <Link to="/features" className="btn-outline px-8 py-3.5 text-base">
            Explore features
          </Link>
        </div>
      </div>
    </div>
  </section>
)
