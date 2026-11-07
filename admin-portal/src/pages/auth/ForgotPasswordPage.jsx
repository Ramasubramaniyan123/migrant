import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MailCheck } from 'lucide-react';
import { adminAuthService } from '@/services/adminAuthService';
import { ADMIN_ROUTES } from '@/utils/constants';
import { emailError } from '@/utils/validators';
import Button from '@/components/common/Button';
import { Input } from '@/components/common/Input';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    const err = emailError(email);
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await adminAuthService.requestPasswordReset(email.trim());
      setSent(true);
    } catch (err2) {
      setError(err2 instanceof Error ? err2.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="card p-6 sm:p-8">
          {sent ? (
            <div className="text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <MailCheck className="h-6 w-6" />
              </span>
              <h1 className="mt-4 text-xl font-bold text-slate-900">Check your email</h1>
              <p className="mt-2 text-sm text-slate-500">
                If an administrator account exists for{' '}
                <span className="font-medium text-slate-700">{email}</span>, a
                password reset link has been sent. The link is valid for 30
                minutes.
              </p>
              <Link to={ADMIN_ROUTES.login} className="mt-6 inline-block">
                <Button variant="secondary" size="sm">
                  Back to sign in
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-xl font-bold text-slate-900">Reset your password</h1>
                <p className="mt-1 text-sm text-slate-500">
                  Enter your administrator email and we&apos;ll send you a reset
                  link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {error ? (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                ) : null}
                <Input
                  label="Email address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@organisation.org"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                <Button type="submit" fullWidth isLoading={isLoading}>
                  Send reset link
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                Remembered it?{' '}
                <Link
                  to={ADMIN_ROUTES.login}
                  className="font-medium text-blue-600 hover:text-blue-700"
                >
                  Back to sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
