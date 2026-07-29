import { ref, watch } from 'vue'

type Theme = 'light' | 'dark'
const THEME_KEY = 'gym.theme'

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(THEME_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

// Module-level singleton so every consumer shares one reactive theme.
const theme = ref<Theme>(getInitialTheme())

function apply(value: Theme): void {
  const root = document.documentElement
  root.classList.toggle('dark', value === 'dark')
  root.style.colorScheme = value
}

apply(theme.value)
watch(theme, (value) => {
  apply(value)
  localStorage.setItem(THEME_KEY, value)
})

export function useTheme() {
  function toggle(): void {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }
  function set(value: Theme): void {
    theme.value = value
  }
  return { theme, toggle, set }
}
