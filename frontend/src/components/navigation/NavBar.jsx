import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { Menu } from 'lucide-react'

export const NavBar = ({ isPublic = false, mode = 'light', setTheme, children }) => {
  const [theme, setThemeMode] = useState(mode)
  const location = useLocation()

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setThemeMode(newTheme)
    setTheme(newTheme)
  }

  return (
    <nav className="border-b border-border fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto h-16 flex items-center px-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
            <span className="text-text-primary font-bold text-lg">MC</span>
          </div>
          <Link to="/" className="text-primary font-display text-xl font-semibold hover:no-underline">
            Migrant Community
          </Link>
        </div>

        {/* Right side: Theme toggle and actions */}
        <div className="ml-auto flex items-center gap-4">
          {/* Theme toggle button */}
          <button
            onClick={handleThemeToggle}
            className={`p-2 rounded-lg transition-colors hover:bg-hover ${theme === 'light' ? 'bg-hover text-token-text' : 'bg-token-text'}`}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.394 7.313a9.06 9.06 0 0 0-2.828-2.828c-.59.488-1.223.987-1.886 1.354L13 12.108l-1.617-1.617a9.06 9.06 0 0 0-1.354-1.886c-.488-.59-.987-1.223-1.354-1.886-2.828-2.828a9.054 9.054 0 0 0-2.828 2.828c.488.59 1.223.987 1.886 1.354L7 12.108l1.617 1.617a9.06 9.06 0 0 0 1.354 1.886c.59-.488.987-1.223 1.354-1.886L2.394 7.313a9.059 9.059 0 0 0 0 6.414c.59.488 1.223.987 1.886 1.354l1.886.626a9.047 9.047 0 0 0 1.118.387 8.981 8.981 0 0 1 2.588 0 9.062 9.062 0 0 0 1.53-1.085c.376-.628.526-1.303.526-2.05 0-1.518-.963-2.837-2.29-3.355ZM4.996 15.558l1.81 1.81c.265.265.608.432.95.432.79 0 1.485-.504 1.71-.967.468-.818.432-1.73.432-2.163l-1.11-1.11a10.016 10.016 0 0 1-1.53-1.085c-.376.628-.526 1.303-.526 2.05 0 1.518.963 2.837 2.29 3.355l1.11 1.11c-.036.533-.108.793-.174 1.163l1.81 1.81c-.158.519-.35.946-.582 1.316a3.955 3.955 0 0 1-.832.318 3.969 3.969 0 0 1-.318-.83c.056-.655.05-1.432.02-2.108l-1.81-1.81c-.527-.527-.8-.986-1.08-1.313a10.023 10.023 0 0 0-1.367-.618Z"/>
              </svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 12.79a9 9 0 1 1-8.53 2.946L21 2M3.65 3.65a6.997 6.997 0 0 0 0 9.898l2.828 2.828A7 7 0 0 0 20.82 17H4c.36-2.618 3.032-5 6.6-5Zm5.175-7.277c-.616.616-1.607.616-2.223 0L3.65 13.65a6.993 6.993 0 0 0 0 9.898l2.828 2.828c.783.783 2.043.783 2.827 0l2.828-2.828a6.986 6.986 0 0 0-1.71-4.948H10.5a.5.5 0 0 1-.3-.1l-.3-.3a.5.5 0 0 1-.1-.3l-.3-.3a.5.5 0 0 1-.1-.3l-.3-.3a.5.5 0 0 1-.1-.3l-.4-.4c-.06-.16-.08-.33-.08-.5v-.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v3.5a.5.5 0 0 1-1 .5h-3a.5.5 0 0 1-.5-.5v-2.828c0-.367-.147-.717-.42-1.01L17 5.087a.5.5 0 0 1 .338.182l-.3.3a.5.5 0 0 1-.1.3l-.3.3a.5.5 0 0 1-.1.3l-.3.3a.5.5 0 0 1-.1.3l-.3-.3a.5.5 0 0 1-.1-.3l-.3-.3a.5.5 0 0 1-.1-.3l-.3-.3a.5.5 0 0 1-.1-.3Z"/>
              </svg>
            )}
          </button>

          {/* Mobile menu button (for public layout) */}
          {isPublic && (
            <button
              className="md:hidden p-2 rounded-lg hover:bg-hover"
              onClick={() => window.alert('Menu opened')}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}