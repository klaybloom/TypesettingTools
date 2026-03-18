export function useClipboardHtml() {
  async function copyHtmlToClipboard(html) {
    if (!html) return false

    try {
      const htmlBlob = new Blob([html], { type: 'text/html' })
      const textBlob = new Blob([html], { type: 'text/plain' })
      const clipboardItem = new ClipboardItem({
        'text/html': htmlBlob,
        'text/plain': textBlob
      })

      await navigator.clipboard.write([clipboardItem])
      return true
    } catch (_) {
      try {
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = html
        tempDiv.style.position = 'absolute'
        tempDiv.style.left = '-9999px'
        document.body.appendChild(tempDiv)

        const range = document.createRange()
        range.selectNodeContents(tempDiv)
        const selection = window.getSelection()
        selection.removeAllRanges()
        selection.addRange(range)

        document.execCommand('copy')

        selection.removeAllRanges()
        document.body.removeChild(tempDiv)
        return true
      } catch (_) {
        return false
      }
    }
  }

  return { copyHtmlToClipboard }
}
