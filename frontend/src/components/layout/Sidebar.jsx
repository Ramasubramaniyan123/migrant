import { NavLink } from 'react-router-dom';
import { useAuthContext } from '@/context/AuthContext';
import { useConnections } from '@/hooks/useConnections';
import { useNotificationContext } from '@/context/NotificationContext';
import { ROUTES } from '@/utils/constants';
import { cn } from '@/utils/helpers';
const ICONS = {
  dashboard: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  discover: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3',
  hometown: 'M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5',
  communities: 'M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  connections: 'M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM20 8v6M23 11h-6',
  messages: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z',
  notifications: 'M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0',
  profile: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  settings: 'M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6',
  admin: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  adminUsers: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM16 11l2 2 4-4',
  reports: 'M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7',
  adminCommunities: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z'
};
function NavItem({
  to,
  label,
  icon,
  badge,
  onNavigate
}) {
  return <NavLink to={to} onClick={onNavigate} className={({
    isActive
  }) => cn('flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors', isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900')}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0" aria-hidden="true">
        <path d={icon} />
      </svg>
      <span className="flex-1 truncate">{label}</span>
      {badge !== undefined && badge > 0 ? <span className="inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-brand-600 px-1.5 text-[11px] font-semibold text-white">
          {badge > 99 ? '99+' : badge}
        </span> : null}
    </NavLink>;
}

/** Primary vertical navigation; optionally closes the mobile drawer after a click. */
export default function Sidebar({
  onNavigate
}) {
  const {
    isAdmin
  } = useAuthContext();
  const {
    incomingCount
  } = useConnections();
  const {
    unreadCount
  } = useNotificationContext();
  return <nav aria-label="Main navigation" className="flex flex-col gap-1 p-3">
      <NavItem to={ROUTES.dashboard} label="Dashboard" icon={ICONS.dashboard} onNavigate={onNavigate} />
      <NavItem to={ROUTES.discover} label="Discover" icon={ICONS.discover} onNavigate={onNavigate} />
      <NavItem to={ROUTES.hometown} label="Hometown Match" icon={ICONS.hometown} onNavigate={onNavigate} />
      <NavItem to={ROUTES.communities} label="Communities" icon={ICONS.communities} onNavigate={onNavigate} />
      <NavItem to={ROUTES.connections} label="Connections" icon={ICONS.connections} badge={incomingCount} onNavigate={onNavigate} />
      <NavItem to={ROUTES.messages} label="Messages" icon={ICONS.messages} onNavigate={onNavigate} />
      <NavItem to={ROUTES.notifications} label="Notifications" icon={ICONS.notifications} badge={unreadCount} onNavigate={onNavigate} />
      <NavItem to={ROUTES.profile} label="Profile" icon={ICONS.profile} onNavigate={onNavigate} />
      <NavItem to={ROUTES.settings} label="Settings" icon={ICONS.settings} onNavigate={onNavigate} />

      {isAdmin ? <>
          <p className="mt-4 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Admin
          </p>
          <NavItem to={ROUTES.admin} label="Admin dashboard" icon={ICONS.admin} onNavigate={onNavigate} />
          <NavItem to={ROUTES.adminUsers} label="Users" icon={ICONS.adminUsers} onNavigate={onNavigate} />
          <NavItem to={ROUTES.adminReports} label="Reports" icon={ICONS.reports} onNavigate={onNavigate} />
          <NavItem to={ROUTES.adminCommunities} label="Communities" icon={ICONS.adminCommunities} onNavigate={onNavigate} />
        </> : null}
    </nav>;
}
