import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const Auth = () => {
  const [mode, setMode] = useState('login') // 'login' or 'register'
  const [form, setForm] = useState({ fullName: '', email: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      if (mode === 'login') {
        // TODO: Implement actual login
        alert('Login clicked')
        navigate('/app/home')
      } else {
        // TODO: Implement actual registration
        alert('Registration clicked')
        navigate('/app/home')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-md mx-auto w-full bg-elevated rounded-2xl border border-border p-8 shadow-lg">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-8">
          {mode === 'login' ? 'Welcome Back' : 'Join Us'}
        </h2>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-token-text-caption mb-2">
              {mode === 'login' ? 'Email' : 'Full Name'}
            </label>
            <input
              type={mode === 'register' ? 'text' : 'email'}
              name={mode === 'register' ? 'fullName' : 'email'}
              value={form[mode === 'register' ? 'fullName' : 'email']}
              onChange={handleChange}
              required
              className={`w-full rounded-lg border border-border px-4 py-3 text-token-text placeholder-token-muted focus:outline-none focus:border-accent transition-colors`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-token-text-caption mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className={`w-full rounded-lg border border-border px-4 py-3 text-token-text placeholder-token-muted focus:outline-none focus:border-accent transition-colors`}
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-token-text-caption mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword || ''}
                onChange={handleChange}
                required
                className={`w-full rounded-lg border border-border px-4 py-3 text-token-text placeholder-token-muted focus:outline-none focus:border-accent transition-colors`}
              />
            </div>
          )}

          <button type="submit" className="w-full btn-primary py-3 rounded-lg font-medium text-lg hover:opacity-90 transition-opacity">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-token-accent text-sm font-medium hover:underline"
          >
            {mode === 'login' ? 'Create an account' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  )
}