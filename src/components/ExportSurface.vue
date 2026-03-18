<template>
  <div class="export-surface" aria-hidden="true">
    <div ref="exportContentRef" class="export-content" v-html="content"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  content: {
    type: String,
    default: ''
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
  width: 407px;
  pointer-events: none;
  background: #ffffff;
}

.export-content {
  width: 375px;
  padding: 20px 16px;
  background: #ffffff;
}
</style>
