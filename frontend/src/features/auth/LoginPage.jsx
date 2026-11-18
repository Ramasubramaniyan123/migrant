import { useState, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../../contexts'
import { errorMessage } from '../../services/api/apiClient'
import { AuthCard, FieldError, FormError } from './AuthCard'
import { GoogleSignIn } from './GoogleSignIn'

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const LoginPage = () => {
  const { login, googleLogin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [serverError, setServerError] = useState('')
  const [googleError, setGoogleError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) })

  const from = location.state?.from || '/app/home'

  const onSubmit = async (values) => {
    setServerError('')
    try {
      const result = await login(values)
      if (result.isAdmin) {
        navigate('/admin/dashboard', { replace: true })
      } else {
        navigate(from, { replace: true })
      }
    } catch (err) {
      setServerError(errorMessage(err, 'Invalid email or password.'))
    }
  }

  const onGoogle = useCallback(async (credential) => {
    setGoogleError('')
    try {
      await googleLogin(credential)
      navigate(from, { replace: true })
    } catch (err) {
      setGoogleError(errorMessage(err, 'Google sign-in failed. Please try again.'))
    }
  }, [googleLogin, navigate, from])

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to your migrant community account."
      footer={
        <>
          New here?{' '}
          <Link to="/register" className="link">Create an account</Link>
        </>
      }
    >
      <FormError message={serverError || googleError} />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label htmlFor="login-email" className="label">Email</label>
          <input id="login-email" type="email" autoComplete="email" className="input" {...register('email')} />
          <FieldError message={errors.email?.message} />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="login-password" className="label">Password</label>
            <Link to="/forgot-password" className="text-xs text-accent hover:underline">Forgot password?</Link>
          </div>
          <input id="login-password" type="password" autoComplete="current-password" className="input" {...register('password')} />
          <FieldError message={errors.password?.message} />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-ink-3">
        <span className="h-px flex-1 bg-line" /> or <span className="h-px flex-1 bg-line" />
      </div>
      <GoogleSignIn onCredential={onGoogle} disabled={isSubmitting} />
    </AuthCard>
  )
}
