<template>
  <div class="preview-wrapper" :class="mode">
    <div class="preview-device" v-if="mode === 'mobile'">
      <div class="device-frame">
        <div class="device-notch"></div>
        <div class="device-screen">
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
            class="preview-content wechat-style"
            v-html="content || emptyState"
          ></div>
        </div>
      </div>
    </div>
    
    <div v-else class="preview-desktop">
      <div 
        class="preview-content wechat-style"
        v-html="content || emptyState"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  content: {
    type: String,
    default: ''
  },
  mode: {
    type: String,
    default: 'mobile',
    validator: (v) => ['mobile', 'desktop'].includes(v)
  }
})

const emptyState = computed(() => `
  <div class="empty-preview">
    <svg viewBox="0 0 24 24" width="48" height="48">
      <path fill="currentColor" opacity="0.3" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H6v-2h6v2zm4-4H6v-2h10v2zm0-4H6V7h10v2z"/>
    </svg>
    <p>点击「一键排版」预览效果</p>
  </div>
`)
</script>

<style scoped>
.preview-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: var(--spacing-lg);
  background: var(--bg-secondary);
  overflow-y: auto;
}

/* 手机模拟器 */
.device-frame {
  width: 375px;
  background: #000;
  border-radius: 40px;
  padding: 12px;
  box-shadow: 
    0 0 0 2px #333,
    0 20px 50px rgba(0,0,0,0.3);
}

.device-notch {
  width: 150px;
  height: 28px;
  background: #000;
  border-radius: 0 0 20px 20px;
  margin: 0 auto 8px;
  position: relative;
}

.device-notch::after {
  content: '';
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 6px;
  background: #1a1a1a;
  border-radius: 3px;
}

.device-screen {
  background: #fff;
  border-radius: 28px;
  overflow: hidden;
  height: 600px;
  display: flex;
  flex-direction: column;
}

.wechat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #ededed;
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
  max-width: 680px;
  background: var(--bg-primary);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-xl);
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
