import { useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { PublicFooter } from '@/components/layout/PublicFooter'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Field, Input } from '@/components/ui/Input'
import { ADMIN_EMAIL, ADMIN_PASSWORD, DEMO_EMAIL, DEMO_PASSWORD } from '@/data/constants'
import { useApp } from '@/store/AppProvider'
import { useToast } from '@/components/ui/Toast'

function AuthShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas">
      <PublicHeader />
      <div className="mx-auto flex max-w-md flex-col px-4 py-12">
        <h1 className="text-3xl font-bold">{title}</h1>
        <Card className="mt-6 p-6">{children}</Card>
      </div>
      <PublicFooter />
    </div>
  )
}

export function LoginPage() {
  const { login } = useApp()
  const navigate = useNavigate()
  const toast = useToast()
  const [email, setEmail] = useState(DEMO_EMAIL)
  const [password, setPassword] = useState(DEMO_PASSWORD)
  const [error, setError] = useState('')

  return (
    <AuthShell title="Welcome back">
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault()
          const result = login(email, password)
          if (result) setError(result)
          else {
            toast('Signed in')
            navigate('/app')
          }
        }}
      >
        <Field label="Email" error={error}>
          <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </Field>
        <Field label="Password">
          <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </Field>
        <Button type="submit" className="w-full">
          Login
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          onClick={() => {
            const result = login(DEMO_EMAIL, DEMO_PASSWORD)
            if (!result) navigate('/app')
          }}
        >
          Continue as demo member
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => {
            const result = login(ADMIN_EMAIL, ADMIN_PASSWORD)
            if (!result) navigate('/app/admin')
          }}
        >
          Continue as admin
        </Button>
        <div className="flex justify-between text-sm">
          <Link className="text-brand" to="/forgot-password">
            Forgot password
          </Link>
          <Link className="text-brand" to="/register">
            Create account
          </Link>
        </div>
      </form>
    </AuthShell>
  )
}

export function RegisterPage() {
  const { register } = useApp()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [ageOk, setAgeOk] = useState(false)
  const [error, setError] = useState('')

  return (
    <AuthShell title="Join Connect">
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault()
          if (name.trim().length < 2) return setError('Please enter your full name.')
          if (password.length < 6) return setError('Password must be at least 6 characters.')
          if (password !== confirm) return setError('Passwords do not match.')
          if (!ageOk) return setError('You must confirm you are 18 or older.')
          const result = register({ name, email, password })
          if (result) setError(result)
          else navigate('/onboarding')
        }}
      >
        <Field label="Full name" error={error}>
          <Input value={name} onChange={(event) => setName(event.target.value)} required />
        </Field>
        <Field label="Email">
          <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </Field>
        <Field label="Password">
          <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </Field>
        <Field label="Confirm password">
          <Input type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} required />
        </Field>
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" checked={ageOk} onChange={(event) => setAgeOk(event.target.checked)} className="mt-1" />
          I confirm I am 18 years or older. Connect is a friendship community, not a dating product.
        </label>
        <Button type="submit" className="w-full">
          Create account
        </Button>
        <p className="text-center text-sm text-muted">
          Already have an account?{' '}
          <Link className="text-brand" to="/login">
            Login
          </Link>
        </p>
      </form>
    </AuthShell>
  )
}

export function ForgotPasswordPage() {
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  return (
    <AuthShell title="Reset password">
      {sent ? (
        <p className="text-sm text-muted">If this were production, a reset link would be emailed to {email}. For this prototype, use demo@connect.in / demo123.</p>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            setSent(true)
            toast('Reset instructions sent')
          }}
        >
          <Field label="Email">
            <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </Field>
          <Button type="submit" className="w-full">
            Send reset link
          </Button>
        </form>
      )}
    </AuthShell>
  )
}
