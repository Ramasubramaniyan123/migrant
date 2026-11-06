import { useThemeContext } from '@/context/ThemeContext'
import type { Theme, ResolvedTheme } from '@/context/ThemeContext'

export type { Theme, ResolvedTheme }

export function useTheme() {
  return useThemeContext()
}

