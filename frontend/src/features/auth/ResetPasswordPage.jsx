import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { authService } from '../../services/auth/authService'
import { errorMessage } from '../../services/api/apiClient'
import { AuthCard, FieldError, FormError, FormSuccess } from './AuthCard'

const schema = z.object({
  token: z.string().regex(/^\d{6}$/, 'Enter the 6-digit code from your email'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Include a lowercase letter')
    .regex(/[A-Z]/, 'Include an uppercase letter')
    .regex(/[0-9]/, 'Include a number')
    .regex(/[@#$%^&+=!]/, 'Include a special character (@#$%^&+=!)'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const ResetPasswordPage = () => {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [done, setDone] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { token: params.get('token') || '' },
  })

  const onSubmit = async ({ token, newPassword }) => {
    setServerError('')
    try {
      await authService.resetPassword({ token, newPassword })
      setDone(true)
      setTimeout(() => navigate('/login', { replace: true }), 2000)
    } catch (err) {
      setServerError(errorMessage(err))
    }
  }

  return (
    <AuthCard
      title="Choose a new password"
      subtitle="Enter the reset code from your email and your new password."
      footer={<Link to="/login" className="link">Back to sign in</Link>}
    >
      {done ? (
        <FormSuccess message="Your password has been reset. Redirecting you to sign in…" />
      ) : (
        <>
          <FormError message={serverError} />
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label htmlFor="rp-token" className="label">Reset code</label>
              <input
                id="rp-token"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                className="input tracking-[0.5em]"
                {...register('token')}
              />
              <FieldError message={errors.token?.message} />
            </div>
            <div>
              <label htmlFor="rp-password" className="label">New password</label>
              <input id="rp-password" type="password" autoComplete="new-password" className="input" {...register('newPassword')} />
              <FieldError message={errors.newPassword?.message} />
            </div>
            <div>
              <label htmlFor="rp-confirm" className="label">Confirm new password</label>
              <input id="rp-confirm" type="password" autoComplete="new-password" className="input" {...register('confirmPassword')} />
              <FieldError message={errors.confirmPassword?.message} />
            </div>
            <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Resetting…' : 'Reset password'}
            </button>
          </form>
        </>
      )}
    </AuthCard>
  )
}
