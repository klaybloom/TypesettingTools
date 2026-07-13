<template>
  <div ref="toolbarRef" class="preview-toolbar" :class="{ 'has-edit-mode': hasEditMode }">
    <nav class="toolbar-mode-tabs mode-tabs" aria-label="内容模式">
      <button
        v-for="tab in modeTabs"
        :key="tab.id"
        class="mode-btn"
        :class="{ active: viewMode === tab.id }"
        @click="selectMode(tab.id)"
      >{{ tab.label }}</button>
    </nav>

    <label class="toolbar-mode-select">
      <span class="sr-only">内容模式</span>
      <select :value="viewMode" @change="selectMode($event.target.value)">
        <option v-for="tab in modeTabs" :key="tab.id" :value="tab.id">
          {{ tab.label }}
        </option>
      </select>
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
        <path fill="currentColor" d="M7 10l5 5 5-5z"/>
      </svg>
    </label>

    <div class="preview-toolbar-actions">
      <div v-if="viewMode === 'wechat'" class="toolbar-secondary-actions">
        <div class="device-toggle">
          <button
            class="device-btn"
            :class="{ active: previewMode === 'desktop' }"
            title="桌面预览"
            aria-label="桌面预览"
            @click="updatePreviewMode('desktop')"
          >
            <svg viewBox="0 0 24 24" width="15" height="15"><path fill="currentColor" d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"/></svg>
          </button>
          <button
            class="device-btn"
            :class="{ active: previewMode === 'mobile' }"
            title="手机预览"
            aria-label="手机预览"
            @click="updatePreviewMode('mobile')"
          >
            <svg viewBox="0 0 24 24" width="15" height="15"><path fill="currentColor" d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/></svg>
          </button>
        </div>
      </div>

      <div v-if="hasSettings" class="toolbar-settings-action">
        <SettingsPopover
          ref="settingsRef"
          :mode="viewMode"
          :wechat-settings="wechatSettings"
          :card-settings="cardSettings"
          @update:wechat-settings="$emit('update:wechatSettings', $event)"
          @update:card-settings="$emit('update:cardSettings', $event)"
        />
      </div>

      <button
        v-if="hasCopyAction"
        class="action-btn primary toolbar-copy-action"
        :disabled="copyDisabled"
        @click="$emit('copy')"
      >
        <svg viewBox="0 0 24 24" width="15" height="15"><path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
        {{ copyLabel }}
      </button>

      <div v-if="hasContextActions" class="toolbar-export-action">
        <ExportMenu
          ref="exportMenuRef"
          :items="exportItems"
          :disabled="exportDisabled"
          @select="$emit('export', $event)"
        />
      </div>

      <div v-if="hasContextActions" ref="moreTriggerRef" class="toolbar-more-action">
        <button
          class="icon-btn more-btn"
          title="更多操作"
          aria-label="更多操作"
          :aria-expanded="moreOpen"
          @click.stop="toggleMore"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path fill="currentColor" d="M6 10a2 2 0 110 4 2 2 0 010-4zm6 0a2 2 0 110 4 2 2 0 010-4zm6 0a2 2 0 110 4 2 2 0 010-4z"/>
          </svg>
        </button>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="menu-pop">
        <div v-if="moreOpen" ref="moreMenuRef" class="toolbar-more-menu" :style="moreMenuStyle">
          <template v-if="viewMode === 'wechat'">
            <p class="toolbar-more-label">预览设备</p>
            <button class="toolbar-more-item" :class="{ active: previewMode === 'desktop' }" @click="selectDevice('desktop')">
              桌面预览
            </button>
            <button class="toolbar-more-item" :class="{ active: previewMode === 'mobile' }" @click="selectDevice('mobile')">
              手机预览
            </button>
          </template>

          <button v-if="hasSettings" class="toolbar-more-item" @click="openSettingsFromMenu">
            样式设置
          </button>

          <div v-if="exportItems.length" class="toolbar-more-divider"></div>
          <button
            v-for="item in exportItems"
            :key="item.key"
            class="toolbar-more-item"
            :disabled="exportDisabled"
            @click="selectExport(item.key)"
          >
            {{ item.label }}
          </button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import ExportMenu from './ExportMenu.vue'
import SettingsPopover from './SettingsPopover.vue'

const props = defineProps({
  modeTabs: { type: Array, default: () => [] },
  viewMode: { type: String, required: true },
  layout: { type: String, required: true },
  previewMode: { type: String, default: 'mobile' },
  wechatSettings: { type: Object, default: () => ({}) },
  cardSettings: { type: Object, default: () => ({}) },
  exportItems: { type: Array, default: () => [] },
  exportDisabled: { type: Boolean, default: false },
  copyDisabled: { type: Boolean, default: false },
  copySuccess: { type: Boolean, default: false }
})

const emit = defineEmits([
  'select-mode',
  'update:previewMode',
  'update:wechatSettings',
  'update:cardSettings',
  'copy',
  'export'
])

const settingsRef = ref(null)
const exportMenuRef = ref(null)
const toolbarRef = ref(null)
const moreTriggerRef = ref(null)
const moreMenuRef = ref(null)
const moreOpen = ref(false)
const moreMenuStyle = ref({})

const hasEditMode = computed(() => props.modeTabs.some((tab) => tab.id === 'edit'))
const hasSettings = computed(() => props.viewMode === 'wechat' || props.viewMode === 'xhs')
const hasCopyAction = computed(() => props.viewMode === 'wechat' || props.viewMode === 'xhs')
const hasContextActions = computed(() => props.viewMode !== 'edit')
const copyLabel = computed(() => {
  if (props.viewMode === 'xhs') return '复制图片'
  return props.copySuccess ? '已复制' : '复制'
})

