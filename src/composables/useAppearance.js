import { onMounted, ref } from 'vue'

const VALID_MODES = ['light', 'dark']

function prefersDark() {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-color-scheme: dark)').matches
}

function loadColorMode() {
  let saved = null
  try {
    saved = localStorage.getItem('colorMode')
    // 旧版本曾把 'dark' 存进 'theme' key，兼容一下
    if (!VALID_MODES.includes(saved)) {
      const legacyTheme = localStorage.getItem('theme')
      if (VALID_MODES.includes(legacyTheme)) saved = legacyTheme
    }
  } catch (_) { /* ignore */ }

  if (VALID_MODES.includes(saved)) return saved
  return prefersDark() ? 'dark' : 'light'
}

function persist(mode) {
  try {
    localStorage.setItem('colorMode', mode)
  } catch (_) { /* ignore */ }
}

export function useAppearance() {
  const colorMode = ref('light')

  function setColorMode(mode) {
    if (!VALID_MODES.includes(mode)) return
    colorMode.value = mode
    persist(mode)
  }

  function toggleColorMode() {
    setColorMode(colorMode.value === 'dark' ? 'light' : 'dark')
  }

  onMounted(() => {
    colorMode.value = loadColorMode()
  })

  return {
    colorMode,
    setColorMode,
    toggleColorMode
  }
}
