/**
 * 小红书卡片样式引擎
 * 产出与 formatter（markdown-it renderer）同键的内联样式表，供 renderWithStyles 使用。
 * 与公众号样式相互独立：卡片内容窄（~304px）、字号偏大、边距紧凑。
 */

import { getColorScheme, getFontFamily } from './cardTemplates.js'

export function createCardStyles(cardSettings) {
  const scheme = getColorScheme(cardSettings.colorSchemeId)
  const font = getFontFamily(cardSettings.fontFamilyId)
  const accent = scheme.accent
  const text = scheme.text
  const base = Number(cardSettings.fontSize) || 16
  const fam = font.stack

  return {
    // 套在内容容器上的基础排版（renderWithStyles 不含 section 包裹，由 CardCanvas 应用）
    container: `font-family: ${fam}; color: ${text}; font-size: ${base}px; line-height: 1.75; letter-spacing: 0.2px; word-break: break-word;`,

    section: `font-family: ${fam}; color: ${text}; font-size: ${base}px; line-height: 1.75;`,
    p: `margin: 0 0 ${Math.round(base * 0.7)}px; text-align: justify;`,
    liParagraph: 'margin: 0; text-align: justify;',

    h1: `font-family: ${fam}; font-size: ${base + 10}px; font-weight: 700; color: ${accent}; margin: 0 0 ${base}px; line-height: 1.35;`,
    h2: `font-family: ${fam}; font-size: ${base + 5}px; font-weight: 700; color: ${accent}; margin: ${base}px 0 ${Math.round(base * 0.6)}px; line-height: 1.4;`,
    h3: `font-family: ${fam}; font-size: ${base + 2}px; font-weight: 700; color: ${text}; margin: ${Math.round(base * 0.8)}px 0 ${Math.round(base * 0.5)}px;`,

    strong: `color: ${accent}; font-weight: 700;`,
    em: 'font-style: italic;',
    s: 'text-decoration: line-through; color: #999;',
    a: `color: ${accent}; text-decoration: underline; word-break: break-all;`,

    codeblock: `background: ${accent}0d; color: ${text}; padding: 12px 14px; margin: ${Math.round(base * 0.7)}px 0; border-radius: 8px; border: 1px solid ${accent}33; font-family: 'SF Mono', Menlo, Monaco, monospace; font-size: ${base - 3}px; line-height: 1.55; overflow: hidden; white-space: pre-wrap; word-break: break-word;`,
    inlineCode: `background: ${accent}1a; color: ${accent}; padding: 1px 5px; border-radius: 4px; font-family: Menlo, Monaco, monospace; font-size: 0.88em;`,

    ul: `margin: ${Math.round(base * 0.6)}px 0; padding-left: 22px;`,
    ol: `margin: ${Math.round(base * 0.6)}px 0; padding-left: 22px;`,
    li: `margin-bottom: ${Math.round(base * 0.35)}px; color: ${text};`,
    taskList: 'list-style: none; padding-left: 0;',
    taskListItem: 'margin-bottom: 6px; display: flex; align-items: flex-start; gap: 6px;',
    checkbox: `width: 15px; height: 15px; margin-top: 3px; flex-shrink: 0; accent-color: ${accent};`,

    table: `width: 100%; border-collapse: collapse; margin: ${Math.round(base * 0.7)}px 0; font-size: ${base - 2}px;`,
    th: `background: ${accent}1a; padding: 7px 10px; border: 1px solid ${accent}40; text-align: left; font-weight: 600; color: ${text};`,
    td: `padding: 7px 10px; border: 1px solid ${accent}33; color: ${text};`,

    blockquote: `background: ${accent}0d; border-left: 3px solid ${accent}; padding: 10px 14px; margin: ${Math.round(base * 0.7)}px 0; color: ${text}; font-size: ${base - 1}px; line-height: 1.7; border-radius: 0 6px 6px 0;`,
    hr: `width: 100%; height: 1px; background-color: ${accent}55; margin: ${base}px 0; border: none;`,
    img: 'max-width: 100%; max-height: 220px; object-fit: contain; border-radius: 8px; margin: 10px auto; display: block;',

    footnoteRef: `font-size: 0.75em; vertical-align: super; line-height: 0; color: ${accent}; text-decoration: none; font-weight: 600;`,
    footnoteSection: `margin-top: 16px; padding-top: 10px; border-top: 1px solid ${accent}33; font-size: ${base - 4}px; color: #8c8c8c; line-height: 1.5;`,
    footnoteItem: 'margin-bottom: 4px;',
    footnoteBackRef: `font-size: 0.85em; color: ${accent}; text-decoration: none; margin-left: 4px;`
  }
}
