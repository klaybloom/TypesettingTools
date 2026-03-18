import { afterEach, describe, expect, it, vi } from 'vitest'
import { useClipboardHtml } from '../../src/composables/useClipboardHtml.js'

describe('useClipboardHtml', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    document.body.innerHTML = ''
  })

  it('copies rich html through the Clipboard API when available', async () => {
    const writeMock = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('ClipboardItem', vi.fn((items) => items))
    vi.stubGlobal('navigator', {
      clipboard: {
        write: writeMock
      }
    })

    const { copyHtmlToClipboard } = useClipboardHtml()
    const copied = await copyHtmlToClipboard('<p>hello</p>')

    expect(copied).toBe(true)
    expect(writeMock).toHaveBeenCalledTimes(1)
  })

  it('falls back to execCommand when Clipboard API fails', async () => {
    const writeMock = vi.fn().mockRejectedValue(new Error('unsupported'))
    const execCommandMock = vi.fn().mockReturnValue(true)
    Object.defineProperty(document, 'execCommand', {
      value: execCommandMock,
      configurable: true
    })
    vi.stubGlobal('ClipboardItem', vi.fn((items) => items))
    vi.stubGlobal('navigator', {
      clipboard: {
        write: writeMock
      }
    })

    const { copyHtmlToClipboard } = useClipboardHtml()
    const copied = await copyHtmlToClipboard('<p>fallback</p>')

    expect(copied).toBe(true)
    expect(execCommandMock).toHaveBeenCalledWith('copy')
  })

  it('returns false when both Clipboard API and fallback fail', async () => {
    const writeMock = vi.fn().mockRejectedValue(new Error('unsupported'))
    vi.stubGlobal('ClipboardItem', vi.fn((items) => items))
    vi.stubGlobal('navigator', {
      clipboard: {
        write: writeMock
      }
    })
    vi.spyOn(document, 'createRange').mockImplementation(() => {
      throw new Error('range failure')
    })

    const { copyHtmlToClipboard } = useClipboardHtml()
    const copied = await copyHtmlToClipboard('<p>broken</p>')

    expect(copied).toBe(false)
  })
})
