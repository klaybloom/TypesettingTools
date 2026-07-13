import { CARD_HEIGHT, CARD_PADDING, CARD_WIDTH, getCardTemplate, getColorScheme, getFontFamily } from './cardTemplates.js'

export const cardShellCss = `
* { box-sizing: border-box; }
body { margin: 0; }
.xhs-card { position:relative; width:360px; height:480px; overflow:hidden; }
.xhs-card__panel { position:absolute; }
.xhs-card__layer { position:absolute; inset:0; display:flex; flex-direction:column; padding:28px; }
.xhs-card__deco-top, .xhs-card__deco-bottom { flex-shrink:0; display:flex; align-items:center; gap:6px; overflow:hidden; }
.xhs-card__deco-bottom { justify-content:space-between; }
.deco-dots { display:inline-flex; gap:3px; }.deco-dots i { width:5px;height:5px;border-radius:50%;background:#c8c8c8; }
.deco-tag { margin-left:auto;font-size:11px;font-weight:700;letter-spacing:.08em; }.deco-avatar { width:26px;height:26px;border-radius:50%; }
.deco-handle,.deco-date,.deco-meta { font-size:11px;color:#9aa0a6; }.deco-handle { font-size:12px;color:#657786; }
.deco-quote { font-size:40px;line-height:1;font-weight:700; }.deco-rule { flex:1;height:1px; }
.xhs-card__content { flex:1 1 auto; overflow:hidden; }.xhs-card__content > :first-child { margin-top:0 !important; }.xhs-card__content > :last-child { margin-bottom:0 !important; }
`

function decorationTop(template, scheme) {
  if (template.decoTop?.type === 'dots') return `<span class="deco-dots"><i></i><i></i><i></i></span><span class="deco-tag" style="color:${scheme.accent}">${template.decoTop.label}</span>`
  if (template.decoTop?.type === 'avatar') return `<span class="deco-avatar" style="background:${scheme.accent}"></span><span class="deco-handle">@mdpress</span>`
  if (template.decoTop?.type === 'quote') return `<span class="deco-quote" style="color:${scheme.accent}">&ldquo;</span>`
  return ''
}

function decorationBottom(template, scheme, pageLabel) {
  if (template.decoBottom?.type === 'rule-date') return `<span class="deco-rule" style="background:${scheme.accent}40"></span><span class="deco-date">${pageLabel}</span>`
  if (template.decoBottom?.type === 'meta') return `<span class="deco-meta">${pageLabel} · mdpress</span>`
  return ''
}

export function renderCardShell({ blocks, settings, index = 0, total = 1 }) {
  const template = getCardTemplate(settings.templateId)
  const scheme = getColorScheme(settings.colorSchemeId)
  const font = getFontFamily(settings.fontFamilyId)
  const inset = `${template.frameInset}px`
  const pageLabel = `${index + 1} / ${total}`
  return `<div class="xhs-card" style="width:${CARD_WIDTH}px;height:${CARD_HEIGHT}px;background:${template.pageBg(scheme)}"><div class="xhs-card__panel" style="top:${inset};left:${inset};right:${inset};bottom:${inset};background:${template.panelBg(scheme)};${template.panelStyle}"></div><div class="xhs-card__layer"><div class="xhs-card__deco-top" style="height:${template.reserveTop}px">${decorationTop(template, scheme)}</div><div class="xhs-card__content" style="font-family:${font.stack};color:${scheme.text};font-size:${settings.fontSize}px;line-height:1.75">${blocks.join('\n')}</div><div class="xhs-card__deco-bottom" style="height:${template.reserveBottom}px">${decorationBottom(template, scheme, pageLabel)}</div></div></div>`
}

export function getCardContentBox(settings) {
  const template = getCardTemplate(settings.templateId)
  return CARD_HEIGHT - CARD_PADDING * 2 - (template.reserveTop || 0) - (template.reserveBottom || 0)
}
