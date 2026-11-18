import { ShieldCheck, BadgeCheck, HeartHandshake } from 'lucide-react'

const ITEMS = [
  {
    icon: ShieldCheck,
    title: 'Safe & private',
    text: 'Your privacy is protected. Location sharing is always approximate and under your control.',
  },
  {
    icon: BadgeCheck,
    title: 'Authentic community',
    text: 'Real people, real connections — built for migrants supporting migrants.',
  },
  {
    icon: HeartHandshake,
    title: 'Community first',
    text: "We're here to help you connect, belong and thrive in your new home.",
  },
]

export const TrustSection = () => (
  <section className="border-y border-line bg-surface-alt/50 py-20 md:py-24">
    <div className="mx-auto max-w-7xl px-4 md:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-bold md:text-4xl">A space you can trust</h2>
        <p className="mt-4 text-ink-2">
          Designed to be safe, inclusive and genuinely useful for people on the move.
        </p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {ITEMS.map(({ icon: Icon, title, text }) => (
          <div key={title} className="card p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="font-medium">{title}</h3>
            <p className="mt-2 text-sm text-ink-2">{text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)
