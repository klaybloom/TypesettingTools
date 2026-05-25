/**
 * 标点符号标准化
 * 将西式标点转换为中文出版规范标点。
 *
 * 注意：所有规范化只作用于"非代码"区域。
 * normalizePunctuation 会按 fenced code（``` / ~~~）和 inline code（`...`）
 * 把输入切片，仅对非代码片段做规范化，避免破坏代码内容。
 */

const LDQUO = '“' // “
const RDQUO = '”' // ”
const LSQUO = '‘' // ‘
const RSQUO = '’' // ’

// 引号转换：弯引号 → 直角引号
export function normalizeQuotes(text) {
  // 英文直引号双引号
  let result = text.replace(/"([^"\n]*)"/g, '「$1」') // 「」
  // 英文直引号单引号（避免误伤 it's 这类缩写：要求右侧不是字母）
  result = result.replace(/'([^'\n]*)'(?=[^a-zA-Z]|$)/g, '『$1』') // 『』
  // 中文弯双引号
  result = result.replace(
    new RegExp(`[${LDQUO}${RDQUO}]([^${LDQUO}${RDQUO}\n]*)[${LDQUO}${RDQUO}]`, 'g'),
    '「$1」'
  )
  // 中文弯单引号
  result = result.replace(
    new RegExp(`[${LSQUO}${RSQUO}]([^${LSQUO}${RSQUO}\n]*)[${LSQUO}${RSQUO}](?=[^a-zA-Z]|$)`, 'g'),
    '『$1』'
  )
  return result
}

// 省略号标准化：... → ……
export function normalizeEllipsis(text) {
  return text.replace(/\.{3,}/g, '……').replace(/。{2,}/g, '……')
}

// 破折号标准化：-- → ——（保留 Markdown 分割线与表格分隔符）
export function normalizeDash(text) {
  return text.split('\n').map(line => {
    const trimmed = line.trim()
    if (/^[-*_]{3,}$/.test(trimmed)) return line
    if (/^\|.*\|$/.test(trimmed) && trimmed.includes('---')) return line
    return line.replace(/(?<!\|[\s-]*)--(?![-\s]*\|)/g, '——')
  }).join('\n')
}

// 中英文之间补空格、合并多余空格
export function normalizeSpaces(text) {
  let result = text.replace(/([一-龥])([a-zA-Z0-9])/g, '$1 $2')
  result = result.replace(/([a-zA-Z0-9])([一-龥])/g, '$1 $2')
  result = result.replace(/  +/g, ' ')
  return result
}

function normalizeNonCode(text) {
  let result = text
  result = normalizeQuotes(result)
  result = normalizeEllipsis(result)
  result = normalizeDash(result)
  result = normalizeSpaces(result)
  return result
}

// 一次性匹配 fenced code 或 inline code
const CODE_SPAN_RE = /(`{3,}|~{3,})[\s\S]*?\1|`[^`\n]+`/g

// 综合标点规范化（保护代码区域）
export function normalizePunctuation(text) {
  let lastIdx = 0
  const out = []
  for (const m of text.matchAll(CODE_SPAN_RE)) {
    out.push(normalizeNonCode(text.slice(lastIdx, m.index)))
    out.push(m[0])
    lastIdx = m.index + m[0].length
  }
  out.push(normalizeNonCode(text.slice(lastIdx)))
  return out.join('')
}

export default normalizePunctuation
