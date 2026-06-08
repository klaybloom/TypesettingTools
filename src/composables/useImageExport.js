import { ref } from 'vue'

export function useImageExport() {
  const isExporting = ref(false)

  async function exportElementAsImage(element, fileNamePrefix = 'typesetting') {
    if (!element) {
      return {
        ok: false,
        message: '导出失败：无法获取导出区域'
      }
    }

    if (isExporting.value) {
      return {
        ok: false,
        message: '正在导出中，请稍候...'
      }
    }

    isExporting.value = true

    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false,
        windowHeight: element.scrollHeight
      })

      const link = document.createElement('a')
      link.download = `${fileNamePrefix}-${Date.now()}.png`
      link.href = canvas.toDataURL('image/png')
      // Firefox 要求 link 在 document 树内才能触发下载
      document.body.appendChild(link)
      link.click()
      link.remove()

      return {
        ok: true,
        message: '图片已导出成功'
      }
    } catch (error) {
      let message = '导出失败'
      if (error.message.includes('canvas')) {
        message = '导出失败：Canvas 渲染错误，请尝试缩小内容'
      } else if (error.message.includes('memory')) {
        message = '导出失败：内存不足，请尝试缩小内容或降低图片质量'
      } else if (error.message) {
        message = `导出失败：${error.message}`
      }

      return {
        ok: false,
        message
      }
    } finally {
      isExporting.value = false
    }
  }

  return {
    isExporting,
    exportElementAsImage
  }
}

/**
 * 把元素渲染为 canvas（不下载）。供卡片单张/批量导出与复制复用。
 * scale 默认 3 → 360×480 卡片输出约 1080×1440。
 */
export async function renderElementToCanvas(element, scale = 3) {
  const html2canvas = (await import('html2canvas')).default
  return html2canvas(element, {
    backgroundColor: null,
    scale,
    useCORS: true,
    logging: false
  })
}

export function downloadCanvas(canvas, fileName) {
  const link = document.createElement('a')
  link.download = fileName
  link.href = canvas.toDataURL('image/png')
  document.body.appendChild(link)
  link.click()
  link.remove()
}

export function canvasToBlob(canvas) {
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
}
