import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { Menu, Compass, Users, MessageSquare, Bell } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { ROUTES } from '@/utils/constants';

export const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const bottomItems = [
    { path: ROUTES.DASHBOARD, icon: Compass, label: 'Feed' },
    { path: ROUTES.DISCOVER, icon: Users, label: 'Discover' },
    { path: ROUTES.MESSAGES, icon: MessageSquare, label: 'Messages' },
    { path: ROUTES.NOTIFICATIONS, icon: Bell, label: 'Alerts' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="min-w-0 flex-1 overflow-y-auto pb-20 md:pb-0">
          <div className="md:hidden px-4 pt-3">
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)} className="gap-2">
              <Menu className="w-5 h-5" />
              <span className="text-sm">Menu</span>
            </Button>
          </div>
          <div className="p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-gray-200 safe-pb">
        <div className="flex items-center justify-around h-16">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path || (item.path !== ROUTES.DASHBOARD && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center flex-1 h-full text-[11px] font-medium transition-colors ${active ? 'text-indigo-600' : 'text-gray-500'}`}
              >
                <Icon className={`w-5 h-5 mb-0.5 ${active ? 'text-indigo-600' : 'text-gray-400'}`} />
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex flex-col items-center justify-center flex-1 h-full text-[11px] font-medium text-gray-500"
          >
            <Menu className="w-5 h-5 mb-0.5 text-gray-400" />
            More
          </button>
        </div>
      </nav>
    </div>
  );
};