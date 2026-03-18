import { afterEach, describe, expect, it, vi } from 'vitest'
import { useToast } from '../../src/composables/useToast.js'
import { mountComposable } from './mountComposable.js'

describe('useToast', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows and auto-hides toast state', async () => {
    vi.useFakeTimers()
    const { result, unmount } = await mountComposable(() => useToast())

    result.showToast('保存成功', 'success')

    expect(result.toast.value).toEqual({
      show: true,
      message: '保存成功',
      type: 'success'
    })

    vi.advanceTimersByTime(2500)

    expect(result.toast.value.show).toBe(false)

    await unmount()
  })
})
