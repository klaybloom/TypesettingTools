import { onMounted, ref, watch } from 'vue'
import { defaultCardSettings } from '../utils/config.js'

export function useCardSettings() {
  const cardSettings = ref({ ...defaultCardSettings })

  watch(cardSettings, (value) => {
    localStorage.setItem('cardSettings', JSON.stringify(value))
  }, { deep: true })

  onMounted(() => {
    const saved = localStorage.getItem('cardSettings')
    if (!saved) return
    try {
      cardSettings.value = { ...defaultCardSettings, ...JSON.parse(saved) }
    } catch (_) {
      // 忽略损坏的持久化数据
    }
  })

  return { cardSettings }
}
