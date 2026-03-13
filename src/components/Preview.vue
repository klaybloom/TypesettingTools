<template>
  <div class="preview-wrapper" :class="mode">
    <div class="preview-device" v-if="mode === 'mobile'">
      <div class="device-frame">
        <div class="device-screen">
          <div class="device-statusbar">
            <div class="device-notch"></div>
          </div>
          <div class="wechat-header">
            <svg viewBox="0 0 24 24" width="18" height="18" class="back-icon">
              <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
            <span>公众号文章</span>
            <div class="wechat-dots">
              <span></span><span></span><span></span>
            </div>
          </div>
          <div 
            ref="previewContentRef"
            class="preview-content wechat-style"
            @scroll="handleScroll"
            v-html="content || emptyState"
          ></div>
        </div>
      </div>
    </div>
    
    <div v-else class="preview-desktop">
      <div 
        ref="previewContentRef"
        class="preview-content wechat-style"
        @scroll="handleScroll"
        v-html="content || emptyState"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  content: {
    type: String,
    default: ''
  },
  mode: {
    type: String,
    default: 'mobile',
    validator: (v) => ['mobile', 'desktop'].includes(v)
  },
  scrollRatio: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['scroll'])
const previewContentRef = ref(null)
const syncingFromExternal = ref(false)

// Sync scroll from editor (re-apply when mode switches)
watch(() => [props.scrollRatio, props.mode], ([ratio]) => {
  const el = previewContentRef.value
  if (!el) return
  const maxScroll = el.scrollHeight - el.clientHeight
  if (maxScroll <= 0) return
  const target = ratio * maxScroll
  if (Math.abs(el.scrollTop - target) < 1) return
  syncingFromExternal.value = true
  el.scrollTop = target
  requestAnimationFrame(() => {
    syncingFromExternal.value = false
  })
}, { immediate: true })

function handleScroll(e) {
  if (syncingFromExternal.value) return
  const el = e.target
  const maxScroll = el.scrollHeight - el.clientHeight
  const ratio = maxScroll > 0 ? el.scrollTop / maxScroll : 0
  emit('scroll', ratio)
}

// Expose ref for parent (e.g., export image)
defineExpose({ previewContentRef })

const emptyState = computed(() => `
  <div class="empty-preview">
    <svg viewBox="0 0 24 24" width="48" height="48">
      <path fill="currentColor" opacity="0.3" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H6v-2h6v2zm4-4H6v-2h10v2zm0-4H6V7h10v2z"/>
    </svg>
    <p>在左侧输入 Markdown 即可实时预览</p>
  </div>
`)
</script>

<style scoped>
.preview-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 10px;
  background: var(--bg-secondary);
  overflow: hidden;
}

.preview-device {
  display: flex;
  justify-content: center;
}

/* 手机模拟器 */
.device-frame {
  width: 332px;
  height: 676px;
  position: relative;
  overflow: hidden;
  border-radius: 42px;
  background: linear-gradient(180deg, #1b1c20 0%, #060607 100%);
  box-shadow:
    0 16px 40px rgba(46, 52, 66, 0.16),
    inset 0 1px 0 rgba(255,255,255,0.08);
}

.device-frame::before {
  content: '';
  position: absolute;
  inset: 1px;
  border-radius: 41px;
  border: 1px solid rgba(255,255,255,0.05);
  pointer-events: none;
}

.device-notch {
  width: 110px;
  height: 25px;
  margin: 6px auto 0;
  position: relative;
  background: #050505;
  border-radius: 999px;
}

.device-notch::after {
  content: '';
  position: absolute;
  top: 8px;
  right: 15px;
  width: 8px;
  height: 8px;
  background: radial-gradient(circle at 35% 35%, #454545 0%, #1a1a1a 55%, #090909 100%);
  border-radius: 50%;
}

.device-notch::before {
  content: '';
  position: absolute;
  top: 10px;
  left: 18px;
  width: 54px;
  height: 4px;
  background: rgba(255,255,255,0.05);
  border-radius: 999px;
}

.device-screen {
  position: absolute;
  inset: 7px 7px 8px;
  background: #ffffff;
  border-radius: 36px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.device-statusbar {
  flex-shrink: 0;
  height: 34px;
  background: #f2f2f4;
}

.wechat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px 12px;
  background: #f2f2f4;
  font-size: 16px;
  font-weight: 500;
  color: #000;
}

.back-icon {
  color: #000;
}

.wechat-dots {
  display: flex;
  gap: 3px;
}

.wechat-dots span {
  width: 5px;
  height: 5px;
  background: #000;
  border-radius: 50%;
}

/* 预览内容区域 */
.preview-content {
  flex: 1;
  padding: 20px 16px;
  overflow-y: auto;
  color: #3f3f3f;
  font-size: 15px;
  line-height: 1.75;
}

/* 桌面端预览 */
.preview-desktop {
  width: 100%;
  height: 100%;
  max-width: 680px;
  display: flex;
  overflow: hidden;
  background: var(--bg-primary);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-lg);
}

/* 微信公众号样式 */
.wechat-style :deep(h1) {
  font-size: 22px;
  font-weight: 700;
  color: #3f3f3f;
  margin-bottom: 24px;
  line-height: 1.4;
}

.wechat-style :deep(h2) {
  font-size: 18px;
  font-weight: 600;
  color: #262626;
  margin: 20px 0 12px;
  padding-left: 10px;
  border-left: 3px solid #10a37f;
}

.wechat-style :deep(p) {
  margin-bottom: 15px;
  text-align: justify;
  letter-spacing: 0.5px;
}

.wechat-style :deep(strong) {
  color: #10a37f;
  font-weight: 600;
}

.wechat-style :deep(blockquote) {
  background: #f5f5f5;
  border-left: 3px solid #10a37f;
  padding: 12px 16px;
  margin: 16px 0;
  color: #595959;
  font-size: 14px;
}

.wechat-style :deep(ul),
.wechat-style :deep(ol) {
  margin: 12px 0;
  padding-left: 24px;
}

.wechat-style :deep(li) {
  margin-bottom: 8px;
}

/* 空状态 */
.empty-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-tertiary);
  text-align: center;
}

.empty-preview svg {
  margin-bottom: var(--spacing-md);
}

.empty-preview p {
  font-size: 0.875rem;
}
</style>
