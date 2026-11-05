import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Users, MapPin, Shield, ArrowRight, Heart, Globe, ChevronRight, Play, Star, Zap } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { ROUTES } from '@/utils/constants';
import { useAuth } from '@/hooks/useAuth';

export const LandingPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const handleQuickDemo = async () => {
    await login({ email: 'demo@connect.in', password: 'demo123' });
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col overflow-x-hidden">
      {/* Top Navbar */}
      <nav className="bg-slate-900/95 backdrop-blur-lg border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 animate-pulse">
              <span className="font-bold text-xl">MC</span>
            </div>
            <span className="hidden sm:block font-bold text-2xl text-white">
              MigrantConnect
            </span>
          </div>
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <Link to={ROUTES.DASHBOARD}>
                <Button variant="gradient" size="md" className="px-6 bg-gradient-to-r from-cyan-500 to-blue-500">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="md"
                  onClick={handleQuickDemo}
                  className="hidden sm:flex items-center text-cyan-400 hover:text-cyan-300"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Try Demo
                </Button>
                <Link to={ROUTES.LOGIN}>
                  <Button variant="ghost" size="md" className="text-gray-300 hover:text-white">
                    Log In
                  </Button>
                </Link>
                <Link to={ROUTES.REGISTER}>
                  <Button variant="gradient" size="md" className="px-6 bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/30">
                    Sign Up Free
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 relative">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float animate-delay-200" />
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float animate-delay-400" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-sm font-medium text-cyan-400 animate-slideInUp">
                <Zap className="w-4 h-4" />
                <span>100% Free • No Credit Card Required</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight animate-slideInUp animate-delay-100">
                Find your people{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  in a new city
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-xl animate-slideInUp animate-delay-200">
                Connect with people from your hometown, speak your mother tongue, share cultural celebrations, and find flats, food, and friends in Gurugram and beyond.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 animate-slideInUp animate-delay-300">
                <Link to={ROUTES.REGISTER} className="w-full sm:w-auto">
                  <Button size="lg" variant="gradient" className="w-full sm:w-auto px-8 py-4 text-lg bg-gradient-to-r from-cyan-500 to-blue-500 shadow-xl shadow-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/40 hover:scale-105 transition-all">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleQuickDemo}
                  className="w-full sm:w-auto px-8 py-4 text-lg border-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 hover:scale-105 transition-all"
                >
                  <Globe className="w-5 h-5 mr-2" />
                  Try Demo
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-8 text-sm text-gray-400 pt-4 animate-slideInUp animate-delay-400">
                <div className="flex items-center gap-2 hover:text-cyan-400 transition-colors cursor-pointer">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <span>Privacy Protected</span>
                </div>
                <div className="flex items-center gap-2 hover:text-cyan-400 transition-colors cursor-pointer">
                  <Users className="w-5 h-5 text-cyan-400" />
                  <span>10+ Languages</span>
                </div>
                <div className="flex items-center gap-2 hover:text-cyan-400 transition-colors cursor-pointer">
                  <Heart className="w-5 h-5 text-rose-400" />
                  <span>Community Verified</span>
                </div>
              </div>
            </div>

            {/* Right Content - Visual */}
            <div className="hidden lg:block relative animate-slideInUp animate-delay-500">
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-700">
                <div className="bg-slate-700/50 rounded-2xl p-6 mb-4 border border-slate-600 hover:border-cyan-500/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg">
                      A
                    </div>
                    <div>
                      <p className="font-semibold text-white">Arun from Tenkasi</p>
                      <p className="text-sm text-gray-400">Software Engineer</p>
                    </div>
                    <Star className="w-5 h-5 text-yellow-400 ml-auto fill-yellow-400" />
                  </div>
                  <p className="text-gray-300">Found 23 people from Tamil Nadu in my area within 5km!</p>
                </div>
                <div className="bg-slate-700/50 rounded-2xl p-6 border border-slate-600 hover:border-cyan-500/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold shadow-lg">
                      P
                    </div>
                    <div>
                      <p className="font-semibold text-white">Priya from Madurai</p>
                      <p className="text-sm text-gray-400">Product Manager</p>
                    </div>
                    <Star className="w-5 h-5 text-yellow-400 ml-auto fill-yellow-400" />
                  </div>
                  <p className="text-gray-300">Joined the Tamil community and made 5 new friends this month!</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-slate-800/50 py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Everything you need to feel at home
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Three powerful features designed to help you connect with your community
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div
                className="group bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-2xl p-10 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 border border-slate-600 hover:border-cyan-500/50 cursor-pointer"
                onMouseEnter={() => setHoveredFeature(0)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white mb-8 shadow-lg group-hover:scale-110 transition-transform ${hoveredFeature === 0 ? 'animate-pulse' : ''}`}>
                  <MapPin className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Hometown Matching</h3>
                <p className="text-gray-400 leading-relaxed mb-6">
                  Find migrants from your exact city or district—Madurai, Visakhapatnam, Kochi, Lucknow, or Tenkasi.
                </p>
                <div className="flex items-center text-cyan-400 font-semibold group-hover:gap-3 transition-all">
                  <span>Learn more</span>
                  <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Feature 2 */}
              <div
                className="group bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-2xl p-10 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 border border-slate-600 hover:border-purple-500/50 cursor-pointer"
                onMouseEnter={() => setHoveredFeature(1)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white mb-8 shadow-lg group-hover:scale-110 transition-transform ${hoveredFeature === 1 ? 'animate-pulse' : ''}`}>
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Language Circles</h3>
                <p className="text-gray-400 leading-relaxed mb-6">
                  Join communities based on your mother tongue. Participate in discussions, festivals, and weekend sports.
                </p>
                <div className="flex items-center text-purple-400 font-semibold group-hover:gap-3 transition-all">
                  <span>Learn more</span>
                  <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Feature 3 */}
              <div
                className="group bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-2xl p-10 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300 border border-slate-600 hover:border-emerald-500/50 cursor-pointer"
                onMouseEnter={() => setHoveredFeature(2)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white mb-8 shadow-lg group-hover:scale-110 transition-transform ${hoveredFeature === 2 ? 'animate-pulse' : ''}`}>
                  <Compass className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Geographic Proximity</h3>
                <p className="text-gray-400 leading-relaxed mb-6">
                  Discover people in nearby sectors or tech parks with privacy-safe approximate radius calculations.
                </p>
                <div className="flex items-center text-emerald-400 font-semibold group-hover:gap-3 transition-all">
                  <span>Learn more</span>
                  <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 py-24 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-cyan-600/90 to-blue-600/90" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to find your community?
            </h2>
            <p className="text-lg text-cyan-100 mb-10 leading-relaxed">
              Join thousands of migrants who have already found their people in a new city
            </p>
            <Link to={ROUTES.REGISTER}>
              <Button size="lg" className="bg-white text-cyan-600 hover:bg-cyan-50 px-8 py-4 text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold">
                  MC
                </div>
                <span className="font-bold text-xl">MigrantConnect</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Helping migrants find their community in a new city
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-6 text-cyan-400">Product</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><Link to="#" className="hover:text-cyan-400 transition-colors">Features</Link></li>
                <li><Link to="#" className="hover:text-cyan-400 transition-colors">Pricing</Link></li>
                <li><Link to="#" className="hover:text-cyan-400 transition-colors">About</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-6 text-cyan-400">Company</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><Link to="#" className="hover:text-cyan-400 transition-colors">Blog</Link></li>
                <li><Link to="#" className="hover:text-cyan-400 transition-colors">Careers</Link></li>
                <li><Link to="#" className="hover:text-cyan-400 transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-6 text-cyan-400">Legal</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><Link to="#" className="hover:text-cyan-400 transition-colors">Privacy</Link></li>
                <li><Link to="#" className="hover:text-cyan-400 transition-colors">Terms</Link></li>
                <li><Link to="#" className="hover:text-cyan-400 transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-gray-400 text-sm">
            <p>© 2026 MigrantConnect Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
