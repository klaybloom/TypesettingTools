/**
 * 撤销/重做历史管理 Composable
 * 用于编辑器内容的历史记录管理
 */
import { computed, ref } from 'vue'

export function useHistory(initialValue = '', options = {}) {
  const {
    maxHistory = 100,
    debounceTime = 500
  } = options

  const history = ref([initialValue])
  const currentIndex = ref(0)
  let debounceTimer = null

  /**
   * 添加历史记录（带防抖）
   */
  function pushHistory(value) {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      // 与当前 head 重复 → 直接丢弃，保留已有 redo 栈
      if (history.value[currentIndex.value] === value) return

      // 截断 future（注意：必须在 dedup 之后，否则会无谓清掉 redo 栈）
      if (currentIndex.value < history.value.length - 1) {
        history.value = history.value.slice(0, currentIndex.value + 1)
      }

      history.value.push(value)
      currentIndex.value++

      // 限制历史记录数量
      if (history.value.length > maxHistory) {
        history.value.shift()
        currentIndex.value--
      }
    }, debounceTime)
  }

  function undo() {
    if (!canUndo.value) return null
    // 撤销前如果还有待提交的 push，要先放弃，避免回写时被记录
    clearTimeout(debounceTimer)
    currentIndex.value--
    return history.value[currentIndex.value]
  }

  function redo() {
    if (!canRedo.value) return null
    clearTimeout(debounceTimer)
    currentIndex.value++
    return history.value[currentIndex.value]
  }

  const canUndo = computed(() => currentIndex.value > 0)
  const canRedo = computed(() => currentIndex.value < history.value.length - 1)

  function clear() {
    clearTimeout(debounceTimer)
    history.value = [initialValue]
    currentIndex.value = 0
  }

  function getCurrentValue() {
    return history.value[currentIndex.value]
  }

  return {
    pushHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    clear,
    getCurrentValue
  }
}
