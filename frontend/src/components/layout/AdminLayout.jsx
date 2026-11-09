import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UsersRound, 
  Flag, 
  FileText, 
  Calendar, 
  Network, 
  Languages, 
  MapPin, 
  Bell, 
  Settings, 
  Shield, 
  ScrollText, 
  LogOut, 
  Menu, 
  X,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import adminAuthService from '../../services/adminAuthService';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { adminLogout, admin } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Communities', href: '/admin/communities', icon: UsersRound },
    { name: 'Moderation', href: '/admin/moderation', icon: Flag },
    { name: 'Posts', href: '/admin/posts', icon: FileText },
    { name: 'Events', href: '/admin/events', icon: Calendar },
    { name: 'Connections', href: '/admin/connections', icon: Network },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Languages', href: '/admin/languages', icon: Languages },
    { name: 'Locations', href: '/admin/locations', icon: MapPin },
    { name: 'Notifications', href: '/admin/notifications', icon: Bell },
  ];

  const bottomNavigation = [
    { name: 'Administrators', href: '/admin/administrators', icon: Shield, role: 'SUPER_ADMIN' },
    { name: 'Audit Logs', href: '/admin/audit', icon: ScrollText },
    { name: 'Settings', href: '/admin/settings', icon: Settings, role: 'ADMIN' },
  ];

  const handleLogout = async () => {
    await adminLogout();
    navigate('/admin/login');
  };

  const canAccess = (requiredRole) => {
    if (!requiredRole) return true;
    return adminAuthService.hasRole(requiredRole);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-navy shadow-lg transform transition-transform duration-300 lg:translate-x-0 lg:static ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-navy-light">
            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-terracotta" />
              <span className="text-xl font-bold text-white">Admin Panel</span>
            </Link>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-300 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Admin info */}
          <div className="px-6 py-4 border-b border-navy-light">
            <p className="text-sm text-gray-300">Logged in as</p>
            <p className="text-white font-medium">{admin?.name || admin?.email}</p>
            <p className="text-xs text-terracotta">{admin?.role}</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.filter(item => canAccess(item.role)).map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-terracotta text-white'
                      : 'text-gray-300 hover:bg-navy-light hover:text-white'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom navigation */}
          <div className="border-t border-navy-light px-4 py-4 space-y-1">
            {bottomNavigation.filter(item => canAccess(item.role)).map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-terracotta text-white'
                      : 'text-gray-300 hover:bg-navy-light hover:text-white'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-navy-light hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-grey hover:text-charcoal"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1 lg:flex-none">
            <h1 className="text-xl font-semibold text-navy">
              {navigation.find(item => location.pathname.startsWith(item.href))?.name || 'Admin Panel'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-sm text-grey">
              {new Date().toLocaleDateString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
