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

  it('从 storage 恢复 colorMode', async () => {
    localStorage.setItem('colorMode', 'dark')

    const { result, unmount } = await mountComposable(() => useAppearance())

    expect(result.colorMode.value).toBe('dark')

    await unmount()
  })

  it('兼容旧版本把 dark 写在 theme key 的情况', async () => {
    localStorage.setItem('theme', 'dark')

    const { result, unmount } = await mountComposable(() => useAppearance())

    expect(result.colorMode.value).toBe('dark')

    await unmount()
  })

  it('未持久化时跟随系统偏好', async () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }))

    const { result, unmount } = await mountComposable(() => useAppearance())

    expect(result.colorMode.value).toBe('dark')

    await unmount()
  })

  it('setColorMode 持久化并校验白名单', async () => {
    const { result, unmount } = await mountComposable(() => useAppearance())

    result.setColorMode('dark')
    expect(result.colorMode.value).toBe('dark')
    expect(localStorage.getItem('colorMode')).toBe('dark')

    // 非法值被忽略
    result.setColorMode('weird')
    expect(result.colorMode.value).toBe('dark')

    await unmount()
  })

  it('toggleColorMode 在 light / dark 之间切换', async () => {
    const { result, unmount } = await mountComposable(() => useAppearance())

    expect(result.colorMode.value).toBe('light')
    result.toggleColorMode()
    expect(result.colorMode.value).toBe('dark')
    expect(localStorage.getItem('colorMode')).toBe('dark')
    result.toggleColorMode()
    expect(result.colorMode.value).toBe('light')

    await unmount()
  })
})
