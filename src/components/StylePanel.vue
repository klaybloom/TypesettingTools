<template>
  <div class="style-panel-container" :class="{ 'is-visible': visible }">
    <Transition name="fade">
      <div v-if="visible" class="panel-overlay" @click="$emit('toggle')"></div>
    </Transition>
    
    <Transition name="slide">
      <div v-if="visible" class="style-panel" @click.stop>
        <div class="panel-header">
          <span class="panel-title">样式设置</span>
        </div>
        <div class="panel-content">
        <!-- 排版预设 -->
        <div class="setting-group">
          <label>排版预设</label>
          <div class="preset-cards">
            <button
              v-for="preset in articleStylePresets"
              :key="preset.name"
              class="preset-card"
              :class="{ active: isPresetActive(preset) }"
              :style="{ '--preset-color': preset.settings.accentColor }"
              @click="applyPreset(preset)"
            >
              <span class="preset-dot"></span>
              <span class="preset-name">{{ preset.name }}</span>
            </button>
          </div>
        </div>

        <div class="setting-group">
          <label>字体大小</label>
          <div class="setting-control">
            <input 
              type="range" 
              :value="settings.fontSize"
              @input="updateSetting('fontSize', +$event.target.value)"
              min="12" 
              max="20" 
              step="1"
            />
            <span class="setting-value">{{ settings.fontSize }}px</span>
          </div>
        </div>
        
        <div class="setting-group">
          <label>行间距</label>
          <div class="setting-control">
            <input 
              type="range" 
              :value="settings.lineHeight"
              @input="updateSetting('lineHeight', +$event.target.value)"
              min="1.2" 
              max="2.5" 
              step="0.05"
            />
            <span class="setting-value">{{ settings.lineHeight.toFixed(2) }}</span>
          </div>
        </div>
        
        <div class="setting-group">
          <label>字间距</label>
          <div class="setting-control">
            <input 
              type="range" 
              :value="settings.letterSpacing"
              @input="updateSetting('letterSpacing', +$event.target.value)"
              min="0" 
              max="3" 
              step="0.1"
            />
            <span class="setting-value">{{ settings.letterSpacing.toFixed(1) }}px</span>
          </div>
        </div>
        
        <div class="setting-group">
          <label>正文颜色</label>
          <div class="color-options">
            <button 
              v-for="color in textColors" 
              :key="color.value"
              class="color-btn"
              :class="{ active: settings.textColor === color.value }"
              :style="{ '--color': color.value }"
              :title="color.name"
              @click="updateSetting('textColor', color.value)"
            ></button>
          </div>
        </div>
        
        <div class="setting-group">
          <label>强调色</label>
          <div class="color-options">
            <button 
              v-for="color in accentColors" 
              :key="color.value"
              class="color-btn"
              :class="{ active: settings.accentColor === color.value }"
              :style="{ '--color': color.value }"
              :title="color.name"
              @click="updateSetting('accentColor', color.value)"
            ></button>
          </div>
        </div>
        
        <div class="setting-group">
          <label>首行缩进</label>
          <div class="setting-control">
            <label class="switch">
              <input 
                type="checkbox" 
                :checked="settings.textIndent"
                @change="updateSetting('textIndent', $event.target.checked)"
              />
              <span class="switch-slider"></span>
            </label>
            <span class="setting-value">{{ settings.textIndent ? '开启' : '关闭' }}</span>
          </div>
        </div>

        <div class="setting-group">
          <label>段落间距</label>
          <div class="setting-control">
            <input 
              type="range" 
              :value="settings.paragraphMargin"
              @input="updateSetting('paragraphMargin', +$event.target.value)"
              min="8" 
              max="30" 
              step="1"
            />
            <span class="setting-value">{{ settings.paragraphMargin }}px</span>
          </div>
        </div>
        
        <div class="setting-group">
          <button class="reset-btn" @click="resetSettings" title="恢复为知乎推荐的最佳参数">
            恢复默认排版
          </button>
        </div>
      </div>
    </div>
  </Transition>
  </div>
</template>

<script setup>
import { defaultArticleStyleSettings, textColors, accentColors, articleStylePresets } from '../utils/config.js'

const props = defineProps({
  settings: {
    type: Object,
    required: true
  },
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:settings', 'toggle'])

function updateSetting(key, value) {
  emit('update:settings', { ...props.settings, [key]: value })
}

function applyPreset(preset) {
  emit('update:settings', { ...preset.settings })
}

function isPresetActive(preset) {
  const s = props.settings
  const p = preset.settings
  return s.accentColor === p.accentColor && s.textColor === p.textColor && s.fontSize === p.fontSize && s.textIndent === p.textIndent
}

function resetSettings() {
  emit('update:settings', { ...defaultArticleStyleSettings })
}
</script>

<style scoped>
.style-panel-container {
  position: fixed;
  inset: 0;
  z-index: 1000;
  pointer-events: none;
}

.style-panel-container.is-visible {
  pointer-events: auto;
}

.panel-overlay {
  position: absolute;
  inset: 0;
  background: rgba(20, 28, 40, 0.18);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.style-panel {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 304px;
  background: var(--glass-elevated);
  border-left: 1px solid var(--ui-muted-border);
  box-shadow: -18px 0 42px var(--shadow-color);
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

.panel-header {
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-subtle);
}

.panel-title {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--text-primary);
}

.panel-content {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
}

.setting-group {
  margin-bottom: 12px;
}

.setting-group label {
  display: block;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-bottom: 6px;
}

.setting-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.setting-control input[type="range"] {
  flex: 1;
  height: 3px;
  background: var(--border-color);
  border-radius: 2px;
  appearance: none;
  cursor: pointer;
}

.setting-control input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 14px;
  height: 14px;
  background: var(--accent-primary);
  border-radius: 50%;
  cursor: pointer;
  transition: transform var(--transition-fast);
}

.setting-control input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.setting-value {
  min-width: 44px;
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
  text-align: right;
}

.color-options {
  display: flex;
  gap: 6px;
}

.color-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--color);
  border: 3px solid transparent;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.color-btn:hover {
  transform: scale(1.1);
}

.color-btn.active {
  border-color: var(--text-primary);
  box-shadow: 0 0 0 2px var(--bg-secondary);
}

.reset-btn {
  width: 100%;
  padding: 7px 10px;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  transition: all var(--transition-fast);
}

.reset-btn:hover {
  background: var(--accent-subtle);
}

/* 主题预设卡片 */
.preset-cards {
  display: flex;
  gap: 5px;
  overflow-x: auto;
  padding-bottom: 2px;
}

.preset-card {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 8px;
  border-radius: 7px;
  background: var(--bg-tertiary);
  border: 2px solid transparent;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
  flex-shrink: 0;
}

.preset-card:hover {
  border-color: var(--preset-color);
}

.preset-card.active {
  border-color: var(--preset-color);
  background: color-mix(in srgb, var(--preset-color) 10%, var(--bg-tertiary));
}

.preset-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--preset-color);
  flex-shrink: 0;
}

.preset-name {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-secondary);
}

/* 开关组件 */
.switch {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.switch-slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
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

.switch input:checked + .switch-slider {
  background: var(--accent-primary);
}

.switch input:checked + .switch-slider::before {
  transform: translateX(16px);
  color: var(--accent-primary);
}

/* 过渡动画 */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
