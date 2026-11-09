import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { authService } from '@/services/authService';
import { ROUTES } from '@/utils/constants';

/** Public page for the password-reset link (`/reset-password?token=…`). */
export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleSubmit = async event => {
    event.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!token) {
      setError('This reset link is missing its token. Request a new one.');
      return;
    }
    setIsPending(true);
    try {
      await authService.resetPassword(token, password);
      setIsDone(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to reset password');
    } finally {
      setIsPending(false);
    }
  };

  if (isDone) {
    return <div className="space-y-6">
        <div>
          <h1 className="page-title">Password updated</h1>
          <p className="muted mt-1">Your password has been reset. Sign in with your new password.</p>
        </div>
        <Link to={ROUTES.login}>
          <Button fullWidth>Continue to sign in</Button>
        </Link>
      </div>;
  }

  return <div className="space-y-6">
      <div>
        <h1 className="page-title">Choose a new password</h1>
        <p className="muted mt-1">Enter a new password for your account.</p>
      </div>

      {error ? <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div> : null}

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <Input label="New password" type="password" autoComplete="new-password" placeholder="••••••••" value={password} onChange={event => setPassword(event.target.value)} />
        <Input label="Confirm password" type="password" autoComplete="new-password" placeholder="••••••••" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} />
        <Button type="submit" fullWidth isLoading={isPending}>
          Reset password
        </Button>
      </form>

      <p className="text-center text-sm text-slate-600">
        <Link to={ROUTES.forgotPassword} className="font-medium text-brand-700 hover:underline">
          Request a new reset link
        </Link>
      </p>
    </div>;
}