function closeOverlays() {
  moreOpen.value = false
  settingsRef.value?.close()
  exportMenuRef.value?.close()
  document.removeEventListener('click', onDocumentClick)
}

function selectMode(mode) {
  closeOverlays()
  emit('select-mode', mode)
}

function updatePreviewMode(mode) {
  emit('update:previewMode', mode)
}

function selectDevice(mode) {
  updatePreviewMode(mode)
  closeMore()
}

function selectExport(key) {
  closeMore()
  emit('export', key)
}

function closeMore() {
  moreOpen.value = false
  document.removeEventListener('click', onDocumentClick)
}

function toggleMore() {
  if (moreOpen.value) {
    closeMore()
    return
  }
  moreOpen.value = true

  nextTick(() => {
    const rect = moreTriggerRef.value?.getBoundingClientRect()
    if (!rect) return
    moreMenuStyle.value = {
      top: `${rect.bottom + 6}px`,
      right: `${Math.max(window.innerWidth - rect.right, 8)}px`
    }
  })
  document.addEventListener('click', onDocumentClick)
}

function openSettingsFromMenu(event) {
  const rect = event.currentTarget.getBoundingClientRect()
  closeMore()
  nextTick(() => settingsRef.value?.openAt(rect))
}

function onDocumentClick(event) {
  if (!moreOpen.value) return
  if (moreTriggerRef.value?.contains(event.target)) return
  if (moreMenuRef.value?.contains(event.target)) return
  closeMore()
}

watch(() => [props.viewMode, props.layout], closeOverlays)

let resizeObserver = null

onMounted(() => {
  resizeObserver = new ResizeObserver(closeOverlays)
  if (toolbarRef.value) resizeObserver.observe(toolbarRef.value)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  document.removeEventListener('click', onDocumentClick)
})
</script>

<style scoped>
.preview-toolbar {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
  min-height: 60px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border-subtle);
  background: rgba(255, 255, 255, 0.14);
  position: relative;
  z-index: 5;
}

.toolbar-mode-tabs {
  flex: 0 1 auto;
  min-width: 0;
}

.toolbar-mode-tabs .mode-btn {
  padding: 6px 12px;
}

.toolbar-mode-select {
  display: none;
  align-items: center;
  min-width: 0;
  position: relative;
  color: var(--text-secondary);
}

.toolbar-mode-select select {
  width: 100%;
  min-width: 112px;
  height: 36px;
  appearance: none;
  padding: 0 34px 0 14px;
  border: 1px solid var(--ui-muted-border);
  border-radius: 999px;
  color: var(--text-primary);
  background: var(--ui-muted-bg);
  font: inherit;
  font-size: 12px;
  font-weight: 700;
}

.toolbar-mode-select svg {
  position: absolute;
  right: 12px;
  pointer-events: none;
}

.preview-toolbar-actions,
.toolbar-secondary-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.preview-toolbar-actions {
  flex: 0 0 auto;
  justify-content: flex-end;
}

.toolbar-settings-action :deep(.style-btn),
.toolbar-export-action :deep(.export-btn) {
  padding: 8px;
  gap: 0;
}

.toolbar-settings-action :deep(.btn-label),
.toolbar-export-action :deep(.btn-label),
.toolbar-export-action :deep(.chevron) {
  display: none;
}

.toolbar-more-action {
  display: none;
}

.more-btn {
  width: 36px;
  height: 36px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@container preview-panel (max-width: 680px) {
  .toolbar-secondary-actions,
  .toolbar-settings-action,
  .toolbar-export-action {
    display: none;
  }

  .toolbar-more-action {
    display: flex;
  }
}

@container preview-panel (max-width: 440px) {
  .preview-toolbar.has-edit-mode .toolbar-mode-tabs {
    display: none;
  }

  .preview-toolbar.has-edit-mode .toolbar-mode-select {
    display: flex;
  }
}

@container preview-panel (max-width: 360px) {
  .preview-toolbar:not(.has-edit-mode) .toolbar-mode-tabs {
    display: none;
  }

  .preview-toolbar:not(.has-edit-mode) .toolbar-mode-select {
    display: flex;
  }

  .preview-toolbar {
    gap: 8px;
    padding-inline: 10px;
  }

  .toolbar-copy-action {
    padding-inline: 10px;
  }
}
</style>

<style>
.toolbar-more-menu {
  position: fixed;
  z-index: 9998;
  min-width: 172px;
  padding: 6px;
  background: var(--glass-surface);
  border: 1px solid var(--glass-highlight);
  border-radius: 12px;
  box-shadow: 0 16px 40px var(--shadow-color);
  display: flex;
  flex-direction: column;
  gap: 2px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.toolbar-more-label {
  margin: 4px 10px 2px;
  font-size: 11px;
  color: var(--text-tertiary);
}

.toolbar-more-item {
  width: 100%;
  padding: 9px 12px;
  border: none;
  border-radius: 8px;
  color: var(--text-secondary);
  background: transparent;
  font-size: 13px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
}

.toolbar-more-item:hover:not(:disabled),
.toolbar-more-item.active {
  color: var(--text-primary);
  background: var(--ui-muted-bg-hover);
}

.toolbar-more-item.active::after {
  content: '✓';
  float: right;
  color: var(--ui-primary);
}

.toolbar-more-item:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.toolbar-more-divider {
  height: 1px;
  margin: 4px 6px;
  background: var(--border-subtle);
}
</style>
