import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Users, MapPin, Shield, ArrowRight, Heart } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { ROUTES } from '@/utils/constants';
import { useAuth } from '@/hooks/useAuth';

export const LandingPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleQuickDemo = async () => {
    await login({ email: 'demo@connect.in', password: 'demo123' });
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/50 via-white to-gray-50 flex flex-col justify-between">
      {/* Top Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 min-w-0">
            <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-sm font-bold text-lg">
              MC
            </div>
            <span className="hidden sm:inline font-extrabold text-xl tracking-tight whitespace-nowrap bg-gradient-to-r from-indigo-700 to-blue-600 bg-clip-text text-transparent">
              MigrantConnect
            </span>
          </div>
          <div className="flex shrink-0 items-center space-x-1 sm:space-x-3">
            {isAuthenticated ? (
              <Link to={ROUTES.DASHBOARD}>
                <Button variant="primary">Enter Dashboard</Button>
              </Link>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={handleQuickDemo} className="hidden sm:inline-flex text-indigo-600 font-semibold">
                  1-Click Demo
                </Button>
                <Link to={ROUTES.LOGIN}>
                  <Button variant="ghost" size="sm">Log In</Button>
                </Link>
                <Link to={ROUTES.REGISTER}>
                  <Button variant="primary" size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-700 mb-6">
            <span>✨ Built for India’s Relocating Professionals & Students</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-gray-950 tracking-tight leading-tight">
            Find your roots, <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              wherever you relocate.
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed">
            Connect with people from your hometown, speak your mother tongue, share cultural celebrations, and find flats, food, and friends in Gurugram and beyond.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={ROUTES.REGISTER} className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto px-8 bg-indigo-600 hover:bg-indigo-700 shadow-md">
                Create Free Profile
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              onClick={handleQuickDemo}
              className="w-full sm:w-auto px-6 border-indigo-200 text-indigo-700 hover:bg-indigo-50"
            >
              Explore Demo (Arun from Tenkasi)
            </Button>
          </div>

          <div className="mt-8 text-xs text-gray-500 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <span className="flex items-center"><Shield className="w-4 h-4 mr-1 text-emerald-500" /> Privacy First Location</span>
            <span className="flex items-center"><Users className="w-4 h-4 mr-1 text-indigo-500" /> 10+ Native Languages</span>
            <span className="flex items-center"><Heart className="w-4 h-4 mr-1 text-rose-500" /> Community Moderated</span>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-14 sm:mt-20">
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Hometown Matching</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Find migrants originating from your exact city or district—Madurai, Visakhapatnam, Kochi, Lucknow, or Tenkasi.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Language Circles</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Join active communities based on your mother tongue. Participate in discussions, local festival events, and weekend sports.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-6">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Geographic Proximity</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Discover people in nearby sectors or tech parks with privacy-safe approximate radius calculations.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8 text-center text-xs text-gray-500">
        <p>© 2026 MigrantConnect Platform. Scalable React + Spring Boot architecture.</p>
      </footer>
    </div>
  );
};
