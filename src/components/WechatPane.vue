<template>
  <div class="wechat-pane">
    <!-- 公众号预览 -->
    <div class="wechat-scroll">
      <div class="wechat-column">
        <div v-if="!content" class="empty-preview">
          <svg viewBox="0 0 24 24" width="48" height="48">
            <path fill="currentColor" opacity="0.3" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H6v-2h6v2zm4-4H6v-2h10v2zm0-4H6V7h10v2z"/>
          </svg>
          <p>在左侧输入 Markdown 即可预览公众号排版</p>
        </div>
        <div v-else v-html="content"></div>
      </div>
    </div>

    <!-- 样式控件 -->
    <div class="wechat-controls">
      <div class="ctrl-group">
        <label>公众号模板</label>
        <div class="tpl-grid">
          <button
            v-for="tpl in wechatTemplates"
            :key="tpl.id"
            class="tpl-cell"
            :class="{ active: settings.wechatTemplateId === tpl.id }"
            :style="{ '--tpl-color': tpl.swatch }"
            @click="update('wechatTemplateId', tpl.id)"
          >
            <span class="tpl-dot"></span>
            <span>{{ tpl.name }}</span>
          </button>
        </div>
      </div>

      <div class="ctrl-group">
        <label>排版预设</label>
        <div class="preset-row">
          <button
            v-for="preset in articleStylePresets"
            :key="preset.name"
            class="preset-cell"
            :class="{ active: isPresetActive(preset) }"
            :style="{ '--tpl-color': preset.settings.accentColor }"
            @click="applyPreset(preset)"
          >
            <span class="tpl-dot"></span>
            <span>{{ preset.name }}</span>
          </button>
        </div>
      </div>

      <div class="ctrl-group">
        <label>字体大小 <span class="ctrl-value">{{ settings.fontSize }}px</span></label>
        <input class="slider" type="range" min="12" max="20" step="1"
          :value="settings.fontSize" @input="update('fontSize', +$event.target.value)" />
      </div>

      <div class="ctrl-group">
        <label>行间距 <span class="ctrl-value">{{ settings.lineHeight.toFixed(2) }}</span></label>
        <input class="slider" type="range" min="1.2" max="2.5" step="0.05"
          :value="settings.lineHeight" @input="update('lineHeight', +$event.target.value)" />
      </div>

      <div class="ctrl-group">
        <label>正文颜色</label>
        <div class="color-row">
          <button v-for="c in textColors" :key="c.value" class="color-dot"
            :class="{ active: settings.textColor === c.value }"
            :style="{ background: c.value }" :title="c.name"
            @click="update('textColor', c.value)"></button>
        </div>
      </div>

      <div class="ctrl-group">
        <label>强调色</label>
        <div class="color-row">
          <button v-for="c in accentColors" :key="c.value" class="color-dot"
            :class="{ active: settings.accentColor === c.value }"
            :style="{ background: c.value }" :title="c.name"
            @click="update('accentColor', c.value)"></button>
        </div>
      </div>

      <div class="ctrl-group">
        <label>首行缩进</label>
        <label class="switch">
          <input type="checkbox" :checked="settings.textIndent"
            @change="update('textIndent', $event.target.checked)" />
          <span class="switch-slider"></span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { wechatTemplates } from '../utils/wechatTemplates.js'
import { textColors, accentColors, articleStylePresets } from '../utils/config.js'

const props = defineProps({
  content: { type: String, default: '' },
  settings: { type: Object, required: true }
})

const emit = defineEmits(['update:settings'])

function update(key, value) {
  emit('update:settings', { ...props.settings, [key]: value })
}

function applyPreset(preset) {
  emit('update:settings', { ...props.settings, ...preset.settings })
}

function isPresetActive(preset) {
  return Object.keys(preset.settings).every((key) => props.settings[key] === preset.settings[key])
}
</script>

<style scoped>
.wechat-pane {
  flex: 1;
  display: flex;
  gap: 16px;
  padding: 16px;
  overflow: hidden;
}

.wechat-scroll {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  display: flex;
  justify-content: center;
}

.wechat-column {
  width: 100%;
  max-width: 420px;
  min-height: 100%;
  padding: 24px 20px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: var(--shadow-md);
}

.empty-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 320px;
  color: var(--text-tertiary);
  text-align: center;
}

.empty-preview svg { margin-bottom: var(--spacing-md); }
.empty-preview p { font-size: 0.875rem; }

/* 控件栏 */
.wechat-controls {
  width: 200px;
  flex-shrink: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ctrl-group label {
  display: block;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-bottom: 8px;
}

.ctrl-value {
  float: right;
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
}

.tpl-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
}

.preset-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tpl-cell,
.preset-cell {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  font-size: 12px;
  border-radius: 8px;
  color: var(--text-secondary);
  background: var(--ui-muted-bg);
  border: 2px solid transparent;
  transition: all var(--transition-fast);
}

.tpl-cell:hover,
.preset-cell:hover { border-color: var(--tpl-color); }

.tpl-cell.active,
.preset-cell.active {
  border-color: var(--tpl-color);
  color: var(--text-primary);
  background: color-mix(in srgb, var(--tpl-color) 10%, var(--ui-muted-bg));
}

.tpl-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--tpl-color);
  flex-shrink: 0;
}

.slider {
  width: 100%;
  height: 3px;
  background: var(--border-color);
  border-radius: 2px;
  appearance: none;
  cursor: pointer;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--accent-primary);
  cursor: pointer;
}

.color-row { display: flex; gap: 8px; flex-wrap: wrap; }

.color-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 3px solid transparent;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.color-dot:hover { transform: scale(1.1); }

.color-dot.active {
  border-color: var(--text-primary);
  box-shadow: 0 0 0 2px var(--bg-secondary);
}

.switch {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
}

.switch input { opacity: 0; width: 0; height: 0; }

.switch-slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background: var(--bg-tertiary);
  border-radius: 20px;
  transition: all var(--transition-fast);
}

.switch-slider::before {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  left: 2px;
  bottom: 2px;
  background: white;
  border-radius: 50%;
  transition: all var(--transition-fast);
}

.switch input:checked + .switch-slider { background: var(--accent-primary); }
.switch input:checked + .switch-slider::before { transform: translateX(16px); }

@media (max-width: 1024px) {
  .wechat-pane { flex-direction: column; }
  .wechat-controls { width: 100%; flex-direction: row; flex-wrap: wrap; }
  .ctrl-group { flex: 1; min-width: 140px; }
}
</style>
