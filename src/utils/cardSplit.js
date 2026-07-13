/** Browser DOM splitter shared by the editor. It never returns a card that would clip content. */
const HEADING_TAGS = new Set(['H1', 'H2', 'H3'])
const UNSPLITTABLE = new Set(['TABLE', 'PRE', 'IMG'])
const MIN_HEADING_TAIL = 80

function measure(block) {
  const wrap = document.createElement('div')
  wrap.style.cssText = 'overflow:hidden;display:flow-root;'
  block.parentNode.appendChild(wrap)
  wrap.appendChild(block)
  const height = wrap.offsetHeight
  const html = block.outerHTML
  wrap.remove()
  return { html, height, tag: block.tagName }
}

function makeSentenceParts(block) {
  const text = block.textContent || ''
  const parts = text.match(/[^。！？!?；;\n]+[。！？!?；;\n]*/g) || [text]
  if (parts.length < 2) return null
  const nodes = []
  const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT)
  let node
  while ((node = walker.nextNode())) nodes.push(node)
  const pointAt = (offset) => {
    let seen = 0
    for (const textNode of nodes) {
      const next = seen + textNode.data.length
      if (offset <= next) return { node: textNode, offset: offset - seen }
      seen = next
    }
    return { node: nodes.at(-1), offset: nodes.at(-1).data.length }
  }
  let start = 0
  return parts.map((part) => {
    const clone = block.cloneNode(false)
    const end = start + part.length
    const range = document.createRange()
    const from = pointAt(start)
    const to = pointAt(end)
    range.setStart(from.node, from.offset)
    range.setEnd(to.node, to.offset)
    clone.appendChild(range.cloneContents())
    start = end
    return clone
  })
}

function makeListParts(block) {
  const items = Array.from(block.children).filter((child) => child.tagName === 'LI')
  if (items.length < 2) return null
  return items.map((item) => {
    const clone = block.cloneNode(false)
    clone.appendChild(item.cloneNode(true))
    return clone
  })
}

function splitTallBlock(block, contentBox) {
  if (UNSPLITTABLE.has(block.tagName)) throw new Error(`${block.tagName.toLowerCase()} 超过单张小红书图片可用高度，无法安全拆分`)
  const pieces = block.tagName === 'P' ? makeSentenceParts(block) : (['UL', 'OL'].includes(block.tagName) ? makeListParts(block) : null)
  if (!pieces) throw new Error(`${block.tagName.toLowerCase()} 超过单张小红书图片可用高度，无法安全拆分`)
  const result = []
  let current = []
  let used = 0
  for (const piece of pieces) {
    const item = measure(piece)
    if (item.height > contentBox) throw new Error(`${block.tagName.toLowerCase()} 的单个内容单元超过单张小红书图片可用高度`)
    if (used + item.height > contentBox && current.length) { result.push(current); current = []; used = 0 }
    current.push(item.html); used += item.height
  }
  if (current.length) result.push(current)
  return result
}

export function splitCardBlocks(root, contentBox) {
  const blocks = Array.from(root.children)
  const cards = []
  let current = []
  let used = 0
  const push = () => { if (current.length) { cards.push(current); current = []; used = 0 } }

  for (const block of blocks) {
    const item = measure(block)
    if (item.height > contentBox) {
      push()
      cards.push(...splitTallBlock(block, contentBox))
      continue
    }
    if (used + item.height > contentBox && current.length) push()
    if (HEADING_TAGS.has(item.tag) && current.length && contentBox - used < MIN_HEADING_TAIL) push()
    current.push(item.html)
    used += item.height
  }
  push()
  return cards
}
