import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Users, 
  Home, 
  Compass, 
  UsersRound, 
  MessageCircle, 
  Bell, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Calendar,
  User,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import Avatar from '../common/Avatar';
import { useUser } from '../../context/UserContext';

const UserLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { profile } = useUser();
  const { unreadCount } = useNotifications();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/app/dashboard', icon: Home },
    { name: 'Discover', href: '/app/discover', icon: Compass },
    { name: 'Communities', href: '/app/communities', icon: UsersRound },
    { name: 'Connections', href: '/app/connections', icon: Users },
    { name: 'Messages', href: '/app/messages', icon: MessageCircle },
    { name: 'Events', href: '/app/events', icon: Calendar },
    { name: 'Notifications', href: '/app/notifications', icon: Bell, badge: unreadCount },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-offwhite">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 lg:translate-x-0 lg:static ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <Link to="/app/dashboard" className="flex items-center gap-2">
              <Users className="w-8 h-8 text-terracotta" />
              <span className="text-xl font-bold text-navy">MC</span>
            </Link>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-grey hover:text-charcoal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-lavender text-terracotta'
                      : 'text-grey hover:bg-gray-50 hover:text-charcoal'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                  {item.badge > 0 && (
                    <span className="ml-auto bg-terracotta text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User profile section */}
          <div className="border-t border-gray-200 p-4">
            <Link
              to="/app/profile"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Avatar 
                src={profile?.profilePictureUrl} 
                alt={profile?.firstName || 'User'} 
                size="md" 
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-navy truncate">
                  {profile?.firstName} {profile?.lastName}
                </p>
                <p className="text-xs text-grey truncate">View Profile</p>
              </div>
            </Link>

            <div className="mt-2 flex gap-2">
              <Link 
                to="/app/settings"
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-grey hover:text-charcoal hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-error hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile) */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="text-grey hover:text-charcoal"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link to="/app/dashboard" className="flex items-center gap-2">
            <Users className="w-6 h-6 text-terracotta" />
            <span className="font-bold text-navy">Migrant Community</span>
          </Link>
          <Link to="/app/profile">
            <Avatar 
              src={profile?.profilePictureUrl} 
              size="sm" 
            />
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
