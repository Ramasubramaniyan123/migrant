import { Link } from 'react-router-dom'
import { Compass, Users, Languages, CalendarDays, MessageSquare, ShieldCheck } from 'lucide-react'

const FEATURES = [
  {
    icon: Compass,
    title: 'People discovery',
    text: 'Find members near you, from your hometown, or who speak your language.',
  },
  {
    icon: Users,
    title: 'Communities',
    text: 'Join language, hometown, interest and workplace communities.',
  },
  {
    icon: Languages,
    title: 'Language bridge',
    text: 'Connect across languages with shared native tongues and interests.',
  },
  {
    icon: CalendarDays,
    title: 'Events',
    text: 'Discover and register for community gatherings in your city.',
  },
  {
    icon: MessageSquare,
    title: 'Messaging',
    text: 'Private conversations with the people you connect with.',
  },
  {
    icon: ShieldCheck,
    title: 'Privacy first',
    text: 'Control what you share. Location is always approximate.',
  },
]

export const FeaturesPage = () => (
  <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
    <div className="mx-auto max-w-2xl text-center">
      <h1 className="font-display text-4xl font-bold">Everything you need to belong</h1>
      <p className="mt-4 text-ink-2">
        A complete toolkit for building your community in a new city.
      </p>
    </div>
    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {FEATURES.map(({ icon: Icon, title, text }) => (
        <div key={title} className="card p-6">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-accent-soft text-accent">
            <Icon className="h-5 w-5" />
          </div>
          <h2 className="font-display text-lg font-semibold">{title}</h2>
          <p className="mt-1 text-sm text-ink-2">{text}</p>
        </div>
      ))}
    </div>
    <div className="mt-12 text-center">
      <Link to="/register" className="btn-accent">Create your free account</Link>
    </div>
  </div>
)
