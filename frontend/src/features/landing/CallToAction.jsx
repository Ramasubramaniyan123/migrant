import { Link } from 'react-router-dom'

export const CallToAction = () => (
  <section className="py-20 md:py-28">
    <div className="mx-auto max-w-7xl px-4 md:px-8">
      <div className="card relative overflow-hidden px-6 py-16 text-center md:px-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(40rem 20rem at 50% -20%, var(--color-accent-soft), transparent 65%)',
          }}
        />
        <div className="relative">
          <h2 className="font-display text-4xl font-bold md:text-5xl">Ready to find your people?</h2>
          <p className="mx-auto mt-4 max-w-xl text-ink-2">
            Create a free account and start connecting with your community today.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link to="/register" className="btn-accent px-8 py-3.5 text-base">Create free account</Link>
            <Link to="/about" className="btn-outline px-8 py-3.5 text-base">Learn more</Link>
          </div>
        </div>
      </div>
    </div>
  </section>
)
