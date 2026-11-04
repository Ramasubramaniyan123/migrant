import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useAuth } from '@/hooks/useAuth';
import { validateEmail, validatePassword, validateName } from '@/utils/validators';
import { ROUTES } from '@/utils/constants';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateName(formData.firstName)) {
      setError('First name must be at least 2 characters');
      return;
    }

    if (!validateName(formData.lastName)) {
      setError('Last name must be at least 2 characters');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
      setError(passwordValidation.message || 'Invalid password');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      navigate(ROUTES.ONBOARDING);
    } catch {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/70 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-6">
          <Link to="/" className="inline-block font-extrabold text-2xl bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            MigrantConnect
          </Link>
          <h2 className="text-xl font-bold text-gray-900 mt-2">Create Your Account</h2>
          <p className="text-xs text-gray-500 mt-1">Join fellow migrants in your city</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="text"
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Arun"
              required
            />
            <Input
              type="text"
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Selvam"
              required
            />
          </div>
          <Input
            type="email"
            label="Email Address"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@domain.com"
            required
          />
          <Input
            type="password"
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            helperText="At least 8 chars with uppercase, lowercase, and number"
            required
          />
          <Input
            type="password"
            label="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
          {error && <p className="text-red-600 text-xs bg-red-50 p-2 rounded-lg">{error}</p>}
          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 py-2.5 font-semibold" isLoading={isLoading}>
            Create Account & Continue
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-600">
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN} className="text-indigo-600 font-semibold hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
