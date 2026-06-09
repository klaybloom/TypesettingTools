<template>
  <div ref="triggerRef" class="export-menu">
    <button class="action-btn export-btn" :disabled="disabled" title="导出" @click.stop="toggle">
      <svg viewBox="0 0 24 24" width="15" height="15"><path fill="currentColor" d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
      <span class="btn-label">导出</span>
      <svg class="chevron" :class="{ open }" viewBox="0 0 24 24" width="11" height="11"><path fill="currentColor" d="M7 10l5 5 5-5z"/></svg>
    </button>
    <Teleport to="body">
      <Transition name="menu-pop">
        <div v-if="open" ref="menuRef" class="export-dropdown" :style="menuStyle">
          <button
            v-for="item in items"
            :key="item.key"
            class="export-item"
            @click="select(item.key)"
          >
            <span class="export-item-ico" v-html="iconFor(item.icon)"></span>
            {{ item.label }}
          </button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps({
  items: { type: Array, default: () => [] },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['select'])

const open = ref(false)
const triggerRef = ref(null)
const menuRef = ref(null)
const menuStyle = ref({})

function toggle() {
  if (props.disabled) return
  open.value = !open.value
}

function select(key) {
  open.value = false
  emit('select', key)
}

function onDocClick(e) {
  if (!open.value) return
  const t = triggerRef.value
  const m = menuRef.value
  if (t && t.contains(e.target)) return
  if (m && m.contains(e.target)) return
  open.value = false
}

watch(open, (v) => {
  if (v) {
    nextTick(() => {
      const el = triggerRef.value
      if (!el) return
      const r = el.getBoundingClientRect()
      menuStyle.value = {
        top: (r.bottom + 6) + 'px',
        right: Math.max(window.innerWidth - r.right, 8) + 'px'
      }
    })
    document.addEventListener('click', onDocClick, true)
  } else {
    document.removeEventListener('click', onDocClick, true)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick, true)
})

const ICONS = {
  image: '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>',
  pdf: '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>',
  card: '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg>',
  cards: '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M3 5H1v16c0 1.1.9 2 2 2h16v-2H3V5zm18-4H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2z"/></svg>'
}

function iconFor(name) {
  return ICONS[name] || ''
}
</script>

<style scoped>
.export-menu {
  position: relative;
  display: flex;
  align-items: center;
}

.chevron {
  transition: transform var(--transition-fast);
  opacity: 0.7;
}

.chevron.open {
  transform: rotate(180deg);
}
</style>

<style>
/* Teleport 到 body，不能 scoped */
.export-dropdown {
  position: fixed;
  z-index: 9999;
  min-width: 150px;
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

.export-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  transition: all var(--transition-fast);
}

.export-item:hover {
  background: var(--ui-muted-bg-hover);
  color: var(--text-primary);
}

.export-item-ico {
  display: flex;
  align-items: center;
  color: var(--text-tertiary);
}

.export-item:hover .export-item-ico {
  color: var(--text-primary);
}

.menu-pop-enter-active,
.menu-pop-leave-active {
  transition: opacity 0.15s, transform 0.15s;
}

.menu-pop-enter-from,
.menu-pop-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
