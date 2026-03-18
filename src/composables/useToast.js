import { onUnmounted, ref } from 'vue'

export function useToast() {
  const toast = ref({ show: false, message: '', type: 'success' })
  let hideTimer = null

  function showToast(message, type = 'success') {
    clearTimeout(hideTimer)
    toast.value = { show: true, message, type }
    hideTimer = setTimeout(() => {
      toast.value.show = false
    }, 2500)
  }

  onUnmounted(() => {
    clearTimeout(hideTimer)
  })

  return {
    toast,
    showToast
  }
}
