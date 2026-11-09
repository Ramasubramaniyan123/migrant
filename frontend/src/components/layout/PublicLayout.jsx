import { Link, Outlet } from 'react-router-dom';
import { Users } from 'lucide-react';
import Button from '../common/Button';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-offwhite">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <Users className="w-8 h-8 text-terracotta" />
              <span className="text-xl font-bold text-navy">Migrant Community</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-grey hover:text-navy transition-colors">
                Home
              </Link>
              <Link to="/login" className="text-grey hover:text-navy transition-colors">
                Login
              </Link>
              <Link to="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Link to="/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-navy text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-6 h-6 text-terracotta" />
                <span className="font-bold">Migrant Community</span>
              </div>
              <p className="text-sm text-gray-300">
                Connect with people from your hometown and build meaningful communities.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link to="/" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">How It Works</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link to="/" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Safety Tips</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link to="/" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Community Guidelines</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-navy-light mt-8 pt-8 text-center text-sm text-gray-300">
            <p>&copy; {new Date().getFullYear()} Migrant Community Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
