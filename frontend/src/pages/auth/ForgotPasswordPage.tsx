import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { validateEmail } from '@/utils/validators';
import { ROUTES } from '@/utils/constants';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      setSuccess(true);
    } catch {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/70 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-6">
          <Link to="/" className="inline-block font-extrabold text-2xl bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            MigrantConnect
          </Link>
          <h2 className="text-xl font-bold text-gray-900 mt-2">Reset Password</h2>
          <p className="text-xs text-gray-500 mt-1">We'll send you recovery instructions</p>
        </div>

        {success ? (
          <div className="text-center">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Check Your Email</h3>
            <p className="text-xs text-gray-600 mb-6">
              We've simulated sending a password reset link to <strong>{email}</strong>.
            </p>
            <Link to={ROUTES.LOGIN}>
              <Button variant="outline" className="w-full">Back to Login</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Registered Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            {error && <p className="text-red-600 text-xs bg-red-50 p-2 rounded-lg">{error}</p>}
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 py-2.5 font-semibold" isLoading={isLoading}>
              Send Reset Link
            </Button>
            <div className="mt-4 text-center text-xs text-gray-600">
              Remember your password?{' '}
              <Link to={ROUTES.LOGIN} className="text-indigo-600 font-semibold hover:underline">
                Back to sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
