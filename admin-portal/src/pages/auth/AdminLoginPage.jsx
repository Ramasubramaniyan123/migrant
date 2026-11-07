import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { ADMIN_ROUTES } from '@/utils/constants';
import { emailError, isNonEmpty } from '@/utils/validators';
import Button from '@/components/common/Button';
import { Input } from '@/components/common/Input';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAdminAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    const nextErrors = {};
    const emailErr = emailError(email);
    if (emailErr) nextErrors.email = emailErr;
    if (!isNonEmpty(password)) nextErrors.password = 'Password is required';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setFormError('');
    try {
      await login(email.trim(), password);
      const from = location.state?.from?.pathname ?? ADMIN_ROUTES.dashboard;
      navigate(from, { replace: true });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
            Admin Portal
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Sign in to manage the Migrant Community Platform
          </p>
        </div>

        <div className="card p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {formError ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {formError}
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
              error={errors.email}
            />
            <Input
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              error={errors.password}
            />

            <div className="flex justify-end">
              <Link
                to={ADMIN_ROUTES.forgotPassword}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" fullWidth isLoading={isLoading}>
              Sign in
            </Button>
          </form>
        </div>

        <div className="card mt-4 border-dashed p-4 text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Demo credentials
          </p>
          <p className="mt-1 font-mono text-sm text-slate-600">
            priya.sharma@migrantconnect.in
          </p>
          <p className="font-mono text-sm text-slate-600">admin123</p>
        </div>
      </div>
    </div>
  );
}
