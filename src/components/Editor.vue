<template>
  <div class="editor-wrapper">
    <!-- Markdown 工具栏 -->
    <div class="markdown-toolbar">
      <!-- 标题下拉 -->
      <div class="toolbar-dropdown">
        <button class="toolbar-btn with-arrow" @click="toggleHeadingMenu" title="标题">
          <span class="btn-text">H</span>
          <svg class="arrow-icon" viewBox="0 0 24 24" width="12" height="12">
            <path fill="currentColor" d="M7 10l5 5 5-5z"/>
          </svg>
        </button>
        <Transition name="pop">
          <div class="dropdown-menu" v-show="showHeadingMenu">
            <button @click="insertFormat('h1')"><span class="menu-icon">H1</span> 一级标题</button>
            <button @click="insertFormat('h2')"><span class="menu-icon">H2</span> 二级标题</button>
            <button @click="insertFormat('h3')"><span class="menu-icon">H3</span> 三级标题</button>
          </div>
        </Transition>
      </div>

      <!-- 待办下拉
      <div class="toolbar-dropdown">
        <button class="toolbar-btn with-arrow" @click="toggleTodoMenu" title="待办">
          <span class="btn-text">☑</span>
          <svg class="arrow-icon" viewBox="0 0 24 24" width="12" height="12">
            <path fill="currentColor" d="M7 10l5 5 5-5z"/>
          </svg>
        </button>
        <div class="dropdown-menu" v-show="showTodoMenu">
          <button @click="insertFormat('todo')"><span class="menu-icon">☐</span> 未完成</button>
          <button @click="insertFormat('todoDone')"><span class="menu-icon">☑</span> 已完成</button>
        </div>
      </div> -->

      <div class="toolbar-divider"></div>

      <!-- 主要按钮 (平铺) -->
      <button class="toolbar-btn icon-only" @click="insertFormat('bold')" title="粗体 Ctrl+B">
        <span class="btn-text bold">B</span>
      </button>
      <button class="toolbar-btn icon-only" @click="insertFormat('italic')" title="斜体 Ctrl+I">
        <span class="btn-text italic">I</span>
      </button>
      <button class="toolbar-btn icon-only" @click="insertFormat('strikethrough')" title="删除线 Ctrl+Shift+X">
        <span class="btn-text strikethrough">S</span>
      </button>
      <button class="toolbar-btn icon-only" @click="insertFormat('quote')" title="引用">
        <svg viewBox="0 0 24 24" width="14" height="14">
          <path fill="currentColor" d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
        </svg>
      </button>
      <button class="toolbar-btn icon-only" @click="insertFormat('list')" title="无序列表">
        <svg viewBox="0 0 24 24" width="14" height="14">
          <path fill="currentColor" d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
        </svg>
      </button>
      <button class="toolbar-btn icon-only" @click="insertFormat('numbered')" title="有序列表">
        <svg viewBox="0 0 24 24" width="14" height="14">
          <path fill="currentColor" d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/>
        </svg>
      </button>
      <button class="toolbar-btn icon-only" @click="insertFormat('code')" title="行内代码">
        <svg viewBox="0 0 24 24" width="14" height="14">
          <path fill="currentColor" d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
        </svg>
      </button>
      <button class="toolbar-btn icon-only" @click="insertFormat('divider')" title="分割线">
        <svg viewBox="0 0 24 24" width="14" height="14">
          <path fill="currentColor" d="M4 11h16v2H4z"/>
        </svg>
      </button>

      <div class="toolbar-divider"></div>

      <!-- 表格、代码块、链接 (平铺) -->
      <button class="toolbar-btn icon-only" @click="insertFormat('table')" title="表格">
        <svg viewBox="0 0 24 24" width="14" height="14">
          <path fill="currentColor" d="M3 3v18h18V3H3zm8 16H5v-6h6v6zm0-8H5V5h6v6zm8 8h-6v-6h6v6zm0-8h-6V5h6v6z"/>
        </svg>
      </button>
      <button class="toolbar-btn icon-only" @click="insertFormat('codeblock')" title="代码块">
        <svg viewBox="0 0 24 24" width="14" height="14">
          <path fill="currentColor" d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
          <rect fill="currentColor" x="10" y="11" width="4" height="2"/>
        </svg>
      </button>
      <button class="toolbar-btn icon-only" @click="insertFormat('link')" title="链接">
        <svg viewBox="0 0 24 24" width="14" height="14">
          <path fill="currentColor" d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
        </svg>
      </button>
      <button class="toolbar-btn icon-only" @click="triggerImageUpload" title="插入图片">
        <svg viewBox="0 0 24 24" width="14" height="14">
          <path fill="currentColor" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
        </svg>
      </button>
      <input
        ref="imageInputRef"
        type="file"
        accept="image/*"
        style="display: none"
        @change="handleImageUpload"
      />
    </div>
    
    <!-- 编辑器 -->
    <div class="editor-container">
      <textarea
        ref="textareaRef"
        class="editor-textarea"
        :value="modelValue"
        :placeholder="placeholder"
        @input="handleInput"
        @keydown="handleKeydown"
        @paste="handlePaste"
        @scroll="handleScroll"
        @click="closeMenus"
        spellcheck="false"
      ></textarea>
    </div>
    
    <div class="editor-footer">
      <span class="editor-hint">⌘B 粗体 | ⌘I 斜体 | ⌘⇧X 删除线 | ⌘⇧K 代码块 | ⌘⇧Q 引用 | ⌘L 链接 | 支持粘贴图片</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '在此输入内容...' }
})

