# PowerShell script to create all remaining page files

$pages = @{
    "pages/auth/ForgotPasswordPage.jsx" = @"
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import authService from '../../services/authService';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">Reset Password</h1>
          <p className="text-grey">Enter your email to receive a reset link</p>
        </div>

        {success ? (
          <div className="bg-green-50 text-success p-4 rounded-lg mb-4">
            Check your email for password reset instructions.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-red-50 text-error p-3 rounded-lg text-sm">{error}</div>}
            <Input
              type="email"
              label="Email"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
            />
            <Button type="submit" fullWidth loading={loading}>Send Reset Link</Button>
          </form>
        )}

        <p className="text-center text-sm text-grey mt-6">
          <Link to="/login" className="text-terracotta hover:text-terracotta-dark">
            Back to login
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
"@

    "pages/auth/ResetPasswordPage.jsx" = @"
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import authService from '../../services/authService';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await authService.resetPassword(token, formData.password);
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-navy mb-8 text-center">Create New Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 text-error p-3 rounded-lg text-sm">{error}</div>}
          <Input type="password" label="New Password" icon={Lock} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
          <Input type="password" label="Confirm Password" icon={Lock} value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} required />
          <Button type="submit" fullWidth loading={loading}>Reset Password</Button>
        </form>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
"@

    "pages/auth/VerifyEmailPage.jsx" = @"
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import authService from '../../services/authService';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        return;
      }
      try {
        await authService.verifyEmail(token);
        setStatus('success');
      } catch (err) {
        setStatus('error');
      }
    };
    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md text-center">
        {status === 'loading' && <Loading text="Verifying your email..." />}
        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-navy mb-2">Email Verified!</h1>
            <p className="text-grey mb-6">Your email has been successfully verified.</p>
            <Link to="/login"><Button fullWidth>Continue to Login</Button></Link>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 text-error mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-navy mb-2">Verification Failed</h1>
            <p className="text-grey mb-6">The verification link is invalid or expired.</p>
            <Link to="/login"><Button fullWidth>Go to Login</Button></Link>
          </>
        )}
      </Card>
    </div>
  );
};

export default VerifyEmailPage;
"@
}

# Create all pages
foreach ($page in $pages.GetEnumerator()) {
    $filePath = Join-Path "src" $page.Key
    $dir = Split-Path $filePath -Parent
    
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
    
    $page.Value | Out-File -FilePath $filePath -Encoding utf8
    Write-Host "Created: $($page.Key)"
}

Write-Host "`nAuth pages created successfully!"
