import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { defaultArticleStyleSettings } from '../../src/utils/config.js'
import { useRenderedDocument } from '../../src/composables/useRenderedDocument.js'
import { mountComposable } from './mountComposable.js'

describe('useRenderedDocument', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('tracks character count and reading time', async () => {
    vi.useFakeTimers()
    const articleStyleSettings = ref({ ...defaultArticleStyleSettings })
    const { result, unmount } = await mountComposable(() => useRenderedDocument(articleStyleSettings))

    result.rawContent.value = '测试 文本'
    await nextTick()

    expect(result.charCount.value).toBe(4)
    expect(result.readingTime.value).toBe(1)
    expect(result.formattedContent.value).toBe('')

    vi.advanceTimersByTime(300)
    await nextTick()

    expect(result.formattedContent.value).toContain('测试 文本')

    await unmount()
  })

  it('debounces style changes before re-rendering', async () => {
    vi.useFakeTimers()
    const articleStyleSettings = ref({ ...defaultArticleStyleSettings })
    const { result, unmount } = await mountComposable(() => useRenderedDocument(articleStyleSettings))

    result.rawContent.value = '# 标题'
    await nextTick()
    vi.advanceTimersByTime(300)
    await nextTick()
    const originalOutput = result.formattedContent.value

    articleStyleSettings.value = { ...articleStyleSettings.value, fontSize: 18 }
    await nextTick()
    vi.advanceTimersByTime(149)
    await nextTick()

    expect(result.formattedContent.value).toBe(originalOutput)

    vi.advanceTimersByTime(1)
    await nextTick()

    expect(result.formattedContent.value).toContain('font-size: 18px')

    await unmount()
  })
})
