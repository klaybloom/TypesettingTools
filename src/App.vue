<template>
  <div class="app-container" :data-theme="theme" :data-mode="colorMode">
    <!-- 顶部导航栏 -->
    <header class="app-header">
      <div class="header-brand">
        <div class="brand-mark">
          <svg class="logo-icon" viewBox="0 0 24 24" width="18" height="18">
            <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H6v-2h6v2zm4-4H6v-2h10v2zm0-4H6V7h10v2z"/>
          </svg>
          <span class="brand-kicker">WeChat Editor</span>
        </div>
        <div class="brand-copy">
          <h1 class="app-title">公众号排版工具</h1>
          <p class="brand-subtitle">面向公众号编辑的 Markdown 排版、预览与导出工作台</p>
        </div>
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
          <button class="icon-btn theme-trigger" @click="toggleThemeMenu" :title="'当前风格: ' + themeName">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path fill="currentColor" d="M12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 01-4.4 2.26 5.403 5.403 0 01-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/>
            </svg>
            <span class="theme-trigger-copy">
              <span class="theme-trigger-line">
                <span class="theme-trigger-label">{{ themeToken }}</span>
                <span class="theme-trigger-dot">·</span>
                <span class="theme-trigger-mode">{{ colorMode === 'dark' ? '深色' : '浅色' }}</span>
              </span>
            </span>
          </button>
          
          <Transition name="pop">
            <div class="theme-menu dropdown-menu" v-show="showThemeMenu">
              <div class="menu-group-title">外观模式</div>
              <button @click="setColorMode('light')" :class="{ active: colorMode === 'light' }">
                <span class="menu-icon">☀️</span>
                <span class="menu-copy">
                  <span class="menu-title">浅色模式</span>
                </span>
              </button>
              <button @click="setColorMode('dark')" :class="{ active: colorMode === 'dark' }">
                <span class="menu-icon">🌒</span>
                <span class="menu-copy">
                  <span class="menu-title">深色模式</span>
                </span>
              </button>
              
              <div class="menu-divider"></div>
              
              <div class="menu-group-title">主题风格</div>
              <button @click="changeTheme('default')" :class="{ active: theme === 'default' }">
                <span class="menu-icon">◻︎</span>
                <span class="menu-copy">
                  <span class="menu-title">默认极简</span>
                </span>
              </button>
              <button @click="changeTheme('fashion')" :class="{ active: theme === 'fashion' }">
                <span class="menu-icon">✦</span>
                <span class="menu-copy">
                  <span class="menu-title">时尚风格</span>
                </span>
              </button>
              <button @click="changeTheme('retro')" :class="{ active: theme === 'retro' }">
                <span class="menu-icon">◼︎</span>
                <span class="menu-copy">
                  <span class="menu-title">复古风格</span>
                </span>
              </button>
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
          :content="formattedContent" 
          :mode="previewMode"
          :scrollRatio="scrollRatio"
          @scroll="onPreviewScroll"
        />
      </section>
    </main>

    <!-- 样式控制面板 -->
    <StylePanel 
      v-model:settings="articleStyleSettings"
      :visible="showStylePanel"
      @toggle="showStylePanel = !showStylePanel"
    />

    <ExportSurface ref="exportSurfaceRef" :content="formattedContent" />

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
import ExportSurface from './components/ExportSurface.vue'
import Preview from './components/Preview.vue'
import StylePanel from './components/StylePanel.vue'
import { defaultArticleStyleSettings } from './utils/config.js'
import { useAppearance } from './composables/useAppearance.js'
import { useClipboardHtml } from './composables/useClipboardHtml.js'
import { useImageExport } from './composables/useImageExport.js'
import { usePersistentStyleSettings } from './composables/usePersistentStyleSettings.js'
import { useRenderedDocument } from './composables/useRenderedDocument.js'
import { useToast } from './composables/useToast.js'

// UI 状态
const previewMode = ref('mobile')
const showStylePanel = ref(false)
const copySuccess = ref(false)
const scrollRatio = ref(0)
const exportSurfaceRef = ref(null)

