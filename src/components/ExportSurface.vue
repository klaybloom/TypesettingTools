<template>
  <div class="export-surface" aria-hidden="true">
    <div
      ref="exportContentRef"
      class="export-content"
      :class="{ 'md-native': native }"
      :style="{ width: native ? '720px' : '375px' }"
      v-html="content"
    ></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  content: {
    type: String,
    default: ''
  },
  native: {
    type: Boolean,
    default: false
  }
})

const exportContentRef = ref(null)

defineExpose({ exportContentRef })
</script>

<style scoped>
.export-surface {
  position: fixed;
  left: -100000px;
  top: 0;
  pointer-events: none;
  background: #ffffff;
}

.export-content {
  padding: 24px 20px;
  background: #ffffff;
}
</style>
