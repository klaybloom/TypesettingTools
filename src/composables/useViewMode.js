import { onMounted, ref, watch } from 'vue'

export const VIEW_MODES = ['edit', 'preview', 'wechat', 'xhs']

const STORAGE_KEY = 'viewMode'
const DEFAULT_MODE = 'preview'

export function useViewMode() {
  const viewMode = ref(DEFAULT_MODE)

  function setViewMode(mode) {
    if (VIEW_MODES.includes(mode)) viewMode.value = mode
  }

  watch(viewMode, (value) => {
    localStorage.setItem(STORAGE_KEY, value)
  })

  onMounted(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    // 旧版本曾有独立的 'edit' 模式，已并入左侧常驻编辑器 → 回退到预览
    if (saved && VIEW_MODES.includes(saved)) viewMode.value = saved
  })

  return { viewMode, setViewMode, VIEW_MODES }
}
