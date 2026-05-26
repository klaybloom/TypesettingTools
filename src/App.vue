<template>
  <div class="app-container" :data-mode="colorMode">
    <!-- 顶部导航栏 -->
    <header class="app-header">
      <div class="header-brand">
        <svg class="logo-icon" viewBox="0 0 24 24" width="22" height="22">
          <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H6v-2h6v2zm4-4H6v-2h10v2zm0-4H6V7h10v2z"/>
        </svg>
        <h1 class="app-title">mdpress</h1>
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

        <button
          class="icon-btn mode-toggle"
          @click="toggleColorMode"
          :title="colorMode === 'dark' ? '切换到浅色模式' : '切换到深色模式'"
          :aria-label="colorMode === 'dark' ? '切换到浅色模式' : '切换到深色模式'"
        >
          <svg v-if="colorMode === 'dark'" viewBox="0 0 24 24" width="18" height="18">
            <path fill="currentColor" d="M12 7a5 5 0 100 10 5 5 0 000-10zm0-5a1 1 0 011 1v2a1 1 0 11-2 0V3a1 1 0 011-1zm0 18a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1zM4.22 4.22a1 1 0 011.42 0l1.41 1.41a1 1 0 11-1.41 1.42L4.22 5.64a1 1 0 010-1.42zm12.73 12.73a1 1 0 011.42 0l1.41 1.41a1 1 0 01-1.41 1.42l-1.42-1.41a1 1 0 010-1.42zM2 12a1 1 0 011-1h2a1 1 0 110 2H3a1 1 0 01-1-1zm17 0a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1zM4.22 19.78a1 1 0 010-1.42l1.41-1.41a1 1 0 111.42 1.41l-1.42 1.42a1 1 0 01-1.41 0zm12.73-12.73a1 1 0 010-1.42l1.41-1.41a1 1 0 111.42 1.41l-1.42 1.42a1 1 0 01-1.41 0z"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" width="18" height="18">
            <path fill="currentColor" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
          </svg>
        </button>
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

const { colorMode, toggleColorMode } = useAppearance()
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
  padding: 10px 24px;
  background: var(--glass-surface);
  border: 1px solid var(--glass-highlight);
  border-radius: 24px;
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
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.logo-icon {
  color: var(--text-secondary);
  flex-shrink: 0;
}

.app-title {
  font-family: "Iowan Old Style", "Palatino Linotype", "Noto Serif SC", Georgia, serif;
  font-size: 1.4rem;
  line-height: 1;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: var(--text-primary);
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
    padding: 10px 20px;
  }

  .app-title {
    font-size: 1.25rem;
  }
}

@media (max-width: 720px) {
  .app-header {
    margin: 8px 8px 0;
    padding: 10px 14px;
    border-radius: 20px;
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

  .editor-section,
  .preview-section {
    border-radius: 24px;
  }
}
</style>
