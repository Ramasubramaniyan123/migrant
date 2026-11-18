import { Compass, Users, Languages, CalendarDays, MessageSquare, ShieldCheck } from 'lucide-react'

const ITEMS = [
  {
    icon: Compass,
    title: 'Discover people',
    text: 'Find members near you, from your hometown, or who share your interests.',
  },
  {
    icon: Users,
    title: 'Join communities',
    text: 'Language, hometown, interest and workplace communities for every background.',
  },
  {
    icon: Languages,
    title: 'Language bridge',
    text: 'Connect through shared native languages and cultural affinity.',
  },
  {
    icon: CalendarDays,
    title: 'Community events',
    text: 'Discover gatherings, workshops and celebrations happening near you.',
  },
  {
    icon: MessageSquare,
    title: 'Private messaging',
    text: 'Start real conversations with the people you connect with.',
  },
  {
    icon: ShieldCheck,
    title: 'Privacy first',
    text: 'You control what you share. Location is always approximate.',
  },
]

export const FeaturesSection = () => (
  <section className="py-20 md:py-28">
    <div className="mx-auto max-w-7xl px-4 md:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-4xl font-bold">A shared space to belong</h2>
        <p className="mt-4 text-ink-2">
          Everything you need to feel at home in a new city — people, communities and events.
        </p>
      </div>
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map(({ icon: Icon, title, text }) => (
          <div key={title} className="card p-6 transition-shadow hover:shadow-lift">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-accent-soft text-accent">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-semibold">{title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-ink-2">{text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)
