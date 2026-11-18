import { Outlet } from 'react-router-dom'
import { NavBar } from '../components/navigation/NavBar'

export const PublicLayout = () => (
  <div className="flex min-h-screen flex-col bg-canvas text-ink">
    <NavBar variant="public" />
    <main className="flex-1">
      <Outlet />
    </main>
  </div>
)
