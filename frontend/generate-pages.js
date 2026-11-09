// Script to generate placeholder pages for rapid scaffolding
// Run with: node generate-pages.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pages = {
  'pages/auth/LoginPage.jsx': `import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/app/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">Welcome Back</h1>
          <p className="text-grey">Sign in to your account to continue</p>
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

          <div>
            <Input
              type={showPassword ? 'text' : 'password'}
              label="Password"
              icon={Lock}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-sm text-terracotta hover:text-terracotta-dark mt-1"
            >
              {showPassword ? 'Hide' : 'Show'} password
            </button>
          </div>

          <div className="flex items-center justify-between text-sm">
            <Link to="/forgot-password" className="text-terracotta hover:text-terracotta-dark">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" fullWidth loading={loading}>
            Sign In
          </Button>
        </form>

        <p className="text-center text-sm text-grey mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-terracotta hover:text-terracotta-dark font-medium">
            Sign up
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;`,

  'pages/auth/RegisterPage.jsx': `import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
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

export default RegisterPage;`,
};

// Create directories and files
Object.entries(pages).forEach(([filePath, content]) => {
  const fullPath = path.join(__dirname, 'src', filePath);
  const dir = path.dirname(fullPath);

  // Create directory if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Write file
  fs.writeFileSync(fullPath, content);
  console.log(\`Created: \${filePath}\`);
});

console.log('\\nPage generation complete!');
