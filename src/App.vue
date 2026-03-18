<template>
  <div class="app-container" :data-theme="theme" :data-mode="colorMode">
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

        <button
          class="action-btn"
          @click="exportImage"
          :disabled="!formattedContent || isExporting"
        >
          <svg v-if="!isExporting" viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" d="M19 19H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" width="16" height="16" class="spinning">
            <path fill="currentColor" d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8Z"/>
          </svg>
          {{ isExporting ? '导出中...' : '导出图片' }}
        </button>

        <div class="stats-display">
          <span class="stat-item">{{ charCount }} 字</span>
          <span class="stat-divider">·</span>
          <span class="stat-item">{{ readingTime }} 分钟</span>
        </div>

        <div class="theme-dropdown" @click.stop>
          <button class="icon-btn" @click="toggleThemeMenu" :title="'当前风格: ' + themeName">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path fill="currentColor" d="M12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 01-4.4 2.26 5.403 5.403 0 01-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/>
            </svg>
          </button>
          
          <Transition name="pop">
            <div class="theme-menu dropdown-menu" v-show="showThemeMenu">
              <div class="menu-group-title">外观模式</div>
              <button @click="setColorMode('light')" :class="{ active: colorMode === 'light' }">
                <span class="menu-icon">☀️</span> 浅色模式
              </button>
              <button @click="setColorMode('dark')" :class="{ active: colorMode === 'dark' }">
                <span class="menu-icon">🌒</span> 深色模式
              </button>
              
              <div class="menu-divider"></div>
              
              <div class="menu-group-title">主题风格</div>
              <button @click="changeTheme('default')" :class="{ active: theme === 'default' }"><span class="menu-icon">🎨</span> 默认配色</button>
              <button @click="changeTheme('notion')" :class="{ active: theme === 'notion' }"><span class="menu-icon">📝</span> 象牙暖</button>
              <button @click="changeTheme('vercel')" :class="{ active: theme === 'vercel' }"><span class="menu-icon">⬛</span> 极简灰</button>
              <button @click="changeTheme('linear')" :class="{ active: theme === 'linear' }"><span class="menu-icon">🌌</span> 极光紫</button>
              <button @click="changeTheme('macaron')" :class="{ active: theme === 'macaron' }"><span class="menu-icon">🍬</span> 马卡龙</button>
              <div class="menu-divider"></div>
              
              <div class="menu-group-title">撞色 & 炫光</div>
              <button @click="changeTheme('cyberpunk')" :class="{ active: theme === 'cyberpunk' }"><span class="menu-icon">🦿</span> 赛博朋克</button>
              <button @click="changeTheme('retro')" :class="{ active: theme === 'retro' }"><span class="menu-icon">📼</span> 迈阿密复古</button>
              <button @click="changeTheme('neon')" :class="{ active: theme === 'neon' }"><span class="menu-icon">⚡</span> 霓虹青紫</button>
            </div>
          </Transition>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="app-main">
      <!-- 左侧编辑器 -->
      <section class="editor-section">
        <Editor 
          v-model="rawContent" 
          :char-count="charCount"
          :scroll-ratio="scrollRatio"
          placeholder="粘贴文章内容，支持 Markdown..."
          @scroll="onEditorScroll"
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
          ref="previewRef"
          :content="formattedContent" 
          :mode="previewMode"
          :scrollRatio="scrollRatio"
          @scroll="onPreviewScroll"
        />
      </section>
    </main>

    <!-- 样式控制面板 -->
    <StylePanel 
      v-model:settings="styleSettings"
      :visible="showStylePanel"
      @toggle="showStylePanel = !showStylePanel"
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
import { ref } from 'vue'
import Editor from './components/Editor.vue'
import Preview from './components/Preview.vue'
import StylePanel from './components/StylePanel.vue'
import { defaultSettings } from './utils/config.js'
import { useAppearance } from './composables/useAppearance.js'
import { usePersistentStyleSettings } from './composables/usePersistentStyleSettings.js'
import { useRenderedDocument } from './composables/useRenderedDocument.js'
import { useToast } from './composables/useToast.js'

// UI 状态
const previewMode = ref('mobile')
const showStylePanel = ref(false)
const copySuccess = ref(false)
const scrollRatio = ref(0)
const previewRef = ref(null)

const { theme, colorMode, showThemeMenu, themeName, setColorMode, toggleThemeMenu, changeTheme } = useAppearance()
const { toast, showToast } = useToast()
const { styleSettings } = usePersistentStyleSettings(defaultSettings)
const { rawContent, formattedContent, charCount, readingTime } = useRenderedDocument(styleSettings)

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

// （已移除点击空白处关闭样式面板逻辑，改为常驻推挤排版）