const { theme, colorMode, showThemeMenu, themeName, themeToken, setColorMode, toggleThemeMenu, changeTheme } = useAppearance()
const { copyHtmlToClipboard } = useClipboardHtml()
const { isExporting, exportElementAsImage } = useImageExport()
const { toast, showToast } = useToast()
const { articleStyleSettings } = usePersistentStyleSettings(defaultArticleStyleSettings)

const { rawContent, formattedContent, charCount, readingTime } = useRenderedDocument(articleStyleSettings)

async function copyHtml() {
  const copied = await copyHtmlToClipboard(formattedContent.value)

  if (copied) {
    copySuccess.value = true
    showToast('已复制！可直接粘贴到公众号', 'success')
    setTimeout(() => copySuccess.value = false, 2000)
    return
  }

  showToast('复制失败，请手动复制', 'error')
}

// （已移除点击空白处关闭样式面板逻辑，改为常驻推挤排版）

// 编辑器滚动同步
function onEditorScroll(ratio) {
  scrollRatio.value = ratio
}

function onPreviewScroll(ratio) {
  scrollRatio.value = ratio
}

async function exportImage() {
  const exportEl = exportSurfaceRef.value?.exportContentRef
  if (!exportEl) {
    showToast('导出失败：无法获取导出区域', 'error')
    return
  }

  showToast('正在生成长截图，请稍候...', 'success')
  const result = await exportElementAsImage(exportEl)
  showToast(result.message, result.ok ? 'success' : 'error')
}

</script>

<style>
/* App 布局样式 */
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--page-texture), var(--page-gradient);
  transition: background var(--transition-normal), color var(--transition-normal);
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 10px 0;
  padding: 18px 28px;
  background: var(--glass-surface);
  border: 1px solid var(--glass-highlight);
  border-radius: 30px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow:
    0 18px 40px var(--shadow-color),
    inset 0 1px 0 var(--glass-highlight);
  transition:
    background var(--transition-normal),
    border-color var(--transition-normal),
    box-shadow var(--transition-normal),
    color var(--transition-normal);
}

.app-header::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(180deg, var(--glass-highlight), rgba(255,255,255,0));
  opacity: 1;
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  z-index: -1;
}

.header-brand {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  min-width: 0;
}

.brand-mark {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 2px 0;
  color: var(--text-secondary);
}

.brand-kicker {
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.18em;
}

.brand-copy {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  gap: 18px;
  flex-wrap: wrap;
}

.logo-icon {
  color: var(--text-secondary);
}

.app-title {
  font-family: "Iowan Old Style", "Palatino Linotype", "Noto Serif SC", Georgia, serif;
  font-size: 2.15rem;
  line-height: 1;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: var(--text-primary);
}

.brand-subtitle {
  font-size: 0.94rem;
  color: var(--text-secondary);
  letter-spacing: 0.03em;
  line-height: 1.2;
  transform: translateY(2px);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  align-self: stretch;
}

/* 统计信息显示 */
.stats-display {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  font-size: 12px;
  color: var(--text-secondary);
  background: var(--ui-muted-bg);
  border: 1px solid var(--ui-muted-border);
  border-radius: 999px;
  box-shadow: inset 0 1px 0 var(--glass-highlight);
  transition:
    background var(--transition-normal),
    border-color var(--transition-normal),
    color var(--transition-normal),
    box-shadow var(--transition-normal);
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
  padding: 10px 18px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.01em;
  background: var(--ui-muted-bg);
  color: var(--ui-muted-text);
  border: 1px solid var(--ui-muted-border);
  box-shadow: inset 0 1px 0 var(--glass-highlight);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast), background var(--transition-fast), color var(--transition-fast);
}

.action-btn:hover:not(:disabled) {
  background: var(--ui-muted-bg-hover);
  color: var(--text-primary);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.action-btn:active:not(:disabled) {
  transform: scale(0.96);
}

.action-btn.active {
  background: var(--ui-primary);
  color: var(--ui-primary-text);
  border-color: var(--ui-primary);
}

.action-btn.primary {
  background: var(--ui-primary);
  color: var(--ui-primary-text);
  border-color: var(--ui-primary);
  box-shadow: var(--shadow-md);
}

.action-btn.primary:hover:not(:disabled) {
  background: var(--ui-primary-hover);
  opacity: 1;
}

.action-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 999px;
  color: var(--text-secondary);
  background: var(--ui-muted-bg);
  border: 1px solid var(--ui-muted-border);
  transition: all 0.15s;
}

