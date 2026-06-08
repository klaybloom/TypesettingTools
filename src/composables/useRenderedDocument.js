import { computed, onUnmounted, ref, watch } from 'vue'
import { formatText, renderPlain } from '../utils/formatter.js'

const DEFAULT_MARKDOWN_SAMPLE = `# Markdown 语法示例

这是一段普通正文，支持 **粗体**、*斜体*、~~删除线~~ 与 \`行内代码\`。

## 标题与引用

> 这是一个引用块，用来测试公众号风格下的强调内容展示效果。

### 列表

- 无序列表项一
- 无序列表项二
- 无序列表项三

1. 有序列表第一项
2. 有序列表第二项
3. 有序列表第三项

- [ ] 待办事项
- [x] 已完成事项

### 链接与图片

[OpenAI](https://openai.com) 是一个链接示例。

![示例图片](https://picsum.photos/800/420)

### 表格

| 功能 | 状态 | 备注 |
| --- | --- | --- |
| 标题 | 可用 | 支持 H1-H3 |
| 列表 | 可用 | 支持有序与无序 |
| 表格 | 可用 | 适合调试样式 |

---

### 代码块

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}\`
}

console.log(greet('WeChat Editor'))
\`\`\`
`

export function useRenderedDocument(articleStyleSettings) {
  const rawContent = ref(DEFAULT_MARKDOWN_SAMPLE)
  // 首屏直接同步赋值，避免被 debounce 拖出 300ms 空白
  const debouncedContent = ref(rawContent.value)
  const debouncedSettings = ref({ ...articleStyleSettings.value })

  let contentDebounceTimer = null
  let settingsDebounceTimer = null

  watch(rawContent, (newVal) => {
    clearTimeout(contentDebounceTimer)
    contentDebounceTimer = setTimeout(() => {
      debouncedContent.value = newVal
    }, 300)
  })

  watch(articleStyleSettings, (newVal) => {
    clearTimeout(settingsDebounceTimer)
    settingsDebounceTimer = setTimeout(() => {
      debouncedSettings.value = { ...newVal }
    }, 150)
  }, { deep: true })

  const formattedContent = computed(() => {
    if (!debouncedContent.value.trim()) return ''
    return formatText(debouncedContent.value, debouncedSettings.value, debouncedSettings.value.wechatTemplateId)
  })

  const nativeContent = computed(() => {
    if (!debouncedContent.value.trim()) return ''
    return renderPlain(debouncedContent.value)
  })

  const charCount = computed(() => rawContent.value.replace(/\s/g, '').length)

  const readingTime = computed(() => {
    const chars = charCount.value
    if (chars === 0) return 0
    return Math.ceil(chars / 400)
  })

  onUnmounted(() => {
    clearTimeout(contentDebounceTimer)
    clearTimeout(settingsDebounceTimer)
  })

  return {
    rawContent,
    formattedContent,
    nativeContent,
    charCount,
    readingTime,
    defaultMarkdownSample: DEFAULT_MARKDOWN_SAMPLE
  }
}