// 编辑器滚动同步
function onEditorScroll(ratio) {
  scrollRatio.value = ratio
}

function onPreviewScroll(ratio) {
  scrollRatio.value = ratio
}

// 导出图片（长截图）
const isExporting = ref(false)

async function exportImage() {
  const previewEl = previewRef.value?.previewContentRef
  if (!previewEl) {
    showToast('导出失败：无法获取预览区域', 'error')
    return
  }

  if (isExporting.value) {
    showToast('正在导出中，请稍候...', 'error')
    return
  }

  isExporting.value = true

  try {
    showToast('正在生成长截图，请稍候...', 'success')

    // 收集需要临时展开的滚动容器
    const scrollAncestors = []
    let el = previewEl
    while (el) {
      const style = window.getComputedStyle(el)
      const ov = style.overflow + style.overflowY
      if (/auto|scroll|hidden/.test(ov)) {
        scrollAncestors.push({
          el,
          overflow: el.style.overflow,
          overflowY: el.style.overflowY,
          height: el.style.height,
          maxHeight: el.style.maxHeight,
        })
        el.style.overflow = 'visible'
        el.style.overflowY = 'visible'
        el.style.height = 'auto'
        el.style.maxHeight = 'none'
      }
      el = el.parentElement
    }

    const html2canvas = (await import('html2canvas')).default
    const canvas = await html2canvas(previewEl, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      logging: false,
      windowHeight: previewEl.scrollHeight,
    })

    // 恢复所有容器原始样式
    scrollAncestors.forEach(({ el, overflow, overflowY, height, maxHeight }) => {
      el.style.overflow = overflow
      el.style.overflowY = overflowY
      el.style.height = height
      el.style.maxHeight = maxHeight
    })

    const link = document.createElement('a')
    link.download = `typesetting-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
    showToast('图片已导出成功', 'success')
  } catch (err) {
    console.error('导出图片失败：', err)
    let errorMsg = '导出失败'
    if (err.message.includes('canvas')) {
      errorMsg = '导出失败：Canvas 渲染错误，请尝试缩小内容'
    } else if (err.message.includes('memory')) {
      errorMsg = '导出失败：内存不足，请尝试缩小内容或降低图片质量'
    } else if (err.message) {
      errorMsg = `导出失败：${err.message}`
    }
    showToast(errorMsg, 'error')
  } finally {
    isExporting.value = false
  }
}

</script>

<style>
/* App 布局样式 */
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: transparent;
  border-bottom: 1px solid var(--border-subtle);
  position: sticky;
  top: 0;
  z-index: 100;
}

.app-header::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--bg-primary);
  opacity: 0.85;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  z-index: -1;
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

/* 统计信息显示 */
.stats-display {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  font-size: 12px;
  color: var(--text-tertiary);
  background: var(--bg-tertiary);
  border-radius: 6px;
}

.stat-item {
  font-variant-numeric: tabular-nums;
}

.stat-divider {
  opacity: 0.5;
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

.action-btn:hover:not(:disabled) {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.action-btn:active:not(:disabled) {
  transform: scale(0.96);
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
  transform: translateY(-1px);
}

.icon-btn:active {
  transform: scale(0.92);
}

/* 主内容区 */
.app-main {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 5px;
  background: var(--bg-secondary);
  overflow: hidden;
}

.editor-section,
.preview-section {
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-subtle);
  background: var(--bg-primary);
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

/* 主题下拉菜单相关 */
.theme-dropdown {
  position: relative;
}

.theme-dropdown .dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 6px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: var(--shadow-md);
  z-index: 200;
  min-width: 160px;
  padding: 6px;
  display: flex;
  flex-direction: column;
}

.theme-dropdown .dropdown-menu button {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 6px 10px;
  text-align: left;
  font-size: 13px;
  color: var(--text-primary);
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background var(--transition-fast), color var(--transition-fast);
}

.theme-dropdown .dropdown-menu button:hover {
  background: var(--bg-tertiary);
  color: var(--accent-primary);
}

.theme-dropdown .dropdown-menu button.active {
  background: var(--accent-subtle);
  color: var(--accent-primary);
  font-weight: 500;
}

.menu-icon {
  width: 20px;
  text-align: center;
}

.menu-group-title {
  font-size: 11px;
  color: var(--text-tertiary);
  padding: 2px 8px;
  margin-top: 1px;
}

.menu-divider {
  height: 1px;
  background: var(--border-color);
  margin: 2px 0;
}

.pop-enter-active,
.pop-leave-active {
  transition: opacity var(--transition-fast), transform var(--transition-fast);
  transform-origin: top right;
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* 加载动画 */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spinning {
  animation: spin 1s linear infinite;
}

@media (max-width: 1024px) {
  .app-main {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
}
</style>
