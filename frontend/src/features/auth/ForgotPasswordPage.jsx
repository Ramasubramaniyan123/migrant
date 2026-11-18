import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { authService } from '../../services/auth/authService'
import { errorMessage } from '../../services/api/apiClient'
import { AuthCard, FieldError, FormError, FormSuccess } from './AuthCard'

const schema = z.object({ email: z.string().email('Enter a valid email address') })

export const ForgotPasswordPage = () => {
  const [sent, setSent] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async ({ email }) => {
    setServerError('')
    try {
      await authService.forgotPassword(email)
      setSent(true)
    } catch (err) {
      setServerError(errorMessage(err))
    }
  }

  return (
    <AuthCard
      title="Reset your password"
      subtitle="Enter your email and we'll send you a reset link."
      footer={<Link to="/login" className="link">Back to sign in</Link>}
    >
      {sent ? (
        <FormSuccess message="If an account exists for that email, a password reset link has been sent." />
      ) : (
        <>
          <FormError message={serverError} />
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label htmlFor="fp-email" className="label">Email</label>
              <input id="fp-email" type="email" autoComplete="email" className="input" {...register('email')} />
              <FieldError message={errors.email?.message} />
            </div>
            <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        </>
      )}
    </AuthCard>
  )
}
