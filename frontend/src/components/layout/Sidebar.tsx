import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Compass,
  Users,
  MapPin,
  MessageSquare,
  Bell,
  Settings,
  ShieldAlert,
  User as UserIcon,
  X,
} from 'lucide-react';
import { clsx } from '@/utils/helpers';
import { ROUTES } from '@/utils/constants';
import { useAuth } from '@/hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { path: ROUTES.DASHBOARD, icon: Compass, label: 'Feed & Updates' },
    { path: ROUTES.DISCOVER, icon: Users, label: 'Discover People' },
    { path: ROUTES.HOMETOWN, icon: MapPin, label: 'Hometown Match' },
    { path: ROUTES.COMMUNITIES, icon: Users, label: 'Communities' },
    { path: ROUTES.CONNECTIONS, icon: UserIcon, label: 'Connections' },
    { path: ROUTES.MESSAGES, icon: MessageSquare, label: 'Messages' },
    { path: ROUTES.NOTIFICATIONS, icon: Bell, label: 'Notifications' },
    { path: ROUTES.PROFILE, icon: UserIcon, label: 'My Profile' },
    { path: ROUTES.SETTINGS, icon: Settings, label: 'Settings' },
  ];

  if (user?.role === 'admin') {
    menuItems.push({ path: ROUTES.ADMIN, icon: ShieldAlert, label: 'Admin Moderation' });
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />
      )}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-200 ease-in-out md:static md:translate-x-0 flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <span className="font-bold text-gray-900 text-base">Navigation</span>
          <button
            onClick={onClose}
            className="md:hidden p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== ROUTES.DASHBOARD && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={clsx(
                  'flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <Icon className={clsx('w-4 h-4', isActive ? 'text-indigo-600' : 'text-gray-400')} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Small bottom helper box */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="rounded-xl bg-indigo-50/80 p-3 border border-indigo-100 text-xs text-indigo-900">
            <p className="font-semibold mb-0.5">Gurugram Migrant Hub</p>
            <p className="text-indigo-700/80">Connecting 1,200+ professionals across DLF, Cyber City & Sectors.</p>
          </div>
        </div>
      </aside>
    </>
  );
};
