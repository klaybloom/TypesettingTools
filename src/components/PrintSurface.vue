<template>
  <div class="print-surface" aria-hidden="true">
    <div class="print-content" :class="{ 'md-native': native }" v-html="content"></div>
  </div>
</template>

<script setup>
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
</script>

<style scoped>
.print-surface {
  display: none;
}
</style>
