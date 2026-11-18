import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const ThemeContext = createContext()

export const useTheme = () => useContext(ThemeContext)

const STORAGE_KEY = 'mcp-theme'

const resolveDark = (mode) => {
  if (mode === 'dark') return true
  if (mode === 'light') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || 'system'
  })

  const applyTheme = useCallback((m) => {
    const dark = resolveDark(m)
    document.documentElement.classList.toggle('dark', dark)
  }, [])

  useEffect(() => {
    applyTheme(mode)
  }, [mode, applyTheme])

  // React to OS-level preference changes while in "system" mode.
  useEffect(() => {
    if (mode !== 'system') return undefined
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyTheme('system')
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [mode, applyTheme])

  const setThemeMode = useCallback((m) => {
    setMode(m)
    localStorage.setItem(STORAGE_KEY, m)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeMode(resolveDark(mode) ? 'light' : 'dark')
  }, [mode, setThemeMode])

  return (
    <ThemeContext.Provider value={{ mode, theme: resolveDark(mode) ? 'dark' : 'light', setThemeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