const emit = defineEmits(['update:modelValue', 'scroll'])
const textareaRef = ref(null)
const imageInputRef = ref(null)
const showHeadingMenu = ref(false)
const showTodoMenu = ref(false)

function toggleHeadingMenu() {
  showHeadingMenu.value = !showHeadingMenu.value
  showTodoMenu.value = false
}

function toggleTodoMenu() {
  showTodoMenu.value = !showTodoMenu.value
  showHeadingMenu.value = false
}

function closeMenus() {
  showHeadingMenu.value = false
  showTodoMenu.value = false
}

function handleInput(e) {
  emit('update:modelValue', e.target.value)
}

function handleScroll() {
  const ta = textareaRef.value
  if (!ta) return
  const maxScroll = ta.scrollHeight - ta.clientHeight
  const ratio = maxScroll > 0 ? ta.scrollTop / maxScroll : 0
  emit('scroll', ratio)
}

function handleKeydown(e) {
  const mod = e.ctrlKey || e.metaKey
  if (e.key === 'Tab') {
    e.preventDefault()
    insertAtCursor('    ')
  }
  if (mod && !e.shiftKey && e.key === 'b') {
    e.preventDefault()
    insertFormat('bold')
  }
  if (mod && !e.shiftKey && e.key === 'i') {
    e.preventDefault()
    insertFormat('italic')
  }
  if (mod && e.shiftKey && e.key === 'X') {
    e.preventDefault()
    insertFormat('strikethrough')
  }
  if (mod && e.shiftKey && e.key === 'K') {
    e.preventDefault()
    insertFormat('codeblock')
  }
  if (mod && e.shiftKey && e.key === 'Q') {
    e.preventDefault()
    insertFormat('quote')
  }
  if (mod && !e.shiftKey && e.key === 'l') {
    e.preventDefault()
    insertFormat('link')
  }
}

// 处理粘贴事件 - 检测剪贴板中的图片
function handlePaste(e) {
  const items = e.clipboardData?.items
  if (!items) return

  for (const item of items) {
    if (item.type.startsWith('image/')) {
      e.preventDefault()
      const file = item.getAsFile()
      if (file) convertImageToBase64AndInsert(file)
      return
    }
  }
}

// 工具栏图片上传按钮
function triggerImageUpload() {
  imageInputRef.value?.click()
}

function handleImageUpload(e) {
  const file = e.target.files?.[0]
  if (file && file.type.startsWith('image/')) {
    convertImageToBase64AndInsert(file)
  }
  // 重置 input 以允许重复选择同一文件
  e.target.value = ''
}

// 将图片转为 base64 并插入 Markdown 图片语法
function convertImageToBase64AndInsert(file) {
  const reader = new FileReader()
  reader.onload = (event) => {
    const base64 = event.target.result
    const fileName = file.name || '图片'
    const markdownImg = `\n![${fileName}](${base64})\n`
    insertAtCursor(markdownImg)
  }
  reader.readAsDataURL(file)
}

function insertAtCursor(text) {
  const ta = textareaRef.value
  if (!ta) return
  const start = ta.selectionStart
  const end = ta.selectionEnd
  const val = ta.value
  emit('update:modelValue', val.substring(0, start) + text + val.substring(end))
  requestAnimationFrame(() => {
    ta.selectionStart = ta.selectionEnd = start + text.length
    ta.focus()
  })
}

