<template>
  <Transition name="slide">
    <div v-show="visible" class="style-panel">
      <div class="panel-header">
        <span class="panel-title">样式设置</span>
      </div>
      <div class="panel-content">
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
import { ref } from 'vue'

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

// 推荐颜色
const textColors = [
  { name: '深墨', value: '#262626' },
  { name: '墨灰', value: '#3f3f3f' },
  { name: '炭灰', value: '#595959' },
  { name: '中灰', value: '#8c8c8c' }
]

const accentColors = [
  { name: '翡翠绿', value: '#10a37f' },
  { name: '科技蓝', value: '#1a73e8' },
  { name: '活力橙', value: '#ff6b35' },
  { name: '优雅紫', value: '#7c3aed' },
  { name: '玫瑰红', value: '#e11d48' }
]

function updateSetting(key, value) {
  emit('update:settings', { ...props.settings, [key]: value })
}

const defaultSettings = {
  fontSize: 15,
  lineHeight: 1.75,
  letterSpacing: 0.5,
  textColor: '#262626',
  accentColor: '#10a37f',
  paragraphMargin: 15
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
