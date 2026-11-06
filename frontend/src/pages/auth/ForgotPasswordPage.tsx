import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import { authService } from '@/services/authService'
import { ROUTES } from '@/utils/constants'
import { isValidEmail } from '@/utils/validators'

/** Password reset request screen with a success confirmation panel. */
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [fieldError, setFieldError] = useState<string | undefined>(undefined)
  const [isPending, setIsPending] = useState(false)
  const [isSent, setIsSent] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!isValidEmail(email)) {
      setFieldError('Enter a valid email address')
      return
    }

    setFieldError(undefined)
    setIsPending(true)
    try {
      await authService.forgotPassword(email.trim())
      setIsSent(true)
    } finally {
      setIsPending(false)
    }
  }

  if (isSent) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="page-title">Check your inbox</h1>
          <p className="muted mt-1">
            If an account exists for <span className="font-medium text-slate-700">{email}</span>, we
            have sent a link to reset your password.
          </p>
        </div>

        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Reset instructions are on their way. The link expires in 30 minutes.
        </div>

        <Button type="button" variant="secondary" fullWidth onClick={() => setIsSent(false)}>
          Use a different email
        </Button>

        <p className="text-center text-sm text-slate-600">
          <Link to={ROUTES.login} className="font-medium text-brand-700 hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Reset your password</h1>
        <p className="muted mt-1">
          Enter the email you signed up with and we&apos;ll send you a reset link.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          error={fieldError}
          onChange={(event) => {
            setEmail(event.target.value)
            if (fieldError) setFieldError(undefined)
          }}
        />
        <Button type="submit" fullWidth isLoading={isPending}>
          Send reset link
        </Button>
      </form>

      <p className="text-center text-sm text-slate-600">
        Remembered it?{' '}
        <Link to={ROUTES.login} className="font-medium text-brand-700 hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  )
}
