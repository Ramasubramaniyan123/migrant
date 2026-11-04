import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Compass, Users, MapPin, MessageSquare, Bell, Settings, ShieldAlert, LogOut, Menu, X } from 'lucide-react';
import { Avatar } from '@/components/common/Avatar';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/utils/constants';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { path: ROUTES.DASHBOARD, icon: Compass, label: 'Feed' },
    { path: ROUTES.DISCOVER, icon: Users, label: 'Discover' },
    { path: ROUTES.HOMETOWN, icon: MapPin, label: 'Hometown' },
    { path: ROUTES.COMMUNITIES, icon: Users, label: 'Communities' },
    { path: ROUTES.CONNECTIONS, icon: Users, label: 'Connections' },
    { path: ROUTES.MESSAGES, icon: MessageSquare, label: 'Messages' },
    { path: ROUTES.NOTIFICATIONS, icon: Bell, label: 'Notifications' },
  ];

  const handleLogout = async () => { await logout(); navigate(ROUTES.LOGIN); };
  const displayName = user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.name || 'My Account';
  const isActive = (p: string) => location.pathname === p || (p !== ROUTES.DASHBOARD && location.pathname.startsWith(p));

  return (
    <header className="bg-white/95 backdrop-blur border-b border-gray-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to={ROUTES.DASHBOARD} className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-sm font-bold text-lg">MC</div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-700 to-blue-600 bg-clip-text text-transparent hidden xs:inline">MigrantConnect</span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path} className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(item.path) ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                  <Icon className="w-4 h-4" /><span>{item.label}</span>
                </Link>
              );
            })}
            {user?.role === 'admin' && (
              <Link to={ROUTES.ADMIN} className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname.startsWith(ROUTES.ADMIN) ? 'bg-purple-50 text-purple-700 font-semibold' : 'text-purple-600 hover:bg-purple-50'}`}>
                <ShieldAlert className="w-4 h-4" /><span>Admin</span>
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link to={ROUTES.SETTINGS} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors hidden sm:inline-flex" title="Settings"><Settings className="w-5 h-5" /></Link>
            <Link to={ROUTES.PROFILE} className="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors">
              <Avatar src={user?.avatar || user?.photo} name={displayName} size="sm" />
              <span className="text-sm font-medium text-gray-700 hidden sm:inline max-w-[120px] truncate">{displayName}</span>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-500 hover:text-red-600 p-2 hidden sm:inline-flex" title="Log Out"><LogOut className="w-4 h-4" /></Button>
            <button onClick={() => setMobileOpen((v) => !v)} className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Toggle menu">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white shadow-lg">
          <nav className="max-w-7xl mx-auto px-4 py-3 grid grid-cols-2 gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)} className={`flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive(item.path) ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <Icon className="w-4 h-4 shrink-0" /><span className="truncate">{item.label}</span>
                </Link>
              );
            })}
            {user?.role === 'admin' && (
              <Link to={ROUTES.ADMIN} onClick={() => setMobileOpen(false)} className="flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm font-medium text-purple-600 hover:bg-purple-50">
                <ShieldAlert className="w-4 h-4 shrink-0" /><span>Admin</span>
              </Link>
            )}
            <button onClick={() => { setMobileOpen(false); handleLogout(); }} className="flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 col-span-2">
              <LogOut className="w-4 h-4 shrink-0" /><span>Log Out</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};