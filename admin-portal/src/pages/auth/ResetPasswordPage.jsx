import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import { adminAuthService } from '@/services/adminAuthService';
import { ADMIN_ROUTES } from '@/utils/constants';
import { isNonEmpty, passwordError } from '@/utils/validators';
import Button from '@/components/common/Button';
import { Input } from '@/components/common/Input';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') ?? '';

  const [token, setToken] = useState(tokenFromUrl);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    const nextErrors = {};
    if (!tokenFromUrl && !isNonEmpty(token)) nextErrors.token = 'Reset token is required';
    const pwErr = passwordError(password);
    if (pwErr) nextErrors.password = pwErr;
    if (!isNonEmpty(confirm)) nextErrors.confirm = 'Please confirm your password';
    else if (confirm !== password) nextErrors.confirm = 'Passwords do not match';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setFormError('');
    setIsLoading(true);
    try {
      await adminAuthService.resetPassword(token.trim(), password);
      setDone(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Password reset failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="card p-6 sm:p-8">
          {done ? (
            <div className="text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <KeyRound className="h-6 w-6" />
              </span>
              <h1 className="mt-4 text-xl font-bold text-slate-900">Password updated</h1>
              <p className="mt-2 text-sm text-slate-500">
                Your password has been reset successfully. You can now sign in
                with your new password.
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
                <h1 className="text-xl font-bold text-slate-900">Choose a new password</h1>
                <p className="mt-1 text-sm text-slate-500">
                  Enter your new administrator password below.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {formError ? (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {formError}
                  </div>
                ) : null}

                {!tokenFromUrl ? (
                  <Input
                    label="Reset token"
                    name="token"
                    placeholder="Paste the token from your reset email"
                    value={token}
                    onChange={e => setToken(e.target.value)}
                    error={errors.token}
                    hint="No token in the URL? Paste it here."
                  />
                ) : null}

                <Input
                  label="New password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="At least 8 characters with a letter and a number"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  error={errors.password}
                />
                <Input
                  label="Confirm new password"
                  name="confirm"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Re-enter your new password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  error={errors.confirm}
                />

                <Button type="submit" fullWidth isLoading={isLoading}>
                  Reset password
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
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
