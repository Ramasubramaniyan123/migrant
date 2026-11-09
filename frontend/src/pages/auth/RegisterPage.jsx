import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import Checkbox from '../../components/common/Checkbox';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agreedToTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      navigate('/onboarding');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">Create Account</h1>
          <p className="text-grey">Join our community today</p>
        </div>

        {error && (
          <div className="bg-red-50 text-error p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            label="Email"
            icon={Mail}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            placeholder="your@email.com"
          />

          <Input
            type="password"
            label="Password"
            icon={Lock}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            placeholder="At least 8 characters"
            helperText="Must include uppercase, lowercase, and number"
          />

          <Input
            type="password"
            label="Confirm Password"
            icon={Lock}
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
            placeholder="Re-enter your password"
          />

          <Checkbox
            label={
              <span className="text-sm">
                I agree to the{' '}
                <Link to="/" className="text-terracotta hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/" className="text-terracotta hover:underline">
                  Privacy Policy
                </Link>
              </span>
            }
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
          />

          <Button type="submit" fullWidth loading={loading}>
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-grey mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-terracotta hover:text-terracotta-dark font-medium">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default RegisterPage;
