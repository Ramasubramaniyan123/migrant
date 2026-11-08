import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, LogOut, Menu, Search, Sun, Moon, Monitor, User, ScrollText } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useTheme } from '@/hooks/useAdminAuth';
import { useAdminUserContext } from '@/context/AdminUserContext';
import { ADMIN_ROUTES, ADMIN_ROLE_LABELS } from '@/utils/constants';
import StatusBadge from '@/components/common/StatusBadge';
import Dropdown, { DropdownItem, DropdownDivider } from '@/components/common/Dropdown';
import SearchBar from '@/components/common/SearchBar';
import { formatRelativeTime } from '@/utils/formatters';
import { cn } from '@/utils/helpers';
const THEME_OPTIONS = [{
  value: 'light',
  label: 'Light',
  icon: Sun
}, {
  value: 'dark',
  label: 'Dark',
  icon: Moon
}, {
  value: 'system',
  label: 'System',
  icon: Monitor
}];
export default function AdminNavbar({
  onMenuClick
}) {
  const {
    admin,
    logout
  } = useAdminAuth();
  const {
    theme,
    setTheme
  } = useTheme();
  const {
    admin: profile
  } = useAdminUserContext();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const handleLogout = async () => {
    await logout();
    navigate(ADMIN_ROUTES.login, {
      replace: true
    });
  };
  const initials = (profile?.name ?? admin?.name ?? 'A').split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
  return <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
      <button onClick={onMenuClick} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden dark:text-slate-400 dark:hover:bg-slate-800" aria-label="Open navigation">
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden flex-1 sm:block">
        <SearchBar value={search} onChange={setSearch} placeholder="Search users, communities, reports…" className="max-w-md" onDebouncedChange={q => {
        if (q.trim()) navigate(`${ADMIN_ROUTES.users}?search=${encodeURIComponent(q)}`);
      }} />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        {/* Theme switcher */}
        <Dropdown align="right" trigger={<button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800" aria-label="Change theme">
              {theme === 'dark' ? <Moon className="h-5 w-5" /> : theme === 'light' ? <Sun className="h-5 w-5" /> : <Monitor className="h-5 w-5" />}
            </button>}>
          {close => <>
              {THEME_OPTIONS.map(opt => <DropdownItem key={opt.value} onClick={() => {
            setTheme(opt.value);
            close();
          }}>
                  <opt.icon className="h-4 w-4" />
                  {opt.label}
                  {theme === opt.value ? <span className="ml-auto text-blue-600">●</span> : null}
                </DropdownItem>)}
            </>}
        </Dropdown>

        {/* Notifications */}
        <Link to={ADMIN_ROUTES.notifications} className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </Link>

        {/* Profile */}
        <Dropdown align="right" trigger={<button className="ml-1 flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Account menu">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                {initials}
              </span>
              <span className="hidden text-left md:block">
                <span className="block text-sm font-medium text-slate-900 dark:text-slate-100">{profile?.name}</span>
                <span className="block text-xs text-slate-500 dark:text-slate-400">{profile ? ADMIN_ROLE_LABELS[profile.role] : ''}</span>
              </span>
            </button>}>
          {close => <>
              <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{profile?.name}</p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">{profile?.email}</p>
                {profile ? <StatusBadge tone="blue" className="mt-1.5">{ADMIN_ROLE_LABELS[profile.role]}</StatusBadge> : null}
              </div>
              <DropdownItem onClick={() => {
            close();
            navigate(ADMIN_ROUTES.administrators);
          }}>
                <User className="h-4 w-4" /> Profile & role
              </DropdownItem>
              <DropdownItem onClick={() => {
            close();
            navigate(ADMIN_ROUTES.auditLogs);
          }}>
                <ScrollText className="h-4 w-4" /> My audit trail
              </DropdownItem>
              <DropdownDivider />
              <DropdownItem danger onClick={handleLogout}>
                <LogOut className="h-4 w-4" /> Sign out
              </DropdownItem>
            </>}
        </Dropdown>
      </div>
    </header>;
}
