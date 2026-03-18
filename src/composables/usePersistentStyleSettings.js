import { onMounted, ref, watch } from 'vue'

export function usePersistentStyleSettings(defaultArticleStyleSettings) {
  const articleStyleSettings = ref({ ...defaultArticleStyleSettings })

  watch(articleStyleSettings, (value) => {
    localStorage.setItem('styleSettings', JSON.stringify(value))
  }, { deep: true })

  onMounted(() => {
    const savedSettings = localStorage.getItem('styleSettings')
    if (!savedSettings) return

    try {
      const parsed = JSON.parse(savedSettings)
      articleStyleSettings.value = { ...defaultArticleStyleSettings, ...parsed }
    } catch (_) {
      // Ignore corrupt persisted settings and fall back to defaults.
    }
  })

  return { articleStyleSettings }
}
