import { createContext, useContext, useMemo, useState } from 'react';
import { useAdminAuthContext } from './AdminAuthContext';
const AdminUserContext = createContext(null);
export function AdminUserProvider({
  children
}) {
  const {
    admin
  } = useAdminAuthContext();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const value = useMemo(() => ({
    admin,
    sidebarCollapsed,
    toggleSidebar: () => setSidebarCollapsed(c => !c),
    setSidebarCollapsed
  }), [admin, sidebarCollapsed]);
  return <AdminUserContext.Provider value={value}>{children}</AdminUserContext.Provider>;
}
export function useAdminUserContext() {
  const ctx = useContext(AdminUserContext);
  if (!ctx) throw new Error('useAdminUserContext must be used within AdminUserProvider');
  return ctx;
}
