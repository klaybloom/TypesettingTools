<template>
  <div ref="triggerRef" class="settings-trigger" @mouseenter="openNow" @mouseleave="closeSoon">
    <button
      class="action-btn style-btn"
      title="样式"
      :aria-expanded="show"
      @click.stop="toggleNow"
    >
      <svg viewBox="0 0 24 24" width="15" height="15"><path fill="currentColor" d="M12 22C6.49 22 2 17.51 2 12S6.49 2 12 2s10 4.04 10 9c0 3.31-2.69 6-6 6h-1.77c-.28 0-.5.22-.5.5 0 .12.05.23.13.33.41.47.64 1.06.64 1.67 0 1.38-1.12 2.5-2.5 2.5zm0-18c-4.41 0-8 3.59-8 8s3.59 8 8 8c.28 0 .5-.22.5-.5 0-.16-.08-.28-.14-.35-.41-.46-.63-1.05-.63-1.65 0-1.38 1.12-2.5 2.5-2.5H16c2.21 0 4-1.79 4-4 0-3.86-3.59-7-8-7zM6.5 11.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3-4C8.67 7.5 8 6.83 8 6s.67-1.5 1.5-1.5S11 5.17 11 6s-.67 1.5-1.5 1.5zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 4.5 14.5 4.5 16 5.17 16 6s-.67 1.5-1.5 1.5zm3 4c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
      <span class="btn-label">样式</span>
    </button>
    <Teleport to="body">
      <div v-if="show" ref="cardRef" class="settings-card" :style="cardStyle"
        @mouseenter="openNow"
        @mouseleave="closeSoon">
        <!-- 公众号设置 -->
        <template v-if="mode === 'wechat'">
          <div class="sc-group">
            <label class="sc-label">公众号模板</label>
            <div class="sc-tpl-grid">
              <button v-for="t in wechatTemplates" :key="t.id"
                class="sc-tpl-btn" :class="{ active: wechatSettings.wechatTemplateId === t.id }"
                :style="{ '--tpl-color': t.swatch }"
                @click="updateWechat('wechatTemplateId', t.id)">
                <span class="sc-tpl-dot"></span>{{ t.name }}
              </button>
            </div>
          </div>

          <div class="sc-group">
            <label class="sc-label">配色方案</label>
            <div class="sc-tpl-grid">
              <button v-for="p in articleStylePresets" :key="p.name"
                class="sc-tpl-btn" :class="{ active: isPresetActive(p) }"
                :style="{ '--tpl-color': p.settings.accentColor }"
                @click="applyPreset(p)">
                <span class="sc-tpl-dot"></span>{{ p.name }}
              </button>
            </div>
          </div>

          <div class="sc-group">
            <label class="sc-label">字号 <span class="sc-val">{{ wechatSettings.fontSize }}px</span></label>
            <input class="sc-slider" type="range" min="12" max="20" step="1"
              :value="wechatSettings.fontSize" @input="updateWechat('fontSize', +$event.target.value)" />
          </div>

          <div class="sc-group">
            <label class="sc-label">行间距 <span class="sc-val">{{ wechatSettings.lineHeight.toFixed(2) }}</span></label>
            <input class="sc-slider" type="range" min="1.2" max="2.5" step="0.05"
              :value="wechatSettings.lineHeight" @input="updateWechat('lineHeight', +$event.target.value)" />
          </div>

          <div class="sc-group">
            <label class="sc-label">正文颜色</label>
            <div class="sc-color-row">
              <button v-for="c in textColors" :key="c.value" class="sc-color-btn"
                :class="{ active: wechatSettings.textColor === c.value }"
                :style="{ background: c.value }" :title="c.name"
                @click="updateWechat('textColor', c.value)"></button>
            </div>
          </div>

          <div class="sc-group">
            <label class="sc-label">强调色</label>
            <div class="sc-color-row">
              <button v-for="c in accentColors" :key="c.value" class="sc-color-btn"
                :class="{ active: wechatSettings.accentColor === c.value }"
                :style="{ background: c.value }" :title="c.name"
                @click="updateWechat('accentColor', c.value)"></button>
            </div>
          </div>

          <div class="sc-group sc-row">
            <label class="sc-label">首行缩进</label>
            <label class="sc-switch">
              <input type="checkbox" :checked="wechatSettings.textIndent"
                @change="updateWechat('textIndent', $event.target.checked)" />
              <span class="sc-switch-track"></span>
            </label>
          </div>
        </template>

        <!-- 小红书设置 -->
        <template v-else-if="mode === 'xhs'">
          <div class="sc-group">
            <label class="sc-label">卡片模板</label>
            <div class="sc-tpl-grid xhs-tpl">
              <button v-for="t in cardTemplates" :key="t.id"
                class="sc-tpl-btn" :class="{ active: cardSettings.templateId === t.id }"
                @click="updateCard('templateId', t.id)">
                {{ t.name }}
              </button>
            </div>
          </div>

          <div class="sc-group">
            <label class="sc-label">配色方案</label>
            <div class="sc-color-row">
              <button v-for="c in cardColorSchemes" :key="c.id" class="sc-color-btn"
                :class="{ active: cardSettings.colorSchemeId === c.id }"
                :style="{ background: c.swatch }" :title="c.name"
                @click="updateCard('colorSchemeId', c.id)"></button>
            </div>
          </div>

          <div class="sc-group">
            <label class="sc-label">字体风格</label>
            <select class="sc-select" :value="cardSettings.fontFamilyId"
              @change="updateCard('fontFamilyId', $event.target.value)">
              <option v-for="f in cardFontFamilies" :key="f.id" :value="f.id">{{ f.name }}</option>
            </select>
          </div>

          <div class="sc-group">
            <label class="sc-label">字号 <span class="sc-val">{{ cardSettings.fontSize }}px</span></label>
            <input class="sc-slider" type="range" min="13" max="22" step="1"
              :value="cardSettings.fontSize" @input="updateCard('fontSize', +$event.target.value)" />
          </div>
        </template>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { wechatTemplates } from '../utils/wechatTemplates.js'
