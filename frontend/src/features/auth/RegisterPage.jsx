import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../../contexts'
import { errorMessage } from '../../services/api/apiClient'
import { AuthCard, FieldError, FormError } from './AuthCard'
import { GoogleSignIn } from './GoogleSignIn'

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Include a lowercase letter')
    .regex(/[A-Z]/, 'Include an uppercase letter')
    .regex(/[0-9]/, 'Include a number')
    .regex(/[@#$%^&+=!]/, 'Include a special character (@#$%^&+=!)'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const RegisterPage = () => {
  const { register: registerUser, googleLogin } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')
  const [googleError, setGoogleError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (values) => {
    setServerError('')
    try {
      const res = await registerUser(values)
      if (res?.accessToken) {
        navigate('/app/onboarding', { replace: true })
      } else {
        // Backend issues tokens only after email verification.
        navigate('/verify-email', { replace: true, state: { justRegistered: true, email: values.email } })
      }
    } catch (err) {
      setServerError(errorMessage(err))
    }
  }

  const onGoogle = useCallback(async (credential) => {
    setGoogleError('')
    try {
      await googleLogin(credential)
      navigate('/app/onboarding', { replace: true })
    } catch (err) {
      setGoogleError(errorMessage(err, 'Google sign-in failed. Please try again.'))
    }
  }, [googleLogin, navigate])

  return (
    <AuthCard
      title="Create your account"
      subtitle="Join the migrant community platform."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="link">Sign in</Link>
        </>
      }
    >
      <FormError message={serverError || googleError} />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label htmlFor="reg-email" className="label">Email</label>
          <input id="reg-email" type="email" autoComplete="email" className="input" {...register('email')} />
          <FieldError message={errors.email?.message} />
        </div>
        <div>
          <label htmlFor="reg-password" className="label">Password</label>
          <input id="reg-password" type="password" autoComplete="new-password" className="input" {...register('password')} />
          <FieldError message={errors.password?.message} />
          <p className="mt-1 text-xs text-ink-3">8+ characters with upper, lower, number and special character.</p>
        </div>
        <div>
          <label htmlFor="reg-confirm" className="label">Confirm password</label>
          <input id="reg-confirm" type="password" autoComplete="new-password" className="input" {...register('confirmPassword')} />
          <FieldError message={errors.confirmPassword?.message} />
        </div>
        <button type="submit" className="btn-accent w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-ink-3">
        <span className="h-px flex-1 bg-line" /> or <span className="h-px flex-1 bg-line" />
      </div>
      <GoogleSignIn onCredential={onGoogle} disabled={isSubmitting} />
    </AuthCard>
  )
}
