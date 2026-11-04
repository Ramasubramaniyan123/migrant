import { Link } from 'react-router-dom'
import { ArrowRight, HeartHandshake, Home, Languages, Users } from 'lucide-react'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { PublicFooter } from '@/components/layout/PublicFooter'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { LANGUAGES } from '@/data/constants'
import { avatarDataUri } from '@/lib/avatar'

const faces = ['Arun Selvam', 'Priya Karthik', 'Sneha Reddy', 'Rohan Menon', 'Riya Banerjee', 'Pooja Hegde']

export function LandingPage() {
  return (
    <div className="min-h-screen bg-canvas">
      <PublicHeader />
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
        <div>
          <p className="mb-3 text-sm font-semibold text-brand">Project Connect · Gurugram</p>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-ink md:text-5xl">
            Your City Is New. Your People Don't Have To Be.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted">
            Discover people around you who speak your language, share your hometown and make your new city feel like home.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register">
              <Button size="lg">
                Find Your People <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#communities">
              <Button size="lg" variant="outline">
                Explore Communities
              </Button>
            </a>
          </div>
        </div>
        <Card className="relative overflow-hidden p-8">
          <p className="mb-6 text-sm font-medium text-muted">People already finding each other in Gurugram</p>
          <div className="flex flex-wrap justify-center gap-4">
            {faces.map((name, index) => (
              <div key={name} className="flex w-24 flex-col items-center gap-2" style={{ transform: `translateY(${index % 2 === 0 ? 0 : 12}px)` }}>
                <img src={avatarDataUri(name)} alt={name} className="h-16 w-16 rounded-full ring-4 ring-brand-soft" />
                <span className="text-center text-xs text-muted">{name.split(' ')[0]}</span>
              </div>
            ))}
          </div>
          <div className="mt-10 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-canvas p-3">
              <p className="text-lg font-bold">32</p>
              <p className="text-xs text-muted">Demo neighbours</p>
            </div>
            <div className="rounded-xl bg-canvas p-3">
              <p className="text-lg font-bold">10</p>
              <p className="text-xs text-muted">Languages</p>
            </div>
            <div className="rounded-xl bg-canvas p-3">
              <p className="text-lg font-bold">8+</p>
              <p className="text-xs text-muted">Communities</p>
            </div>
          </div>
        </Card>
      </section>

      <section id="how-it-works" className="bg-card py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold">How it works</h2>
          <p className="mt-2 text-muted">Three quiet steps. No dating prompts. No public addresses.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { title: 'Tell us about yourself', body: 'Share your language, hometown and the part of Gurugram you are settling into.' },
              { title: 'Discover people nearby', body: 'See approximate distances, shared interests and familiar hometowns — never exact locations.' },
              { title: 'Connect and build friendships', body: 'Send a request, talk after both of you accept, and join local language communities.' },
            ].map((step, index) => (
              <Card key={step.title} className="p-6">
                <span className="text-sm font-semibold text-brand">0{index + 1}</span>
                <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{step.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="communities" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-bold">Language communities</h2>
        <p className="mt-2 text-muted">Start with the language that makes you feel at home.</p>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {LANGUAGES.map((language) => (
            <Card key={language} className="p-4 text-center">
              <Languages className="mx-auto mb-2 h-5 w-5 text-brand" />
              <p className="font-medium">{language}</p>
              <p className="text-xs text-muted">Gurugram circle</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-brand-soft py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold">Why join?</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Home, title: 'Find people from your hometown', body: 'Meet someone from Tenkasi, Kochi, Kolkata or Pune who now lives a few kilometres away.' },
              { icon: Languages, title: 'Speak your language', body: 'Filter by mother tongue and join local language communities.' },
              { icon: HeartHandshake, title: 'Build friendships', body: 'Mutual acceptance before private messages. This is a community product, not a dating app.' },
              { icon: Users, title: 'Discover local communities', body: 'Film nights, cricket, brunch circles and festival planning — all neighbourhood-first.' },
            ].map((item) => (
              <Card key={item.title} className="p-5">
                <item.icon className="h-5 w-5 text-brand" />
                <h3 className="mt-3 font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted">{item.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <PublicFooter />
    </div>
  )
}
