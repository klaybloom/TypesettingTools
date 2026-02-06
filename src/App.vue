<template>
  <div class="app-container" :data-theme="theme" @click="handleGlobalClick">
    <!-- 顶部导航栏 -->
    <header class="app-header">
      <div class="header-brand">
        <svg class="logo-icon" viewBox="0 0 24 24" width="22" height="22">
          <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H6v-2h6v2zm4-4H6v-2h10v2zm0-4H6V7h10v2z"/>
        </svg>
        <h1 class="app-title">TypeSetting</h1>
      </div>
      
      <div class="header-actions">
        <button 
          class="action-btn" 
          @click.stop="showStylePanel = !showStylePanel"
          :class="{ active: showStylePanel }"
        >
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/>
          </svg>
          样式
        </button>

        <button 
          class="action-btn primary" 
          @click="copyHtml"
          :disabled="!formattedContent"
        >
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
          </svg>
          {{ copySuccess ? '已复制' : '复制' }}
        </button>
        
        <button class="icon-btn" @click="toggleTheme" :title="theme === 'dark' ? '浅色' : '深色'">
          <svg v-if="theme === 'dark'" viewBox="0 0 24 24" width="18" height="18">
            <path fill="currentColor" d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1z"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" width="18" height="18">
            <path fill="currentColor" d="M9.37 5.51A7.35 7.35 0 009.1 7.5c0 4.08 3.32 7.4 7.4 7.4.68 0 1.35-.09 1.99-.27A7.014 7.014 0 0112 19c-3.86 0-7-3.14-7-7 0-2.93 1.81-5.45 4.37-6.49zM12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 01-4.4 2.26 5.403 5.403 0 01-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/>
          </svg>
        </button>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="app-main">
      <!-- 左侧编辑器 -->
      <section class="editor-section">
        <div class="section-header">
          <span class="section-title">输入</span>
          <span class="char-count">{{ charCount }}字</span>
        </div>
        <Editor 
          v-model="rawContent" 
          placeholder="粘贴文章内容，支持 Markdown..."
        />
      </section>

      <!-- 右侧预览 -->
      <section class="preview-section">
        <div class="section-header">
          <span class="section-title">预览</span>
          <div class="preview-controls">
            <button 
              class="mode-btn"
              :class="{ active: previewMode === 'desktop' }"
              @click="previewMode = 'desktop'"
            >桌面</button>
            <button 
              class="mode-btn"
              :class="{ active: previewMode === 'mobile' }"
              @click="previewMode = 'mobile'"
            >手机</button>
          </div>
        </div>
        <Preview 
          :content="formattedContent" 
          :mode="previewMode"
        />
      </section>
    </main>

    <!-- 样式控制面板 -->
    <StylePanel 
      v-model:settings="styleSettings"
      :visible="showStylePanel"
      @toggle="showStylePanel = !showStylePanel"
      @click.stop
    />

    <!-- Toast 提示 -->
    <Transition name="toast">
      <div v-if="toast.show" class="toast" :class="toast.type">
        {{ toast.message }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import Editor from './components/Editor.vue'
import Preview from './components/Preview.vue'
import StylePanel from './components/StylePanel.vue'
import { formatText, inlineStyles } from './utils/formatter.js'

// 主题状态
const theme = ref('light')

// 内容状态
const rawContent = ref('')

// UI 状态
const previewMode = ref('mobile')
const showStylePanel = ref(false)
const copySuccess = ref(false)
const toast = ref({ show: false, message: '', type: 'success' })

// 样式设置
const styleSettings = ref({
  fontSize: 15,
  lineHeight: 1.75,
  letterSpacing: 0.5,
  textColor: '#262626',
  accentColor: '#10a37f',
  paragraphMargin: 15
})

// 计算属性 - 自动排版：内容或样式变化时自动更新
const formattedContent = computed(() => {
  if (!rawContent.value.trim()) return ''
  return inlineStyles(formatText(rawContent.value, styleSettings.value))
})

const hasContent = computed(() => rawContent.value.trim().length > 0)
const charCount = computed(() => rawContent.value.replace(/\s/g, '').length)

// 方法
function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  localStorage.setItem('theme', theme.value)
}

