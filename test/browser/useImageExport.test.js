import { afterEach, describe, expect, it, vi } from 'vitest'
import { useImageExport } from '../../src/composables/useImageExport.js'

const { html2canvasMock } = vi.hoisted(() => ({
  html2canvasMock: vi.fn()
}))

vi.mock('html2canvas', () => ({
  default: html2canvasMock
}))

describe('useImageExport', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    html2canvasMock.mockReset()
  })

  it('exports an element as an image', async () => {
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    const canvas = {
      toDataURL: vi.fn().mockReturnValue('data:image/png;base64,abc')
    }
    const element = document.createElement('div')
    Object.defineProperty(element, 'scrollHeight', {
      value: 320,
      configurable: true
    })
    html2canvasMock.mockResolvedValue(canvas)

    const { isExporting, exportElementAsImage } = useImageExport()
    const result = await exportElementAsImage(element)

    expect(result).toEqual({
      ok: true,
      message: '图片已导出成功'
    })
    expect(isExporting.value).toBe(false)
    expect(html2canvasMock).toHaveBeenCalledWith(element, expect.objectContaining({
      backgroundColor: '#ffffff',
      scale: 2,
      windowHeight: 320
    }))
    expect(clickSpy).toHaveBeenCalledTimes(1)
  })

  it('returns an error when no export target is provided', async () => {
    const { exportElementAsImage } = useImageExport()

    await expect(exportElementAsImage(null)).resolves.toEqual({
      ok: false,
      message: '导出失败：无法获取导出区域'
    })
  })

  it('maps html2canvas failures to user-facing messages', async () => {
    html2canvasMock.mockRejectedValue(new Error('canvas failed'))
    const element = document.createElement('div')
    Object.defineProperty(element, 'scrollHeight', {
      value: 100,
      configurable: true
    })

    const { exportElementAsImage } = useImageExport()
    const result = await exportElementAsImage(element)

    expect(result).toEqual({
      ok: false,
      message: '导出失败：Canvas 渲染错误，请尝试缩小内容'
    })
  })
})
