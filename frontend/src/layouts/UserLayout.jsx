import { useState } from 'react'
import { useTheme, useAuth } from '../contexts'
import { NavBar } from '../components/navigation/NavBar'
import { Sidebar } from '../components/navigation/Sidebar'

export const UserLayout = ({ children }) => {
  const { setThemeMode } = useTheme()
  const { user } = useAuth()
  const [theme, setTheme] = useState('light')

  return (
    <div className="min-h-screen bg-elevated-surface text-token-text-primary dark:bg-dark-dark dark:text-dark-text">
      <NavBar isUser mode={theme} setTheme={setThemeMode} user={user} />
      <div className="flex min-h-screen">
        <Sidebar theme={theme} />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}