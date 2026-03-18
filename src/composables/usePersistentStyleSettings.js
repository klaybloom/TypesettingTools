import { onMounted, ref, watch } from 'vue'

export function usePersistentStyleSettings(defaultSettings) {
  const styleSettings = ref({ ...defaultSettings })

  watch(styleSettings, (value) => {
    localStorage.setItem('styleSettings', JSON.stringify(value))
  }, { deep: true })

  onMounted(() => {
    const savedSettings = localStorage.getItem('styleSettings')
    if (!savedSettings) return

    try {
      const parsed = JSON.parse(savedSettings)
      styleSettings.value = { ...defaultSettings, ...parsed }
    } catch (_) {
      // Ignore corrupt persisted settings and fall back to defaults.
    }
  })

  return { styleSettings }
}
