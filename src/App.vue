<template>
  <div class="app-container" :data-mode="colorMode" :data-layout="effectiveLayout">
    <!-- 顶部导航栏：品牌 · 全局动作 -->
    <header class="app-header">
      <div class="header-brand">
        <svg class="logo-icon" viewBox="0 0 24 24" width="22" height="22">
          <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H6v-2h6v2zm4-4H6v-2h10v2zm0-4H6V7h10v2z"/>
        </svg>
        <h1 class="app-title">mdpress</h1>
      </div>

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
        <PreviewToolbar
          :mode-tabs="modeTabs"
          :view-mode="viewMode"
          :layout="effectiveLayout"
          :preview-mode="previewMode"
          :wechat-settings="articleStyleSettings"
          :card-settings="cardSettings"
          :export-items="activeExportItems"
          :export-disabled="toolbarExportDisabled"
          :copy-disabled="toolbarCopyDisabled"
          :copy-success="copySuccess"
          @select-mode="setViewMode"
          @update:preview-mode="previewMode = $event"
          @update:wechat-settings="articleStyleSettings = $event"
          @update:card-settings="cardSettings = $event"
          @copy="onToolbarCopy"
          @export="onExport"
        />
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
import ExportSurface from './components/ExportSurface.vue'
import NativePreview from './components/NativePreview.vue'
import Preview from './components/Preview.vue'
import PreviewToolbar from './components/PreviewToolbar.vue'
import PrintSurface from './components/PrintSurface.vue'
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

const activeExportItems = computed(() => {
  if (viewMode.value === 'xhs') return cardExportItems
  if (viewMode.value === 'edit') return []
  return previewExportItems
})

const toolbarExportDisabled = computed(() => {
  if (viewMode.value === 'preview') return !nativeContent.value || isExporting.value
  if (viewMode.value === 'wechat') return !formattedContent.value || isExporting.value
  if (viewMode.value === 'xhs') return !cards.value.length || cardExporting.value
  return true
})

const toolbarCopyDisabled = computed(() => {
  if (viewMode.value === 'wechat') return !formattedContent.value
  if (viewMode.value === 'xhs') return !cards.value.length || cardExporting.value
  return true
})

function onToolbarCopy() {
  if (viewMode.value === 'wechat') return copyHtml()
  if (viewMode.value === 'xhs') return copyCardImage()
}

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
