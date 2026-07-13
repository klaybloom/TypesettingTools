import { computed, onUnmounted, ref, watch } from 'vue'
import { formatText, renderPlain } from '../utils/formatter.js'
import DEFAULT_MARKDOWN_SAMPLE from '../../README.md?raw'

export function useRenderedDocument(articleStyleSettings) {
  const rawContent = ref(DEFAULT_MARKDOWN_SAMPLE)
  // 首屏直接同步赋值，避免被 debounce 拖出 300ms 空白
  const debouncedContent = ref(rawContent.value)
  const debouncedSettings = ref({ ...articleStyleSettings.value })

  let contentDebounceTimer = null
  let settingsDebounceTimer = null

  watch(rawContent, (newVal) => {
    clearTimeout(contentDebounceTimer)
    contentDebounceTimer = setTimeout(() => {
      debouncedContent.value = newVal
    }, 300)
  })

  watch(articleStyleSettings, (newVal) => {
    clearTimeout(settingsDebounceTimer)
    settingsDebounceTimer = setTimeout(() => {
      debouncedSettings.value = { ...newVal }
    }, 150)
  }, { deep: true })

  const formattedContent = computed(() => {
    if (!debouncedContent.value.trim()) return ''
    return formatText(debouncedContent.value, debouncedSettings.value, debouncedSettings.value.wechatTemplateId)
  })

  const nativeContent = computed(() => {
    if (!debouncedContent.value.trim()) return ''
    return renderPlain(debouncedContent.value)
  })

  const charCount = computed(() => rawContent.value.replace(/\s/g, '').length)

  const readingTime = computed(() => {
    const chars = charCount.value
    if (chars === 0) return 0
    return Math.ceil(chars / 400)
  })

  onUnmounted(() => {
    clearTimeout(contentDebounceTimer)
    clearTimeout(settingsDebounceTimer)
  })

  return {
    rawContent,
    formattedContent,
    nativeContent,
    charCount,
    readingTime,
    defaultMarkdownSample: DEFAULT_MARKDOWN_SAMPLE
  }
}
