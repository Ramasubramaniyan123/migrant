import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Loader from '@/components/common/Loader';
import { authService } from '@/services/authService';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/utils/constants';
import { isValidEmail } from '@/utils/validators';

/**
 * Public page reached from the verification email link (`?token=`) and from
 * the post-register redirect (no token → resend form).
 */
export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { user } = useAuth();
  const [status, setStatus] = useState(token ? 'verifying' : 'notice');
  const [error, setError] = useState('');
  const [email, setEmail] = useState(user?.email ?? '');
  const [isResending, setIsResending] = useState(false);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    authService.verifyEmail(token).then(() => {
      if (!cancelled) setStatus('success');
    }).catch(cause => {
      if (!cancelled) {
        setError(cause instanceof Error ? cause.message : 'Verification failed');
        setStatus('error');
      }
    });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleResend = async event => {
    event.preventDefault();
    if (!isValidEmail(email)) {
      setError('Enter a valid email address');
      return;
    }
    setError('');
    setIsResending(true);
    try {
      await authService.resendVerification(email.trim());
      setResent(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to resend the email');
    } finally {
      setIsResending(false);
    }
  };

  if (status === 'verifying') {
    return <Loader fullScreen label="Verifying your email…" />;
  }

  if (status === 'success') {
    return <div className="space-y-6">
        <div>
          <h1 className="page-title">Email verified</h1>
          <p className="muted mt-1">Your account is now active. You can sign in and start exploring.</p>
        </div>
        <Link to={ROUTES.login}>
          <Button fullWidth>Continue to sign in</Button>
        </Link>
      </div>;
  }

  if (status === 'error') {
    return <div className="space-y-6">
        <div>
          <h1 className="page-title">Verification failed</h1>
          <p className="muted mt-1">{error || 'The verification link is invalid or has expired.'}</p>
        </div>
        <Link to={ROUTES.login}>
          <Button variant="secondary" fullWidth>Back to sign in</Button>
        </Link>
      </div>;
  }

  return <div className="space-y-6">
      <div>
        <h1 className="page-title">Verify your email</h1>
        <p className="muted mt-1">
          We sent a verification link to your email address. Open it to activate your account —
          you will not be able to use the app until it is confirmed.
        </p>
      </div>

      {resent ? <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          If an unverified account exists for that email, a new verification link is on its way.
        </div> : null}

      {error ? <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div> : null}

      <form className="space-y-4" onSubmit={handleResend} noValidate>
        <Input label="Email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={event => setEmail(event.target.value)} />
        <Button type="submit" variant="secondary" fullWidth isLoading={isResending}>
          Resend verification email
        </Button>
      </form>

      <p className="text-center text-sm text-slate-600">
        Already verified?{' '}
        <Link to={ROUTES.login} className="font-medium text-brand-700 hover:underline">
          Sign in
        </Link>
      </p>
    </div>;
}
