import type { ReactNode } from 'react'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { PublicFooter } from '@/components/layout/PublicFooter'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Textarea, Field } from '@/components/ui/Input'
import { useState } from 'react'
import { useToast } from '@/components/ui/Toast'

function Shell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas">
      <PublicHeader />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold">{title}</h1>
        <Card className="mt-6 p-6 text-sm leading-7 text-muted">{children}</Card>
      </div>
      <PublicFooter />
    </div>
  )
}

export function AboutPage() {
  return (
    <Shell title="About Connect">
      <p>
        Connect is a hyperlocal community platform for people who have moved to a new city. The first launch city is Gurugram.
        We help working professionals, students and PG residents find people who share a language, hometown or cultural rhythm.
      </p>
      <p className="mt-4">
        This is not a dating, matrimonial, jobs or language-learning product. The experience is built around discovery, mutual
        connection, conversation and local community.
      </p>
    </Shell>
  )
}

export function PrivacyPage() {
  return (
    <Shell title="Privacy Policy">
      <p>We never show exact residential addresses, PG names or live coordinates. Distances are approximate.</p>
      <p className="mt-4">Phone numbers are not public. Private messaging requires mutual acceptance. You can pause discovery, hide location, block or report anyone, and delete your demo account.</p>
    </Shell>
  )
}

export function TermsPage() {
  return (
    <Shell title="Terms">
      <p>This prototype is a demonstration. Treat other members with respect, do not request private addresses, and do not use the product for dating or harassment. Accounts that break these rules can be suspended from the admin console.</p>
    </Shell>
  )
}

export function ContactPage() {
  const toast = useToast()
  const [sent, setSent] = useState(false)
  return (
    <Shell title="Contact">
      {sent ? (
        <p>Thanks. This demo stores nothing on a server — your note was recorded locally as sent.</p>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            setSent(true)
            toast('Message sent')
          }}
        >
          <Field label="Email">
            <Input type="email" required placeholder="you@email.com" />
          </Field>
          <Field label="Message">
            <Textarea required placeholder="How can we help?" />
          </Field>
          <Button type="submit">Send</Button>
        </form>
      )}
    </Shell>
  )
}
