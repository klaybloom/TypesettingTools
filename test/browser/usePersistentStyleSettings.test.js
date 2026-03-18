import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { defaultArticleStyleSettings } from '../../src/utils/config.js'
import { usePersistentStyleSettings } from '../../src/composables/usePersistentStyleSettings.js'
import { mountComposable } from './mountComposable.js'

describe('usePersistentStyleSettings', () => {
  afterEach(() => {
    localStorage.clear()
  })

  it('restores persisted settings and merges missing defaults', async () => {
    localStorage.setItem('styleSettings', JSON.stringify({
      fontSize: 18,
      accentColor: '#ff0000'
    }))

    const { result, unmount } = await mountComposable(() => usePersistentStyleSettings(defaultArticleStyleSettings))

    expect(result.articleStyleSettings.value.fontSize).toBe(18)
    expect(result.articleStyleSettings.value.accentColor).toBe('#ff0000')
    expect(result.articleStyleSettings.value.lineHeight).toBe(defaultArticleStyleSettings.lineHeight)

    await unmount()
  })

  it('falls back to defaults when persisted data is invalid', async () => {
    localStorage.setItem('styleSettings', '{bad json')

    const { result, unmount } = await mountComposable(() => usePersistentStyleSettings(defaultArticleStyleSettings))

    expect(result.articleStyleSettings.value).toEqual({ ...defaultArticleStyleSettings })

    await unmount()
  })

  it('persists style changes', async () => {
    const { result, unmount } = await mountComposable(() => usePersistentStyleSettings(defaultArticleStyleSettings))

    result.articleStyleSettings.value = {
      ...result.articleStyleSettings.value,
      fontSize: 19
    }

    await nextTick()

    expect(JSON.parse(localStorage.getItem('styleSettings'))).toMatchObject({
      fontSize: 19
    })

    await unmount()
  })
})
