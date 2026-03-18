import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mountComposable } from './mountComposable.js'
import { useAppearance } from '../../src/composables/useAppearance.js'

describe('useAppearance', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    localStorage.clear()
  })

  it('restores theme and color mode from storage', async () => {
    localStorage.setItem('theme', 'macaron')
    localStorage.setItem('colorMode', 'dark')

    const { result, unmount } = await mountComposable(() => useAppearance())

    expect(result.theme.value).toBe('macaron')
    expect(result.colorMode.value).toBe('dark')
    expect(result.themeName.value).toBe('马卡龙')

    await unmount()
  })

  it('keeps legacy dark theme compatibility when color mode is absent', async () => {
    localStorage.setItem('theme', 'dark')

    const { result, unmount } = await mountComposable(() => useAppearance())

    expect(result.theme.value).toBe('default')
    expect(result.colorMode.value).toBe('dark')

    await unmount()
  })

  it('persists updates made through appearance actions', async () => {
    const { result, unmount } = await mountComposable(() => useAppearance())

    result.toggleThemeMenu()
    expect(result.showThemeMenu.value).toBe(true)

    result.changeTheme('retro')
    result.setColorMode('dark')

    expect(result.theme.value).toBe('retro')
    expect(result.showThemeMenu.value).toBe(false)
    expect(result.colorMode.value).toBe('dark')
    expect(localStorage.getItem('theme')).toBe('retro')
    expect(localStorage.getItem('colorMode')).toBe('dark')

    await unmount()
  })
})
