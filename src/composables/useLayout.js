import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

export const LAYOUT_MODES = ['single', 'split']

const LAYOUT_KEY = 'layoutMode'
const RATIO_KEY = 'splitRatio'
const DEFAULT_LAYOUT = 'split'
const DEFAULT_RATIO = 0.5
const MIN_RATIO = 0.25
const MAX_RATIO = 0.75
const NARROW_QUERY = '(max-width: 1024px)'

const clampRatio = (r) => Math.min(MAX_RATIO, Math.max(MIN_RATIO, r))

export function useLayout() {
  const layoutMode = ref(DEFAULT_LAYOUT)
  const splitRatio = ref(DEFAULT_RATIO)
  const isNarrow = ref(false)

  // 窄屏强制单栏；宽屏才尊重用户偏好
  const effectiveLayout = computed(() => (isNarrow.value ? 'single' : layoutMode.value))

  function setLayout(mode) {
    if (LAYOUT_MODES.includes(mode)) layoutMode.value = mode
  }

  function toggleLayout() {
    layoutMode.value = layoutMode.value === 'split' ? 'single' : 'split'
  }

  watch(layoutMode, (value) => {
    localStorage.setItem(LAYOUT_KEY, value)
  })
  watch(splitRatio, (value) => {
    localStorage.setItem(RATIO_KEY, String(value))
  })

  // 拖拽分隔线：按 .app-main 容器宽度换算左栏占比
  function startResize(event) {
    event.preventDefault()
    const main = event.currentTarget.closest('.app-main')
    if (!main) return

    const onMove = (e) => {
      const rect = main.getBoundingClientRect()
      if (rect.width <= 0) return
      splitRatio.value = clampRatio((e.clientX - rect.left) / rect.width)
    }
    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      document.body.classList.remove('resizing-cols')
    }

    document.body.classList.add('resizing-cols')
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  let mql = null
  const onNarrowChange = (e) => { isNarrow.value = e.matches }

  onMounted(() => {
    const savedLayout = localStorage.getItem(LAYOUT_KEY)
    if (savedLayout && LAYOUT_MODES.includes(savedLayout)) layoutMode.value = savedLayout

    const savedRatio = parseFloat(localStorage.getItem(RATIO_KEY))
    if (!Number.isNaN(savedRatio)) splitRatio.value = clampRatio(savedRatio)

    mql = window.matchMedia(NARROW_QUERY)
    isNarrow.value = mql.matches
    mql.addEventListener('change', onNarrowChange)
  })

  onUnmounted(() => {
    if (mql) mql.removeEventListener('change', onNarrowChange)
  })

  return { layoutMode, effectiveLayout, isNarrow, splitRatio, setLayout, toggleLayout, startResize }
}
