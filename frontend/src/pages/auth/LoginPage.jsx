import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { useAuth } from '@/hooks/useAuth';
import { DEMO_PASSWORD } from '@/services/authService';
import { ROUTES } from '@/utils/constants';
import { hasErrors, validateLogin } from '@/utils/validators';

/** Email + password sign-in screen. */
export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    login,
    error,
    clearError,
    isLoading
  } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const from = location.state?.from ?? ROUTES.dashboard;
  function clearFieldError(field) {
    setErrors(prev => {
      if (!prev[field]) return prev;
      const next = {
        ...prev
      };
      delete next[field];
      return next;
    });
  }
  async function handleSubmit(event) {
    event.preventDefault();
    clearError();
    const nextErrors = validateLogin(email, password);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;
    try {
      await login({
        email: email.trim(),
        password
      });
      navigate(from, {
        replace: true
      });
    } catch {
      // The failure message is surfaced through the auth context `error`.
    }
  }
  function useDemoCredentials() {
    setEmail('aarav.sharma@example.com');
    setPassword(DEMO_PASSWORD);
    setErrors({});
    clearError();
  }
  return <div className="space-y-6">
      <div>
        <h1 className="page-title">Welcome back</h1>
        <p className="muted mt-1">Sign in to reconnect with your community.</p>
      </div>

      {error && <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>}

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <Input label="Email" type="email" autoComplete="email" placeholder="you@example.com" value={email} error={errors.email} onChange={event => {
        setEmail(event.target.value);
        clearFieldError('email');
      }} />
        <Input label="Password" type="password" autoComplete="current-password" placeholder="••••••••" value={password} error={errors.password} onChange={event => {
        setPassword(event.target.value);
        clearFieldError('password');
      }} />

        <div className="flex justify-end">
          <Link to={ROUTES.forgotPassword} className="text-sm font-medium text-brand-700 hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth isLoading={isLoading}>
          Sign in
        </Button>
      </form>

      <div className="rounded-lg border border-brand-100 bg-brand-50 p-4 text-sm">
        <p className="font-medium text-brand-800">Try the demo account</p>
        <dl className="mt-2 space-y-1 text-slate-600">
          <div className="flex items-center gap-2">
            <dt className="w-20 shrink-0 text-slate-500">Email</dt>
            <dd className="font-mono text-slate-800">aarav.sharma@example.com</dd>
          </div>
          <div className="flex items-center gap-2">
            <dt className="w-20 shrink-0 text-slate-500">Password</dt>
            <dd className="font-mono text-slate-800">{DEMO_PASSWORD}</dd>
          </div>
        </dl>
        <Button type="button" variant="ghost" size="sm" className="mt-2" onClick={useDemoCredentials}>
          Use demo credentials
        </Button>
      </div>

      <p className="text-center text-sm text-slate-600">
        New here?{' '}
        <Link to={ROUTES.register} className="font-medium text-brand-700 hover:underline">
          Create an account
        </Link>
      </p>
    </div>;
}