.icon-btn:hover {
  background: var(--ui-muted-bg-hover);
  color: var(--text-primary);
  transform: translateY(-1px);
}

.icon-btn:active {
  transform: scale(0.92);
}

.theme-trigger {
  width: auto;
  min-width: 42px;
  padding: 0 12px;
  gap: 8px;
}

.theme-trigger-copy {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  line-height: 1.1;
}

.theme-trigger-line {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.theme-trigger-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-primary);
}

.theme-trigger-mode {
  font-size: 10px;
  color: var(--text-tertiary);
}

.theme-trigger-dot {
  font-size: 10px;
  color: var(--text-tertiary);
}

/* 主内容区 */
.app-main {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 10px;
  background: transparent;
  overflow: hidden;
}

.editor-section,
.preview-section {
  display: flex;
  flex-direction: column;
  background: var(--glass-surface);
  border-radius: 30px;
  border: 1px solid var(--glass-highlight);
  box-shadow:
    0 20px 44px var(--shadow-color),
    inset 0 1px 0 var(--glass-highlight);
  overflow: hidden;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition:
    background var(--transition-normal),
    border-color var(--transition-normal),
    box-shadow var(--transition-normal);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  min-height: 60px;
  border-bottom: 1px solid var(--border-subtle);
  background: rgba(255, 255, 255, 0.14);
  transition:
    background var(--transition-normal),
    border-color var(--transition-normal),
    color var(--transition-normal);
}

.section-title {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--text-secondary);
}

.char-count {
  font-size: 11px;
  color: var(--text-tertiary);
}

.preview-controls {
  display: flex;
  gap: 6px;
}

.mode-btn {
  padding: 7px 12px;
  font-size: 12px;
  font-weight: 700;
  color: var(--text-secondary);
  background: var(--ui-muted-bg);
  border: 1px solid var(--ui-muted-border);
  border-radius: 999px;
  transition: all 0.15s;
}

.mode-btn.active {
  background: var(--ui-primary);
  color: var(--ui-primary-text);
  border-color: var(--ui-primary);
}

/* Toast 提示 */
.toast {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 18px;
  background: var(--ui-primary);
  color: var(--ui-primary-text);
  border-radius: 999px;
  font-size: 13px;
  z-index: 1000;
  box-shadow: 0 16px 40px rgba(27, 35, 48, 0.2);
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
  margin-top: 10px;
  background: var(--glass-elevated);
  border: 1px solid var(--ui-muted-border);
  border-radius: 20px;
  box-shadow: var(--shadow-lg);
  z-index: 200;
  min-width: 160px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

.theme-dropdown .dropdown-menu button {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 12px;
  text-align: left;
  font-size: 13px;
  color: var(--text-primary);
  background: transparent;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: background var(--transition-fast), color var(--transition-fast);
}

.theme-dropdown .dropdown-menu button:hover {
  background: var(--ui-muted-bg);
  color: var(--text-primary);
}

.theme-dropdown .dropdown-menu button.active {
  background: var(--ui-primary);
  color: var(--ui-primary-text);
  font-weight: 700;
}

.menu-icon {
  width: 20px;
  flex: 0 0 20px;
  text-align: center;
}

.menu-copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
}

.menu-title {
  font-weight: 700;
  line-height: 1.2;
}

.menu-group-title {
  font-size: 11px;
  color: var(--text-tertiary);
  padding: 6px 10px 4px;
  margin-top: 1px;
  letter-spacing: 0.08em;
}

.menu-divider {
  height: 1px;
  background: rgba(226, 233, 241, 0.95);
  margin: 6px 0;
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

  .app-header {
    padding: 16px 20px;
  }

  .app-title {
    font-size: 1.72rem;
  }

  .brand-subtitle {
    font-size: 0.86rem;
  }
}

@media (max-width: 720px) {
  .app-header {
    margin: 8px 8px 0;
    padding: 14px 16px;
    border-radius: 24px;
  }

  .header-actions {
    gap: 6px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .app-main {
    padding: 8px;
    gap: 8px;
  }

  .brand-copy {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .editor-section,
  .preview-section {
    border-radius: 24px;
  }
}
</style>
