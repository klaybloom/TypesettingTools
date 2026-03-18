import { computed, onUnmounted, ref, watch } from 'vue'
import { formatText, inlineStyles } from '../utils/formatter.js'

export function useRenderedDocument(articleStyleSettings) {
  const rawContent = ref('')
  const debouncedContent = ref('')
  const debouncedSettings = ref({ ...articleStyleSettings.value })

  let contentDebounceTimer = null
  let settingsDebounceTimer = null

  watch(rawContent, (newVal) => {
    clearTimeout(contentDebounceTimer)
    contentDebounceTimer = setTimeout(() => {
      debouncedContent.value = newVal
    }, 300)
  }, { immediate: true })

  watch(articleStyleSettings, (newVal) => {
    clearTimeout(settingsDebounceTimer)
    settingsDebounceTimer = setTimeout(() => {
      debouncedSettings.value = { ...newVal }
    }, 150)
  }, { deep: true, immediate: true })

  const formattedContent = computed(() => {
    if (!debouncedContent.value.trim()) return ''
    return inlineStyles(formatText(debouncedContent.value, debouncedSettings.value))
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
    charCount,
    readingTime
  }
}
