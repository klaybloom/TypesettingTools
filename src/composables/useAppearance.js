import { computed, onMounted, onUnmounted, ref } from 'vue'

const THEME_LABELS = {
  default: '默认极简',
  fashion: '时尚风格',
  retro: '复古风格'
}

const THEME_TOKENS = {
  default: '极简',
  fashion: '时尚',
  retro: '复古'
}

export function useAppearance() {
  const theme = ref('default')
  const colorMode = ref('light')
  const showThemeMenu = ref(false)

  const themeName = computed(() => THEME_LABELS[theme.value] || '默认')
  const themeToken = computed(() => THEME_TOKENS[theme.value] || '极简')

  function setColorMode(mode) {
    colorMode.value = mode
    localStorage.setItem('colorMode', mode)
  }

  function toggleThemeMenu() {
    showThemeMenu.value = !showThemeMenu.value
  }

  function changeTheme(newTheme) {
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)
    showThemeMenu.value = false
  }

  function closeThemeMenu(event) {
    if (!event.target.closest('.theme-dropdown')) {
      showThemeMenu.value = false
    }
  }

  onMounted(() => {
    const savedTheme = localStorage.getItem('theme') || 'default'
    const savedMode = localStorage.getItem('colorMode')

    if (savedMode) {
      colorMode.value = savedMode
      theme.value = ['light', 'dark'].includes(savedTheme) ? 'default' : savedTheme
    } else if (savedTheme === 'dark') {
      colorMode.value = 'dark'
      theme.value = 'default'
    } else if (savedTheme === 'light') {
      colorMode.value = 'light'
      theme.value = 'default'
    } else {
      theme.value = savedTheme
      colorMode.value = typeof window !== 'undefined'
        && typeof window.matchMedia === 'function'
        && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    }

    document.addEventListener('click', closeThemeMenu)
  })

  onUnmounted(() => {
    document.removeEventListener('click', closeThemeMenu)
  })

  return {
    theme,
    colorMode,
    showThemeMenu,
    themeName,
    themeToken,
    setColorMode,
    toggleThemeMenu,
    changeTheme
  }
}
