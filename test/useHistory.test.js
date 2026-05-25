import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { useHistory } from '../src/composables/useHistory.js'

describe('useHistory', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  function flush() {
    vi.advanceTimersByTime(600)
  }

  it('初始状态：canUndo=false / canRedo=false', () => {
    const h = useHistory('a')
    expect(h.canUndo.value).toBe(false)
    expect(h.canRedo.value).toBe(false)
    expect(h.getCurrentValue()).toBe('a')
  })

  it('push 后可 undo / redo', () => {
    const h = useHistory('a')
    h.pushHistory('b')
    flush()
    expect(h.canUndo.value).toBe(true)
    expect(h.undo()).toBe('a')
    expect(h.canRedo.value).toBe(true)
    expect(h.redo()).toBe('b')
  })

  it('重复值不会被记录，且不会清空 redo 栈', () => {
    const h = useHistory('a')
    h.pushHistory('b')
    flush()
    h.pushHistory('c')
    flush()
    // 现在历史是 [a, b, c]，回到 b
    expect(h.undo()).toBe('b')
    expect(h.canRedo.value).toBe(true)
    // 输入和当前值一样的内容 —— 不应清掉 redo 栈
    h.pushHistory('b')
    flush()
    expect(h.canRedo.value).toBe(true)
    expect(h.redo()).toBe('c')
  })

  it('输入新值时截断 future', () => {
    const h = useHistory('a')
    h.pushHistory('b')
    flush()
    h.pushHistory('c')
    flush()
    expect(h.undo()).toBe('b')
    expect(h.canRedo.value).toBe(true)
    // 在 b 的位置输入新内容 d，c 应被截掉
    h.pushHistory('d')
    flush()
    expect(h.canRedo.value).toBe(false)
    expect(h.undo()).toBe('b')
    expect(h.redo()).toBe('d')
  })

  it('debounce 期间反复 push 只留下最后一个', () => {
    const h = useHistory('a')
    h.pushHistory('a1')
    h.pushHistory('a12')
    h.pushHistory('a123')
    flush()
    expect(h.getCurrentValue()).toBe('a123')
    expect(h.undo()).toBe('a')
    expect(h.canRedo.value).toBe(true)
    expect(h.redo()).toBe('a123')
  })

  it('达到 maxHistory 时丢弃最旧记录', () => {
    const h = useHistory('v0', { maxHistory: 3, debounceTime: 1 })
    h.pushHistory('v1'); flush()
    h.pushHistory('v2'); flush()
    h.pushHistory('v3'); flush()
    // 期望保留 [v1, v2, v3]，currentIndex=2
    expect(h.getCurrentValue()).toBe('v3')
    expect(h.undo()).toBe('v2')
    expect(h.undo()).toBe('v1')
    expect(h.canUndo.value).toBe(false)
  })

  it('clear 重置历史', () => {
    const h = useHistory('a')
    h.pushHistory('b'); flush()
    h.clear()
    expect(h.canUndo.value).toBe(false)
    expect(h.canRedo.value).toBe(false)
    expect(h.getCurrentValue()).toBe('a')
  })
})
