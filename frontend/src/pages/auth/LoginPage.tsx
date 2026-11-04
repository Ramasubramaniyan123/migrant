import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useAuth } from '@/hooks/useAuth';
import { validateEmail } from '@/utils/validators';
import { ROUTES } from '@/utils/constants';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('demo@connect.in');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 1) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);
    try {
      await login({ email, password });
      navigate(ROUTES.DASHBOARD);
    } catch {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (userEmail: string) => {
    setEmail(userEmail);
    setPassword('demo123');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/70 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-6">
          <Link to="/" className="inline-block font-extrabold text-2xl bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            MigrantConnect
          </Link>
          <h2 className="text-xl font-bold text-gray-900 mt-2">Welcome Back</h2>
          <p className="text-xs text-gray-500 mt-1">Sign in to find your people and local communities</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@connect.in"
            required
          />
          <Input
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          {error && <p className="text-red-600 text-xs bg-red-50 p-2 rounded-lg">{error}</p>}
          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 py-2.5 font-semibold" isLoading={isLoading}>
            Sign In
          </Button>
        </form>

        {/* Quick demo fill buttons */}
        <div className="mt-5 pt-4 border-t border-gray-100">
          <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold text-center mb-2">
            Quick Prototype Logins
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickFill('demo@connect.in')}
              className="p-2 border border-gray-200 rounded-lg text-left hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
            >
              <div className="font-semibold text-gray-800">Arun (Member)</div>
              <div className="text-[10px] text-gray-500 truncate">demo@connect.in</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin@connect.in')}
              className="p-2 border border-gray-200 rounded-lg text-left hover:bg-purple-50 hover:border-purple-300 transition-colors"
            >
              <div className="font-semibold text-gray-800">Maya (Admin)</div>
              <div className="text-[10px] text-gray-500 truncate">admin@connect.in</div>
            </button>
          </div>
        </div>

        <div className="mt-5 text-center text-xs text-gray-600">
          <Link to={ROUTES.FORGOT_PASSWORD} className="text-indigo-600 hover:underline">
            Forgot your password?
          </Link>
        </div>
        <div className="mt-3 text-center text-xs text-gray-600">
          Don't have an account?{' '}
          <Link to={ROUTES.REGISTER} className="text-indigo-600 font-semibold hover:underline">
            Sign up now
          </Link>
        </div>
      </div>
    </div>
  );
};
