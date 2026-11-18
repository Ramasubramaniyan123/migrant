import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { ThemeProvider, useTheme } from './ThemeContext'

const Probe = () => {
  const { mode, theme, setThemeMode, toggleTheme } = useTheme()
  return (
    <div>
      <span data-testid="mode">{mode}</span>
      <span data-testid="theme">{theme}</span>
      <button onClick={() => setThemeMode('dark')}>set-dark</button>
      <button onClick={() => setThemeMode('light')}>set-light</button>
      <button onClick={toggleTheme}>toggle</button>
    </div>
  )
}

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('defaults to system and applies OS preference', () => {
    render(<ThemeProvider><Probe /></ThemeProvider>)
    expect(screen.getByTestId('mode')).toHaveTextContent('system')
  })

  it('setThemeMode persists and toggles dark class', () => {
    render(<ThemeProvider><Probe /></ThemeProvider>)
    fireEvent.click(screen.getByText('set-dark'))
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('mcp-theme')).toBe('dark')
    fireEvent.click(screen.getByText('set-light'))
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('toggleTheme flips between light and dark', () => {
    localStorage.setItem('mcp-theme', 'light')
    render(<ThemeProvider><Probe /></ThemeProvider>)
    fireEvent.click(screen.getByText('toggle'))
    expect(screen.getByTestId('mode')).toHaveTextContent('dark')
  })

  it('restores persisted mode on mount', () => {
    localStorage.setItem('mcp-theme', 'dark')
    render(<ThemeProvider><Probe /></ThemeProvider>)
    expect(screen.getByTestId('mode')).toHaveTextContent('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})
