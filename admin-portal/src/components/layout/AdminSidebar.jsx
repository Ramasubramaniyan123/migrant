import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Building2, Languages, MapPin, Flag, FileText, GitPullRequest, CalendarDays, BarChart3, ShieldCheck, ScrollText, Megaphone, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAdminUserContext } from '@/context/AdminUserContext';
import { ADMIN_ROUTES } from '@/utils/constants';
import { hasPermission } from '@/utils/permissions';
import { cn } from '@/utils/helpers';
const SECTIONS = [{
  title: 'Overview',
  items: [{
    label: 'Dashboard',
    to: ADMIN_ROUTES.dashboard,
    icon: LayoutDashboard,
    permission: 'dashboard:view'
  }]
}, {
  title: 'Management',
  items: [{
    label: 'Users',
    to: ADMIN_ROUTES.users,
    icon: Users,
    permission: 'users:view'
  }, {
    label: 'Communities',
    to: ADMIN_ROUTES.communities,
    icon: Building2,
    permission: 'communities:view'
  }, {
    label: 'Languages',
    to: ADMIN_ROUTES.languages,
    icon: Languages,
    permission: 'languages:manage'
  }, {
    label: 'Locations',
    to: ADMIN_ROUTES.locations,
    icon: MapPin,
    permission: 'locations:manage'
  }, {
    label: 'Events',
    to: ADMIN_ROUTES.events,
    icon: CalendarDays,
    permission: 'events:manage'
  }]
}, {
  title: 'Moderation',
  items: [{
    label: 'Reports',
    to: ADMIN_ROUTES.reports,
    icon: Flag,
    permission: 'moderation:view'
  }, {
    label: 'Posts',
    to: ADMIN_ROUTES.posts,
    icon: FileText,
    permission: 'posts:manage'
  }, {
    label: 'Connections',
    to: ADMIN_ROUTES.connections,
    icon: GitPullRequest,
    permission: 'users:view'
  }]
}, {
  title: 'Insights',
  items: [{
    label: 'Analytics',
    to: ADMIN_ROUTES.analytics,
    icon: BarChart3,
    permission: 'analytics:view'
  }, {
    label: 'Audit Logs',
    to: ADMIN_ROUTES.auditLogs,
    icon: ScrollText,
    permission: 'audit:view'
  }]
}, {
  title: 'Administration',
  items: [{
    label: 'Administrators',
    to: ADMIN_ROUTES.administrators,
    icon: ShieldCheck,
    permission: 'admins:manage'
  }, {
    label: 'Notifications',
    to: ADMIN_ROUTES.notifications,
    icon: Megaphone,
    permission: 'notifications:send'
  }, {
    label: 'Settings',
    to: ADMIN_ROUTES.settings,
    icon: Settings,
    permission: 'settings:manage'
  }]
}];
export default function AdminSidebar({
  onNavigate
}) {
  const {
    admin,
    sidebarCollapsed,
    toggleSidebar
  } = useAdminUserContext();
  return <aside className={cn('flex h-full flex-col border-r border-slate-200 bg-white transition-[width] duration-200 dark:border-slate-800 dark:bg-slate-900', sidebarCollapsed ? 'w-[68px]' : 'w-64')}>
      {/* Brand */}
      <div className={cn('flex h-16 items-center border-b border-slate-200 px-4 dark:border-slate-800', sidebarCollapsed && 'justify-center px-2')}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
          MC
        </div>
        {!sidebarCollapsed ? <div className="ml-3 min-w-0">
            <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">MigrantConnect</p>
            <p className="truncate text-xs text-slate-500">Admin Console</p>
          </div> : null}
      </div>

      {/* Nav */}
      <nav className="admin-scrollbar flex-1 overflow-y-auto px-3 py-4" aria-label="Admin navigation">
        {SECTIONS.map(section => {
        const visible = section.items.filter(item => !item.permission || hasPermission(admin?.role, item.permission));
        if (visible.length === 0) return null;
        return <div key={section.title} className="mb-5">
              {!sidebarCollapsed ? <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {section.title}
                </p> : <div className="mx-3 mb-2 border-t border-slate-200 dark:border-slate-800" />}
              <div className="space-y-0.5">
                {visible.map(item => <NavLink key={item.to} to={item.to} end={item.end} onClick={onNavigate} title={sidebarCollapsed ? item.label : undefined} className={({
              isActive
            }) => cn('flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors', sidebarCollapsed && 'justify-center px-0', isActive ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100')}>
                    <item.icon className="h-5 w-5 shrink-0" />
                    {!sidebarCollapsed ? <span className="truncate">{item.label}</span> : null}
                  </NavLink>)}
              </div>
            </div>;
      })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-slate-200 p-3 dark:border-slate-800">
        <button onClick={toggleSidebar} className={cn('flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800', sidebarCollapsed && 'justify-center px-0')} aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          {!sidebarCollapsed ? <span>Collapse</span> : null}
        </button>
      </div>
    </aside>;
}
