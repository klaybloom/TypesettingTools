/**
 * 撤销/重做历史管理 Composable
 * 用于编辑器内容的历史记录管理
 */
import { ref, watch } from 'vue'

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
      // 如果当前不在历史记录末尾，删除后面的记录
      if (currentIndex.value < history.value.length - 1) {
        history.value = history.value.slice(0, currentIndex.value + 1)
      }

      // 避免重复记录相同内容
      if (history.value[currentIndex.value] === value) {
        return
      }

      // 添加新记录
      history.value.push(value)
      currentIndex.value++

      // 限制历史记录数量
      if (history.value.length > maxHistory) {
        history.value.shift()
        currentIndex.value--
      }
    }, debounceTime)
  }

  /**
   * 撤销
   */
  function undo() {
    if (canUndo.value) {
      currentIndex.value--
      return history.value[currentIndex.value]
    }
    return null
  }

  /**
   * 重做
   */
  function redo() {
    if (canRedo.value) {
      currentIndex.value++
      return history.value[currentIndex.value]
    }
    return null
  }

  /**
   * 是否可以撤销
   */
  const canUndo = ref(false)
  watch(currentIndex, (val) => {
    canUndo.value = val > 0
  }, { immediate: true })

  /**
   * 是否可以重做
   */
  const canRedo = ref(false)
  watch([currentIndex, history], ([idx, hist]) => {
    canRedo.value = idx < hist.length - 1
  }, { immediate: true, deep: true })

  /**
   * 清空历史记录
   */
  function clear() {
    history.value = [initialValue]
    currentIndex.value = 0
  }

  /**
   * 获取当前值
   */
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
