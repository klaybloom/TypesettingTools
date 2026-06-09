<template>
  <div class="app-container" :data-mode="colorMode" :data-layout="effectiveLayout">
    <!-- 顶部导航栏：logo · tabs · 动作按钮 -->
    <header class="app-header">
      <div class="header-brand">
        <svg class="logo-icon" viewBox="0 0 24 24" width="22" height="22">
          <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H6v-2h6v2zm4-4H6v-2h10v2zm0-4H6V7h10v2z"/>
        </svg>
        <h1 class="app-title">mdpress</h1>
      </div>

      <nav class="mode-tabs">
        <button
          v-for="tab in modeTabs"
          :key="tab.id"
          class="mode-btn"
          :class="{ active: viewMode === tab.id }"
          @click="setViewMode(tab.id)"
        >{{ tab.label }}</button>
      </nav>

      <div class="header-actions">
        <!-- 布局切换：单栏 / 双栏（窄屏强制单栏时隐藏） -->
        <button
          v-show="!isNarrow"
          class="icon-btn layout-toggle"
          @click="toggleLayout"
          :title="layoutMode === 'split' ? '切换到单栏' : '切换到双栏'"
          aria-label="切换布局"
        >
          <svg v-if="layoutMode === 'split'" viewBox="0 0 24 24" width="18" height="18">
            <path fill="currentColor" d="M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1zm7 2H5v10h6V7zm2 10h6V7h-6v10z"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" width="18" height="18">
            <path fill="currentColor" d="M5 5h14a1 1 0 011 1v12a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1zm1 2v10h12V7H6z"/>
          </svg>
        </button>

        <!-- 预览 -->
        <template v-if="viewMode === 'preview'">
          <ExportMenu :items="previewExportItems" :disabled="!nativeContent || isExporting" @select="onExport" />
        </template>

        <!-- 公众号：桌面/手机 + 样式 + 复制 + 导出 -->
        <template v-else-if="viewMode === 'wechat'">
          <div class="device-toggle">
            <button class="device-btn" :class="{ active: previewMode === 'desktop' }" @click="previewMode = 'desktop'" title="桌面预览" aria-label="桌面预览">
              <svg viewBox="0 0 24 24" width="15" height="15"><path fill="currentColor" d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"/></svg>
            </button>
            <button class="device-btn" :class="{ active: previewMode === 'mobile' }" @click="previewMode = 'mobile'" title="手机预览" aria-label="手机预览">
              <svg viewBox="0 0 24 24" width="15" height="15"><path fill="currentColor" d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/></svg>
            </button>
          </div>
          <SettingsPopover
            mode="wechat"
            :wechat-settings="articleStyleSettings"
            :card-settings="cardSettings"
            @update:wechat-settings="articleStyleSettings = $event"
            @update:card-settings="cardSettings = $event"
          />
          <button class="action-btn primary" @click="copyHtml" :disabled="!formattedContent">
            <svg viewBox="0 0 24 24" width="15" height="15"><path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
            {{ copySuccess ? '已复制' : '复制' }}
          </button>
          <ExportMenu :items="wechatExportItems" :disabled="!formattedContent || isExporting" @select="onExport" />
        </template>

        <!-- 小红书：样式 + 复制图片 + 导出 -->
        <template v-else-if="viewMode === 'xhs'">
          <SettingsPopover
            mode="xhs"
            :wechat-settings="articleStyleSettings"
            :card-settings="cardSettings"
            @update:wechat-settings="articleStyleSettings = $event"
            @update:card-settings="cardSettings = $event"
          />
          <button class="action-btn primary" @click="copyCardImage" :disabled="!cards.length || cardExporting">
            <svg viewBox="0 0 24 24" width="15" height="15"><path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
            复制图片
          </button>
          <ExportMenu :items="cardExportItems" :disabled="!cards.length || cardExporting" @select="onExport" />
        </template>

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

    <!-- 主内容区：单栏居中 / 双栏并排 -->
    <main class="app-main">
      <!-- 双栏：左侧常驻编辑器 + 可拖拽分隔线 -->
      <template v-if="effectiveLayout === 'split'">
        <section class="editor-section" :style="{ flexBasis: splitRatio * 100 + '%' }">
          <Editor
            v-model="rawContent"
            :char-count="charCount"
            :scroll-ratio="scrollRatio"
            placeholder="粘贴文章内容，支持 Markdown..."
            @scroll="onEditorScroll"
          />
        </section>
        <div
          class="split-divider"
          @pointerdown="startResize"
          title="拖拽调整左右宽度"
          role="separator"
          aria-orientation="vertical"
        ></div>
      </template>

      <section class="preview-section">
        <Editor
          v-if="effectiveLayout === 'single' && viewMode === 'edit'"
          v-model="rawContent"
          :char-count="charCount"
          :scroll-ratio="scrollRatio"
          placeholder="粘贴文章内容，支持 Markdown..."
          @scroll="onEditorScroll"
        />
        <NativePreview
          v-else-if="viewMode === 'preview'"
          :content="nativeContent"
          :scrollRatio="scrollRatio"
          @scroll="onPreviewScroll"
        />
        <Preview
          v-else-if="viewMode === 'wechat'"
          :content="formattedContent"
          :mode="previewMode"
          :scrollRatio="scrollRatio"
          @scroll="onPreviewScroll"
        />
        <CardPane
          v-else-if="viewMode === 'xhs'"
          :cards="cards"
          :settings="cardSettings"
          :index="cardIndex"
          :splitting="splitting"
          :overflow-notice="overflowNotice"
          @update:index="cardIndex = $event"
        />
      </section>
    </main>

    <ExportSurface ref="exportSurfaceRef" :content="isNative ? nativeContent : formattedContent" :native="isNative" />
    <PrintSurface :content="isNative ? nativeContent : formattedContent" :native="isNative" />
    <CardExportSurface ref="cardExportRef" :settings="cardSettings" />

    <!-- Toast 提示 -->
    <Transition name="toast">
      <div v-if="toast.show" class="toast" :class="toast.type">
        {{ toast.message }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import CardExportSurface from './components/CardExportSurface.vue'
import CardPane from './components/CardPane.vue'
import Editor from './components/Editor.vue'
import ExportMenu from './components/ExportMenu.vue'
import ExportSurface from './components/ExportSurface.vue'
import NativePreview from './components/NativePreview.vue'
import Preview from './components/Preview.vue'
import PrintSurface from './components/PrintSurface.vue'
import SettingsPopover from './components/SettingsPopover.vue'
import { defaultArticleStyleSettings } from './utils/config.js'
import { useAppearance } from './composables/useAppearance.js'
import { useCardSettings } from './composables/useCardSettings.js'
import { useCardSplitter } from './composables/useCardSplitter.js'
import { useClipboardHtml } from './composables/useClipboardHtml.js'
import { useImageExport } from './composables/useImageExport.js'
import { useLayout } from './composables/useLayout.js'
import { usePersistentStyleSettings } from './composables/usePersistentStyleSettings.js'
import { useRenderedDocument } from './composables/useRenderedDocument.js'
import { useToast } from './composables/useToast.js'
import { useViewMode } from './composables/useViewMode.js'

// UI 状态
const previewMode = ref('mobile')
const copySuccess = ref(false)
const scrollRatio = ref(0)
const exportSurfaceRef = ref(null)
const cardExportRef = ref(null)
const cardIndex = ref(0)

const { viewMode, setViewMode } = useViewMode()
const { layoutMode, effectiveLayout, isNarrow, splitRatio, toggleLayout, startResize } = useLayout()
const { colorMode, toggleColorMode } = useAppearance()
const { copyHtmlToClipboard } = useClipboardHtml()
const { isExporting, exportElementAsImage } = useImageExport()
const { toast, showToast } = useToast()
const { articleStyleSettings } = usePersistentStyleSettings(defaultArticleStyleSettings)
const { cardSettings } = useCardSettings()

const { rawContent, formattedContent, nativeContent, charCount } = useRenderedDocument(articleStyleSettings)

const isNative = computed(() => viewMode.value === 'preview')
const isXhs = computed(() => viewMode.value === 'xhs')
const { cards, splitting, overflowNotice } = useCardSplitter(rawContent, cardSettings, isXhs)

const modeTabs = computed(() => {
  const tabs = [
    { id: 'preview', label: '预览' },
    { id: 'wechat', label: '公众号' },
    { id: 'xhs', label: '小红书' }
  ]
  // 双栏下编辑器是常驻左栏，不再需要「编辑」tab
  if (effectiveLayout.value !== 'split') tabs.unshift({ id: 'edit', label: '编辑' })
  return tabs
})

// 切到双栏时若停留在「编辑」，自动落到预览（编辑器已在左栏常驻）
watch(effectiveLayout, (layout) => {
  if (layout === 'split' && viewMode.value === 'edit') setViewMode('preview')
}, { immediate: true })

const previewExportItems = [
  { key: 'image', label: '导出图片', icon: 'image' },
  { key: 'pdf', label: '导出 PDF', icon: 'pdf' }
]
const wechatExportItems = previewExportItems
const cardExportItems = [
  { key: 'card-current', label: '导出当前卡片', icon: 'card' },
  { key: 'card-all', label: '导出全部卡片', icon: 'cards' }
]

function onExport(key) {
  if (key === 'image') return exportImage()
  if (key === 'pdf') return exportPdf()
  if (key === 'card-current') return exportCurrentCard()
  if (key === 'card-all') return exportAllCards()
}

const cardExporting = ref(false)

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

async function exportPdf() {
  const content = isNative.value ? nativeContent.value : formattedContent.value
  if (!content) return

  const cleanup = () => {
    document.body.classList.remove('printing')
    window.removeEventListener('afterprint', cleanup)
  }
  window.addEventListener('afterprint', cleanup)

  document.body.classList.add('printing')
  await nextTick()
  window.print()
}

const safeCardIndex = computed(() => {
  if (!cards.value.length) return 0
  return Math.min(Math.max(cardIndex.value, 0), cards.value.length - 1)
})

async function copyCardImage() {
  if (!cards.value.length || cardExporting.value) return
  cardExporting.value = true
  showToast('正在生成卡片图片...', 'success')
  const ok = await cardExportRef.value.copyOne(cards.value[safeCardIndex.value], safeCardIndex.value, cards.value.length)
  cardExporting.value = false
  showToast(ok ? '当前卡片已复制到剪贴板' : '复制失败，请改用导出', ok ? 'success' : 'error')
}

async function exportCurrentCard() {
  if (!cards.value.length || cardExporting.value) return
  cardExporting.value = true
  showToast('正在导出当前卡片...', 'success')
  await cardExportRef.value.exportOne(cards.value[safeCardIndex.value], safeCardIndex.value, cards.value.length)
  cardExporting.value = false
  showToast('当前卡片已导出', 'success')
}

async function exportAllCards() {
  if (!cards.value.length || cardExporting.value) return
  cardExporting.value = true
  showToast(`正在导出全部 ${cards.value.length} 张卡片...`, 'success')
  await cardExportRef.value.exportAll(cards.value)
  cardExporting.value = false
  showToast('全部卡片已导出', 'success')
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
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 12px;
  width: calc(100% - 20px);
  max-width: 960px;
  margin: 10px auto 0;
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
  gap: 6px;
  flex-wrap: wrap;
  justify-content: flex-end;
  justify-self: end;
}

/* 顶栏中的次级动作（样式 / 导出）收成图标按钮，标签靠 tooltip + 下拉承载 */
.header-actions .style-btn,
.header-actions .export-btn {
  padding: 8px;
  gap: 0;
}

.header-actions .style-btn .btn-label,
.header-actions .export-btn .btn-label,
.header-actions .export-btn .chevron {
  display: none;
}

/* 模式切换 */
.mode-tabs {
  display: flex;
  gap: 4px;
  padding: 4px;
  background: var(--ui-muted-bg);
  border: 1px solid var(--ui-muted-border);
  border-radius: 999px;
  box-shadow: inset 0 1px 0 var(--glass-highlight);
}

.mode-tabs .mode-btn {
  padding: 6px 14px;
  border: none;
  background: transparent;
}

.mode-tabs .mode-btn:hover:not(.active) {
  color: var(--text-primary);
}

/* 按钮样式 */
.action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 13px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.01em;
  white-space: nowrap;
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

/* 主内容区：单栏居中 */
.app-main {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 10px;
  background: transparent;
  overflow: hidden;
}

.preview-section {
  display: flex;
  flex-direction: column;
  flex: 1;
  max-width: 960px;
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

/* 双栏：左编辑器 + 分隔线 + 右预览，整条铺满 */
.app-container[data-layout="split"] .app-header {
  max-width: none;
}

.app-container[data-layout="split"] .app-main {
  justify-content: stretch;
  gap: 0;
}

.editor-section {
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
  min-width: 0;
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

.app-container[data-layout="split"] .preview-section {
  flex: 1 1 0;
  max-width: none;
  min-width: 0;
}

/* 轻量可拖拽分隔线：透明命中区 + 居中细条 */
.split-divider {
  flex: 0 0 14px;
  align-self: stretch;
  position: relative;
  cursor: col-resize;
  touch-action: none;
}

.split-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 48px;
  transform: translate(-50%, -50%);
  border-radius: 999px;
  background: var(--ui-muted-border);
  opacity: 0.6;
  transition: opacity var(--transition-fast), background var(--transition-fast), height var(--transition-fast);
}

.split-divider:hover::before,
body.resizing-cols .split-divider::before {
  opacity: 1;
  height: 72px;
  background: var(--text-tertiary);
}

/* 拖拽时锁定光标与选区 */
body.resizing-cols {
  cursor: col-resize;
  user-select: none;
}

/* 桌面/手机 图标切换 */
.device-toggle {
  display: flex;
  gap: 2px;
  padding: 3px;
  background: var(--ui-muted-bg);
  border: 1px solid var(--ui-muted-border);
  border-radius: 999px;
}

.device-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 26px;
  border: none;
  border-radius: 999px;
  color: var(--text-tertiary);
  background: transparent;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.device-btn:hover {
  color: var(--text-primary);
}

.device-btn.active {
  color: var(--ui-primary-text);
  background: var(--ui-primary);
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
  .app-header {
    padding: 10px 20px;
  }

  .app-title {
    font-size: 1.25rem;
  }
}

@media (max-width: 720px) {
  .app-header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    width: calc(100% - 16px);
    margin: 8px auto 0;
    padding: 10px 14px;
    border-radius: 20px;
  }

  .mode-tabs {
    order: 1;
    flex-basis: 100%;
    justify-content: center;
  }

  .header-actions {
    gap: 6px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .app-main {
    padding: 8px;
  }

  .preview-section {
    border-radius: 24px;
  }
}
</style>
