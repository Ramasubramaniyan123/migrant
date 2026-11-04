import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Compass,
  Users,
  MapPin,
  MessageSquare,
  Bell,
  Settings,
  ShieldAlert,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { Avatar } from '@/components/common/Avatar';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/utils/constants';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: ROUTES.DASHBOARD, icon: Compass, label: 'Feed' },
    { path: ROUTES.DISCOVER, icon: Users, label: 'Discover' },
    { path: ROUTES.HOMETOWN, icon: MapPin, label: 'Hometown' },
    { path: ROUTES.COMMUNITIES, icon: Users, label: 'Communities' },
    { path: ROUTES.CONNECTIONS, icon: Users, label: 'Connections' },
    { path: ROUTES.MESSAGES, icon: MessageSquare, label: 'Messages' },
    { path: ROUTES.NOTIFICATIONS, icon: Bell, label: 'Notifications' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  const displayName = user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.name || 'My Account';

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link to={ROUTES.DASHBOARD} className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-sm font-bold text-lg">
                MC
              </div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-700 to-blue-600 bg-clip-text text-transparent">
                MigrantConnect
              </span>
            </Link>
          </div>

          {/* Nav links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== ROUTES.DASHBOARD && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {user?.role === 'admin' && (
              <Link
                to={ROUTES.ADMIN}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname.startsWith(ROUTES.ADMIN)
                    ? 'bg-purple-50 text-purple-700 font-semibold'
                    : 'text-purple-600 hover:bg-purple-50'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            )}
          </nav>

          {/* Right profile & settings */}
          <div className="flex items-center space-x-3">
            <Link
              to={ROUTES.SETTINGS}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors hidden sm:inline-flex"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </Link>

            <Link
              to={ROUTES.PROFILE}
              className="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Avatar
                src={user?.avatar || user?.photo}
                name={displayName}
                size="sm"
              />
              <span className="text-sm font-medium text-gray-700 hidden sm:inline max-w-[120px] truncate">
                {displayName}
              </span>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-600 p-2"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
