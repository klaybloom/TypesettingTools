/**
 * 小红书卡片：模板 / 配色 / 字体 注册表
 *
 * 卡片盒模型（测量与渲染严格一致）：
 *   card root 360×480, position:relative, overflow:hidden, 背景=template.pageBg
 *     └ panel: absolute inset=frameInset，白/底色内卡（template.panelBg + 圆角/边框）
 *     └ content layer: absolute inset=CARD_PADDING(28), flex column
 *          ├ deco-top    高 reserveTop（chrome，不计入拆卡）
 *          ├ blocks      高 contentBox = 480 - 2*28 - reserveTop - reserveBottom
 *          └ deco-bottom 高 reserveBottom（chrome，不计入拆卡）
 * 因 frameInset(≤18) < CARD_PADDING(28)，正文始终落在 panel 之内。
 * 拆卡引擎（useCardSplitter）按 contentWidth=360-2*28、contentBox 来装箱。
 */

export const CARD_WIDTH = 360
export const CARD_HEIGHT = 480
export const CARD_PADDING = 28

export const cardColorSchemes = [
  { id: 'blue', name: '蓝', swatch: '#4C6EF5', accent: '#4C6EF5', text: '#2B2B33', page: '#EEF1FB' },
  { id: 'orange', name: '橙', swatch: '#F59F00', accent: '#E8830C', text: '#3A2E1E', page: '#FCF3E2' },
  { id: 'teal', name: '青', swatch: '#15AABF', accent: '#0C8599', text: '#1E3338', page: '#E3F4F6' },
  { id: 'red', name: '红', swatch: '#E8503A', accent: '#D9402A', text: '#3A211C', page: '#FBEAE6' },
  { id: 'green', name: '绿', swatch: '#37B24D', accent: '#2B9A3E', text: '#1F3324', page: '#E7F5EA' },
  { id: 'purple', name: '紫', swatch: '#7C3AED', accent: '#6D32D6', text: '#2B2138', page: '#F1EAFB' }
]

export const cardFontFamilies = [
  { id: 'hand', name: '手书体', stack: '"Xingkai SC", "Hannotate SC", "STKaiti", "KaiTi", cursive' },
  { id: 'sans', name: '黑体', stack: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Noto Sans SC", sans-serif' },
  { id: 'serif', name: '宋体', stack: 'Georgia, "Songti SC", "Noto Serif SC", serif' },
  { id: 'round', name: '圆体', stack: '"PingFang SC", "Yuanti SC", "Noto Sans SC", sans-serif' }
]

const templates = {
  border: {
    id: 'border',
    name: '边框',
    reserveTop: 26,
    reserveBottom: 26,
    frameInset: 16,
    decoTop: { type: 'dots', label: '笔记' },
    decoBottom: { type: 'rule-date' },
    pageBg: (s) => stripeBg(s.accent),
    panelBg: () => '#ffffff',
    panelStyle: 'border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.08);'
  },

  simple: {
    id: 'simple',
    name: '简约',
    reserveTop: 0,
    reserveBottom: 0,
    frameInset: 0,
    decoTop: null,
    decoBottom: null,
    pageBg: () => '#fffef9',
    panelBg: () => '#fffef9',
    panelStyle: ''
  },

  handwrite: {
    id: 'handwrite',
    name: '手写',
    reserveTop: 12,
    reserveBottom: 26,
    frameInset: 8,
    decoTop: null,
    decoBottom: { type: 'rule-date' },
    pageBg: (s) => s.page,
    panelBg: () => '#fffef9',
    panelStyle: 'border-radius: 10px; box-shadow: 0 1px 6px rgba(0,0,0,0.06);'
  }
}

export const cardTemplates = Object.values(templates)

export function getCardTemplate(id) {
  return templates[id] || templates.border
}

export function getColorScheme(id) {
  return cardColorSchemes.find((s) => s.id === id) || cardColorSchemes[0]
}

export function getFontFamily(id) {
  return cardFontFamilies.find((f) => f.id === id) || cardFontFamilies[0]
}

// 对角条纹背景：用 SVG data-URI 实现，html2canvas 可可靠栅格化
// （CSS repeating-linear-gradient 在 html2canvas 下不渲染，导出会丢失）
function stripeBg(accent) {
  const c = accent.replace('#', '%23')
  return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22'%3E%3Crect width='22' height='22' fill='${c}'/%3E%3Cpath d='M-4 22 L22 -4 M-4 33 L33 -4 M-15 22 L22 -15' stroke='%23ffffff' stroke-opacity='0.22' stroke-width='8'/%3E%3C/svg%3E")`
}
