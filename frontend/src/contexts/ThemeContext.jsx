import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check for persisted theme or system preference
    const stored = localStorage.getItem('migrant-theme')
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (stored === 'dark' || (!stored && !systemDark)) {
      return 'light'
    } else if (stored === 'light' || (stored === null && systemDark)) {
      return 'dark'
    }
    return 'light'
  })

  const setThemeMode = (mode) => {
    setTheme(mode)
    localStorage.setItem('migrant-theme', mode)
    document.documentElement.setAttribute('data-theme', mode)
  }

  // Initialize theme on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  )
}