async function copyHtml() {
  if (!formattedContent.value) return
  
  try {
    // 使用 ClipboardItem API 复制富文本，保留格式
    const htmlBlob = new Blob([formattedContent.value], { type: 'text/html' })
    const textBlob = new Blob([formattedContent.value], { type: 'text/plain' })
    
    const clipboardItem = new ClipboardItem({
      'text/html': htmlBlob,
      'text/plain': textBlob
    })
    
    await navigator.clipboard.write([clipboardItem])
    copySuccess.value = true
    showToast('已复制！可直接粘贴到公众号', 'success')
    setTimeout(() => copySuccess.value = false, 2000)
  } catch (err) {
    // 降级方案：如果 ClipboardItem 不支持，使用传统方式
    try {
      // 创建一个临时的富文本容器
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = formattedContent.value
      tempDiv.style.position = 'absolute'
      tempDiv.style.left = '-9999px'
      document.body.appendChild(tempDiv)
      
      // 选中并复制
      const range = document.createRange()
      range.selectNodeContents(tempDiv)
      const selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)
      
      document.execCommand('copy')
      
      selection.removeAllRanges()
      document.body.removeChild(tempDiv)
      
      copySuccess.value = true
      showToast('已复制！可直接粘贴到公众号', 'success')
      setTimeout(() => copySuccess.value = false, 2000)
    } catch (fallbackErr) {
      showToast('复制失败，请手动复制', 'error')
    }
  }
}

function showToast(message, type = 'success') {
  toast.value = { show: true, message, type }
  setTimeout(() => toast.value.show = false, 2500)
}

// 点击空白处关闭样式面板
function handleGlobalClick(e) {
  // 如果点击的不是样式面板内部，关闭面板
  if (showStylePanel.value && !e.target.closest('.style-panel')) {
    showStylePanel.value = false
  }
}

// 初始化
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    theme.value = savedTheme
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    theme.value = 'light'
  }
})
</script>

<style>
/* App 布局样式 */
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
}

/* 顶部导航 */
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 20px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-icon {
  color: var(--text-secondary);
}

.app-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 按钮样式 - 黑白灰配色 */
.action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  transition: all 0.15s;
}

.action-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.action-btn.active {
  background: var(--text-primary);
  color: var(--bg-primary);
}

.action-btn.primary {
  background: var(--text-primary);
  color: var(--bg-primary);
}

.action-btn.primary:hover:not(:disabled) {
  opacity: 0.85;
}

.action-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  color: var(--text-tertiary);
  transition: all 0.15s;
}

.icon-btn:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

/* 主内容区 */
.app-main {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  background: var(--border-color);
  overflow: hidden;
}

.editor-section,
.preview-section {
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  overflow: hidden;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  border-bottom: 1px solid var(--border-subtle);
  background: var(--bg-secondary);
}

.section-title {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-tertiary);
}

.char-count {
  font-size: 11px;
  color: var(--text-tertiary);
}

.preview-controls {
  display: flex;
  gap: 2px;
}

.mode-btn {
  padding: 3px 8px;
  font-size: 11px;
  color: var(--text-tertiary);
  border-radius: 4px;
  transition: all 0.15s;
}

.mode-btn.active {
  background: var(--text-primary);
  color: var(--bg-primary);
}

/* Toast 提示 */
.toast {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 16px;
  background: var(--text-primary);
  color: var(--bg-primary);
  border-radius: 6px;
  font-size: 13px;
  z-index: 1000;
}

.toast.error {
  background: #dc3545;
  color: white;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.2s;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}

@media (max-width: 1024px) {
  .app-main {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
}
</style>
