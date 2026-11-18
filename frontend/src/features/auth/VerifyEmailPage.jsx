import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams, useLocation } from 'react-router-dom'
import { authService } from '../../services/auth/authService'
import { errorMessage } from '../../services/api/apiClient'
import { AuthCard, FormError, FormSuccess } from './AuthCard'

export const VerifyEmailPage = () => {
  const [params] = useSearchParams()
  const location = useLocation()
  const justRegistered = Boolean(location.state?.justRegistered)
  const token = params.get('token')
  const [status, setStatus] = useState(token ? 'idle' : 'missing')
  const [message, setMessage] = useState('')
  const autoRan = useRef(false)

  const verify = async () => {
    setStatus('loading')
    setMessage('')
    try {
      await authService.verifyEmail(token)
      setStatus('success')
      setMessage('Your email has been verified. You can now sign in.')
    } catch (err) {
      setStatus('error')
      setMessage(errorMessage(err, 'Verification link is invalid or has expired.'))
    }
  }

  // Auto-verify once when a token is present; the button remains as a manual retry.
  useEffect(() => {
    if (token && !autoRan.current) {
      autoRan.current = true
      verify()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  return (
    <AuthCard title="Verify your email" subtitle="Confirm your email address to activate your account.">
      {justRegistered && (
        <FormSuccess message="Account created! We've sent a verification link to your email — verify it, then sign in." />
      )}
      {!token ? (
        <FormError message="No verification token was provided. Check the link in your email." />
      ) : status === 'success' ? (
        <FormSuccess message={message} />
      ) : status === 'error' ? (
        <FormError message={message} />
      ) : null}

      {token && status !== 'success' && (
        <button type="button" onClick={verify} disabled={status === 'loading'} className="btn-primary w-full">
          {status === 'loading' ? 'Verifying…' : 'Verify email'}
        </button>
      )}

      <div className="mt-6 text-center">
        <ResendVerification initialEmail={location.state?.email || ''} />
      </div>

      <p className="mt-4 text-center text-sm text-ink-2">
        <Link to="/login" className="link">Back to sign in</Link>
      </p>
    </AuthCard>
  )
}

const ResendVerification = ({ initialEmail = '' }) => {
  const [email, setEmail] = useState(initialEmail)
  const [state, setState] = useState({ loading: false, done: false, error: '' })

  const resend = async (e) => {
    e.preventDefault()
    if (!email) return
    setState({ loading: true, done: false, error: '' })
    try {
      await authService.resendVerification(email)
      setState({ loading: false, done: true, error: '' })
    } catch (err) {
      setState({ loading: false, done: false, error: errorMessage(err) })
    }
  }

  if (state.done) {
    return <p className="text-sm text-success">If the account exists, a new verification email was sent.</p>
  }

  return (
    <form onSubmit={resend} className="flex flex-col gap-2">
      <p className="text-sm text-ink-2">Didn't get the email?</p>
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          className="input"
          aria-label="Email address"
        />
        <button type="submit" className="btn-outline whitespace-nowrap" disabled={state.loading}>
          {state.loading ? 'Sending…' : 'Resend'}
        </button>
      </div>
      {state.error && <p className="text-xs text-danger" role="alert">{state.error}</p>}
    </form>
  )
}
