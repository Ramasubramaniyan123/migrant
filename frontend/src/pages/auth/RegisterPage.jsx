import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/utils/constants';
import { hasErrors, validateRegister } from '@/utils/validators';

/** Account creation screen; new members continue into onboarding. */
export default function RegisterPage() {
  const navigate = useNavigate();
  const {
    register,
    error,
    clearError,
    isLoading
  } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
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
    const nextErrors = validateRegister(fullName, email, password, confirmPassword);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;
    try {
      await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password
      });
      navigate(ROUTES.onboarding, {
        replace: true
      });
    } catch {
      // The failure message is surfaced through the auth context `error`.
    }
  }
  return <div className="space-y-6">
      <div>
        <h1 className="page-title">Create your account</h1>
        <p className="muted mt-1">A few details and you are on your way to finding your people.</p>
      </div>

      {error && <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>}

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <Input label="Full name" autoComplete="name" placeholder="Aarav Sharma" value={fullName} error={errors.fullName} onChange={event => {
        setFullName(event.target.value);
        clearFieldError('fullName');
      }} />
        <Input label="Email" type="email" autoComplete="email" placeholder="you@example.com" value={email} error={errors.email} onChange={event => {
        setEmail(event.target.value);
        clearFieldError('email');
      }} />
        <Input label="Password" type="password" autoComplete="new-password" placeholder="••••••••" hint="At least 8 characters, including letters and numbers." value={password} error={errors.password} onChange={event => {
        setPassword(event.target.value);
        clearFieldError('password');
      }} />
        <Input label="Confirm password" type="password" autoComplete="new-password" placeholder="••••••••" value={confirmPassword} error={errors.confirmPassword} onChange={event => {
        setConfirmPassword(event.target.value);
        clearFieldError('confirmPassword');
      }} />

        <Button type="submit" fullWidth isLoading={isLoading}>
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link to={ROUTES.login} className="font-medium text-brand-700 hover:underline">
          Sign in
        </Link>
      </p>
    </div>;
}
