<template>
  <Transition name="slide">
    <div v-show="visible" class="style-panel">
      <div class="panel-header">
        <span class="panel-title">样式设置</span>
      </div>
      <div class="panel-content">
        <!-- 主题预设 -->
        <div class="setting-group">
          <label>主题预设</label>
          <div class="preset-cards">
            <button
              v-for="preset in themePresets"
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
        
        <button class="reset-btn" @click="resetSettings">
          恢复默认设置
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { defaultSettings, textColors, accentColors, themePresets } from '../utils/config.js'

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
  emit('update:settings', { ...defaultSettings })
}
</script>

<style scoped>
.style-panel {
  position: fixed;
  right: 0;
  top: 40px;
  bottom: 0;
  width: 260px;
  background: var(--bg-secondary);
  border-left: 1px solid var(--border-color);
  box-shadow: -4px 0 20px rgba(0,0,0,0.08);
  z-index: 50;
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-subtle);
}

.panel-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

.panel-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.setting-group {
  margin-bottom: var(--spacing-lg);
}

.setting-group label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: var(--spacing-sm);
}

.setting-control {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.setting-control input[type="range"] {
  flex: 1;
  height: 4px;
  background: var(--bg-tertiary);
  border-radius: 2px;
  appearance: none;
  cursor: pointer;
}

.setting-control input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  background: var(--accent-primary);
  border-radius: 50%;
  cursor: pointer;
  transition: transform var(--transition-fast);
}

.setting-control input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.setting-value {
  min-width: 50px;
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
  text-align: right;
}

.color-options {
  display: flex;
  gap: var(--spacing-sm);
}

.color-btn {
  width: 32px;
  height: 32px;
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
  padding: var(--spacing-sm) var(--spacing-md);
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
  gap: 6px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.preset-card {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 8px;
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
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--preset-color);
  flex-shrink: 0;
}

.preset-name {
  font-size: 12px;
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
  transition: all var(--transition-normal);
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
