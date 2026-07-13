/**
 * 小红书自动拆卡引擎
 *
 * 思路：把整篇 Markdown 用卡片样式渲染成顶层块序列，放进一个「与卡片内容区同宽」的离屏
 * 测量容器，逐块累加高度做贪心装箱——下一块放不下就开新卡，从而保证不在元素中间断开。
 *
 * 关键不变量 / 细节：
 * - 测量宽度 = 渲染宽度（CARD_WIDTH - 2*CARD_PADDING），保证测出来的高度与真实渲染一致。
 * - 每个顶层块用 overflow:hidden 的 wrapper 包裹后测量，使其外边距被纳入高度（margin 收敛、
 *   略偏保守），避免相邻块 margin 折叠导致低估、进而溢出卡片。
 * - contentBox = 卡高 - 上下 padding - 模板装饰(chrome)预留，content 永远不与 chrome 相撞。
 * - 单块高于一整卡：独占一卡、允许其在卡内被裁剪（CardCanvas 用 overflow:hidden）。
 * - 标题(h1/h2/h3)若落在卡片底部、后面塞不下正文，则提前换卡，避免标题成孤行。
 * - 图片在测量前 await decode，避免 0 高度误判。
 */

import { onUnmounted, ref, watch } from 'vue'
import { renderWithStyles } from '../utils/formatter.js'
import { createCardStyles } from '../utils/cardStyle.js'
import { CARD_WIDTH, CARD_PADDING } from '../utils/cardTemplates.js'
import { getCardContentBox } from '../utils/cardShell.js'
import { splitCardBlocks } from '../utils/cardSplit.js'

export function useCardSplitter(rawContent, cardSettings, enabled) {
  const cards = ref([]) // string[][]：外层=卡片，内层=该卡的块 outerHTML
  const splitting = ref(false)
  const overflowNotice = ref(false)

  let runToken = 0
  let debounceTimer = null

  async function recompute() {
    const token = ++runToken
    splitting.value = true
    overflowNotice.value = false

    const text = (rawContent.value || '').trim()
    if (!text) {
      cards.value = []
      splitting.value = false
      return
    }

    const settings = cardSettings.value
    const styleMap = createCardStyles(settings)
    const html = renderWithStyles(text, styleMap)

    const contentWidth = CARD_WIDTH - CARD_PADDING * 2
    const contentBox = getCardContentBox(settings)

    // 离屏测量容器
    const measure = document.createElement('div')
    measure.style.cssText = [
      'position:fixed',
      'left:-100000px',
      'top:0',
      `width:${contentWidth}px`,
      'visibility:hidden',
      'pointer-events:none',
      'box-sizing:border-box'
    ].join(';')
    measure.style.cssText += `;${styleMap.container}`
    measure.innerHTML = html
    document.body.appendChild(measure)

    try {
      // 等待图片解码，避免高度误判
      const imgs = Array.from(measure.querySelectorAll('img'))
      if (imgs.length) {
        await Promise.all(imgs.map((img) =>
          (img.decode ? img.decode().catch(() => {}) : Promise.resolve())
        ))
      }
      // 已被更晚的运行取代则放弃
      if (token !== runToken) return

      if (token !== runToken) return
      cards.value = splitCardBlocks(measure, contentBox)
    } finally {
      measure.remove()
      if (token === runToken) splitting.value = false
    }
  }

  function schedule() {
    if (enabled && !enabled.value) return
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      requestAnimationFrame(recompute)
    }, 300)
  }

  watch([rawContent, cardSettings], schedule, { deep: true })
  if (enabled) {
    watch(enabled, (on) => { if (on) schedule() })
  }

  onUnmounted(() => clearTimeout(debounceTimer))

  return { cards, splitting, overflowNotice, recompute }
}
