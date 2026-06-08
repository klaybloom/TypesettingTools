<template>
  <div class="native-preview">
    <div
      ref="scrollRef"
      class="native-scroll"
      @scroll="handleScroll"
    >
      <div v-if="!content" class="empty-preview">
        <svg viewBox="0 0 24 24" width="48" height="48">
          <path fill="currentColor" opacity="0.3" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H6v-2h6v2zm4-4H6v-2h10v2zm0-4H6V7h10v2z"/>
        </svg>
        <p>在左侧输入 Markdown 即可实时预览</p>
      </div>
      <div v-else class="md-native" v-html="content"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  content: { type: String, default: '' },
  scrollRatio: { type: Number, default: 0 }
})

const emit = defineEmits(['scroll'])
const scrollRef = ref(null)
const syncingFromExternal = ref(false)

watch(() => props.scrollRatio, (ratio) => {
  const el = scrollRef.value
  if (!el) return
  const maxScroll = el.scrollHeight - el.clientHeight
  if (maxScroll <= 0) return
  const target = ratio * maxScroll
  if (Math.abs(el.scrollTop - target) < 1) return
  syncingFromExternal.value = true
  el.scrollTop = target
  requestAnimationFrame(() => { syncingFromExternal.value = false })
}, { immediate: true })

function handleScroll(e) {
  if (syncingFromExternal.value) return
  const el = e.target
  const maxScroll = el.scrollHeight - el.clientHeight
  const ratio = maxScroll > 0 ? el.scrollTop / maxScroll : 0
  emit('scroll', ratio)
}
</script>

<style scoped>
.native-preview {
  flex: 1;
  overflow: hidden;
  display: flex;
  justify-content: center;
  background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0));
}

.native-scroll {
  width: 100%;
  max-width: 760px;
  overflow-y: auto;
  padding: 32px 40px;
}

.empty-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-tertiary);
  text-align: center;
}

.empty-preview svg { margin-bottom: var(--spacing-md); }
.empty-preview p { font-size: 0.875rem; }
</style>