import { textColors, accentColors, articleStylePresets } from '../utils/config.js'
import { cardTemplates, cardColorSchemes, cardFontFamilies } from '../utils/cardTemplates.js'

const props = defineProps({
  mode: { type: String, required: true },
  wechatSettings: { type: Object, default: () => ({}) },
  cardSettings: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['update:wechatSettings', 'update:cardSettings'])

const show = ref(false)
const triggerRef = ref(null)
const cardRef = ref(null)
const cardStyle = ref({})
const externalAnchor = ref(null)
let closeTimer = null

function openNow() {
  clearTimeout(closeTimer)
  externalAnchor.value = null
  show.value = true
}

function openAt(rect) {
  clearTimeout(closeTimer)
  externalAnchor.value = rect
  show.value = true
}

function closeNow() {
  clearTimeout(closeTimer)
  show.value = false
  externalAnchor.value = null
}

function toggleNow() {
  if (show.value) closeNow()
  else openNow()
}

function closeSoon() {
  clearTimeout(closeTimer)
  closeTimer = setTimeout(() => { show.value = false }, 120)
}

watch(show, (v) => {
  if (v) {
    nextTick(() => {
      const el = triggerRef.value
      const r = externalAnchor.value || el?.getBoundingClientRect()
      if (!r) return
      cardStyle.value = {
        top: Math.min(r.bottom + 8, window.innerHeight - 400) + 'px',
        right: Math.max(window.innerWidth - r.right - 8, 8) + 'px'
      }
    })
  }
})

function updateWechat(key, value) {
  emit('update:wechatSettings', { ...props.wechatSettings, [key]: value })
}

function updateCard(key, value) {
  emit('update:cardSettings', { ...props.cardSettings, [key]: value })
}

function applyPreset(preset) {
  emit('update:wechatSettings', { ...props.wechatSettings, ...preset.settings })
}

function isPresetActive(preset) {
  return Object.keys(preset.settings).every(
    (key) => props.wechatSettings[key] === preset.settings[key]
  )
}

defineExpose({ openAt, close: closeNow })
</script>

<style scoped>
.settings-trigger {
  position: relative;
  display: flex;
  align-items: center;
}

.style-btn {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>

<style>
/* 全局：Teleport 到 body，不能 scoped */
.settings-card {
  position: fixed;
  z-index: 9999;
  width: 240px;
  max-height: 65vh;
  overflow-y: auto;
  padding: 14px;
  background: var(--glass-surface);
  border: 1px solid var(--glass-highlight);
  border-radius: 16px;
  box-shadow: 0 16px 40px var(--shadow-color);
  display: flex;
  flex-direction: column;
  gap: 14px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.sc-group {
  display: flex;
  flex-direction: column;
}

.sc-group.sc-row {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.sc-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-bottom: 6px;
}

.sc-group.sc-row .sc-label {
  margin-bottom: 0;
}

.sc-val {
  float: right;
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
}

.sc-tpl-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
}

.sc-tpl-grid.xhs-tpl {
  grid-template-columns: repeat(3, 1fr);
}

.sc-tpl-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 7px 8px;
  font-size: 11px;
  border-radius: 8px;
  color: var(--text-secondary);
  background: var(--ui-muted-bg);
  border: 2px solid transparent;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.sc-tpl-btn:hover {
  border-color: var(--tpl-color, var(--border-color));
}

.sc-tpl-btn.active {
  border-color: var(--tpl-color, var(--accent-primary));
  color: var(--text-primary);
  background: color-mix(in srgb, var(--tpl-color, var(--accent-primary)) 10%, var(--ui-muted-bg));
}

.sc-tpl-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--tpl-color, var(--accent-primary));
  flex-shrink: 0;
}

.sc-color-row {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.sc-color-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.sc-color-btn:hover { transform: scale(1.15); }

.sc-color-btn.active {
  border-color: var(--text-primary);
  box-shadow: 0 0 0 2px var(--bg-secondary);
}

.sc-select {
  width: 100%;
  padding: 6px 8px;
  font-size: 12px;
  border-radius: 8px;
  color: var(--text-primary);
  background: var(--ui-muted-bg);
  border: 1px solid var(--ui-muted-border);
  cursor: pointer;
}

.sc-slider {
  width: 100%;
  height: 3px;
  background: var(--border-color);
  border-radius: 2px;
  appearance: none;
  cursor: pointer;
}

.sc-slider::-webkit-slider-thumb {
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--accent-primary);
  cursor: pointer;
}

.sc-switch {
  position: relative;
  display: inline-block;
  width: 32px;
  height: 18px;
  cursor: pointer;
}

.sc-switch input {
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
}

.sc-switch-track {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background: var(--bg-tertiary);
  border-radius: 18px;
  transition: all var(--transition-fast);
}

.sc-switch-track::before {
  content: '';
  position: absolute;
  width: 14px;
  height: 14px;
  left: 2px;
  bottom: 2px;
  background: white;
  border-radius: 50%;
  transition: all var(--transition-fast);
}

.sc-switch input:checked + .sc-switch-track {
  background: var(--accent-primary);
}

.sc-switch input:checked + .sc-switch-track::before {
  transform: translateX(14px);
}
</style>
