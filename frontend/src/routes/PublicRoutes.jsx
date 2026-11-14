import { Routes, Route } from 'react-router-dom'
import { LandingPage } from '../features/landing/LandingPage'
import { Auth } from '../features/auth/Auth'
import { Privacy } from '../features/privacy/Privacy'
import { Terms } from '../features/terms/Terms'

export const PublicRoutes = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/about" element={<LandingPage />} />
    <Route path="/features" element={<LandingPage />} />
    <Route path="/contact" element={<LandingPage />} />
    <Route path="/login" element={<Auth />} />
    <Route path="/register" element={<Auth />} />
    <Route path="/verify-email" element={<Auth />} />
    <Route path="/forgot-password" element={<Auth />} />
    <Route path="/privacy" element={<Privacy />} />
    <Route path="/terms" element={<Terms />} />
  </Routes>
)