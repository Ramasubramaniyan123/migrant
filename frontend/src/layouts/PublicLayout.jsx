import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { NavBar } from '../components/navigation/NavBar'
import { HeroSection } from '../features/landing/HeroSection'
import { FeaturesSection } from '../features/landing/FeaturesSection'
import { TrustSection } from '../features/landing/TrustSection'
import { CallToAction } from '../features/landing/CallToAction'

export const PublicLayout = ({ children }) => {
  const { setThemeMode } = useTheme()
  const [theme, setTheme] = useState('light')

  return (
    <div className="min-h-screen bg-white text-dark dark:bg-dark-dark dark:text-dark-text">
      <NavBar isPublic mode={theme} setTheme={setThemeMode} />
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  )
}