function insertFormat(type) {
  closeMenus()
  const ta = textareaRef.value
  if (!ta) return
  
  const start = ta.selectionStart
  const end = ta.selectionEnd
  const val = ta.value
  const selected = val.substring(start, end)
  
  let before = '', after = '', placeholder = ''
  
  switch(type) {
    case 'h1': before = '# '; placeholder = '标题'; break
    case 'h2': before = '## '; placeholder = '标题'; break
    case 'h3': before = '### '; placeholder = '标题'; break
    case 'bold': before = '**'; after = '**'; placeholder = '粗体'; break
    case 'italic': before = '*'; after = '*'; placeholder = '斜体'; break
    case 'quote': before = '> '; placeholder = '引用'; break
    case 'list': before = '- '; placeholder = '列表项'; break
    case 'numbered': before = '1. '; placeholder = '列表项'; break
    case 'todo': before = '- [ ] '; placeholder = '待办'; break
    case 'todoDone': before = '- [x] '; placeholder = '已完成'; break
    case 'code': before = '`'; after = '`'; placeholder = '代码'; break
    case 'codeblock': before = '```\n'; after = '\n```'; placeholder = '代码'; break
    case 'table': before = '| 列1 | 列2 |\n| --- | --- |\n| '; after = ' |  |'; placeholder = '内容'; break
    case 'link': before = '['; after = '](url)'; placeholder = '链接'; break
    case 'strikethrough': before = '~~'; after = '~~'; placeholder = '删除线'; break
    case 'divider': before = '\n---\n'; placeholder = ''; break
  }
  
  const insert = selected ? before + selected + after : before + placeholder + after
  const newVal = val.substring(0, start) + insert + val.substring(end)
  emit('update:modelValue', newVal)
  
  requestAnimationFrame(() => {
    if (selected) {
      ta.selectionStart = ta.selectionEnd = start + insert.length
    } else {
      ta.selectionStart = start + before.length
      ta.selectionEnd = start + before.length + placeholder.length
    }
    ta.focus()
  })
}

function handleClickOutside(e) {
  if (!e.target.closest('.toolbar-dropdown')) {
    closeMenus()
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<style scoped>
.editor-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.markdown-toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-subtle);
}

.toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 4px;
  color: var(--text-secondary);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
  min-width: 28px;
  height: 28px;
}

.toolbar-btn:hover {
  background: var(--bg-tertiary);
  color: var(--accent-primary);
  transform: translateY(-1px);
}

.toolbar-btn:active {
  transform: scale(0.92);
}

.toolbar-btn.icon-only {
  padding: 5px;
}

.toolbar-btn.with-arrow {
  gap: 2px;
  padding: 5px 6px;
}

.arrow-icon {
  opacity: 0.6;
}

.btn-text {
  font-size: 14px;
  font-weight: 600;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}

.btn-text.bold { font-weight: 700; }
.btn-text.italic { font-style: italic; font-family: Georgia, serif; }
.btn-text.strikethrough { text-decoration: line-through; }

.toolbar-divider {
  width: 1px;
  height: 18px;
  background: var(--border-color);
  margin: 0 4px;
}

/* 下拉菜单 */
.toolbar-dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  z-index: 100;
  min-width: 150px;
  padding: 6px;
}

.dropdown-menu button {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 12px;
  text-align: left;
  font-size: 13px;
  color: var(--text-primary);
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.dropdown-menu button:hover {
  background: var(--accent-subtle);
  color: var(--accent-primary);
}

.menu-icon {
  width: 20px;
  text-align: center;
  font-weight: 600;
  font-size: 12px;
  color: var(--text-tertiary);
}

.menu-divider {
  height: 1px;
  background: var(--border-color);
  margin: 6px 0;
}

/* 弹出菜单动画 */
.pop-enter-active,
.pop-leave-active {
  transition: opacity var(--transition-fast), transform var(--transition-fast);
  transform-origin: top left;
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.editor-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.editor-textarea {
  flex: 1;
  width: 100%;
  height: 100%;
  padding: 16px 20px;
  border: none;
  resize: none;
  outline: none;
  background: var(--bg-editor);
  color: var(--text-primary);
  font-family: 'SF Mono', 'Menlo', 'Monaco', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.6;
  caret-color: var(--accent-primary);
  box-shadow: inset 0 0 0 1px transparent;
  transition: box-shadow 0.2s ease, background 0.2s ease;
}

.editor-textarea:focus {
  box-shadow: inset 0 0 0 1px var(--accent-primary);
  background: var(--bg-primary);
}

.editor-textarea::placeholder { color: var(--text-tertiary); }
.editor-textarea::selection { background: var(--accent-subtle); }

.editor-footer {
  padding: 4px 12px;
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-subtle);
}

.editor-hint {
  font-size: 11px;
  color: var(--text-tertiary);
}
</style>
