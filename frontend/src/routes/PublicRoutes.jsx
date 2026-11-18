import { Route } from 'react-router-dom'
import { LandingPage } from '../features/landing/LandingPage'
import { AboutPage } from '../features/about/AboutPage'
import { FeaturesPage } from '../features/features/FeaturesPage'
import { ContactPage } from '../features/contact/ContactPage'
import { LoginPage } from '../features/auth/LoginPage'
import { RegisterPage } from '../features/auth/RegisterPage'
import { VerifyEmailPage } from '../features/auth/VerifyEmailPage'
import { ForgotPasswordPage } from '../features/auth/ForgotPasswordPage'
import { ResetPasswordPage } from '../features/auth/ResetPasswordPage'
import { PrivacyPage } from '../features/privacy/Privacy'
import { TermsPage } from '../features/terms/Terms'
import { NotFoundPage } from '../features/not-found/NotFoundPage'

export const PublicRoutes = (
  <>
    <Route index element={<LandingPage />} />
    <Route path="about" element={<AboutPage />} />
    <Route path="features" element={<FeaturesPage />} />
    <Route path="contact" element={<ContactPage />} />
    <Route path="login" element={<LoginPage />} />
    <Route path="register" element={<RegisterPage />} />
    <Route path="verify-email" element={<VerifyEmailPage />} />
    <Route path="forgot-password" element={<ForgotPasswordPage />} />
    <Route path="reset-password" element={<ResetPasswordPage />} />
    <Route path="privacy" element={<PrivacyPage />} />
    <Route path="terms" element={<TermsPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </>
)
