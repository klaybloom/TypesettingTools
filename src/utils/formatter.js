/**
 * Markdown 渲染器。每次渲染创建独立的 markdown-it 实例，避免并发预览和导出共享可变样式。
 */

import { normalizePunctuation } from './punctuation.js'
import { createArticleStyles } from './articleStyle.js'
import MarkdownIt from 'markdown-it'
import taskLists from 'markdown-it-task-lists'
import footnotePlugin from 'markdown-it-footnote'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import python from 'highlight.js/lib/languages/python'
import css from 'highlight.js/lib/languages/css'
import xml from 'highlight.js/lib/languages/xml'
import json from 'highlight.js/lib/languages/json'
import bash from 'highlight.js/lib/languages/bash'
import typescript from 'highlight.js/lib/languages/typescript'
import sql from 'highlight.js/lib/languages/sql'
import markdown from 'highlight.js/lib/languages/markdown'

for (const [name, language] of Object.entries({
  javascript, js: javascript, python, py: python, css, html: xml, xml, json,
  bash, sh: bash, shell: bash, typescript, ts: typescript, sql, markdown, md: markdown
})) hljs.registerLanguage(name, language)

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

function createMarkdownRenderer(styles) {
  const md = new MarkdownIt({
    html: false,
    breaks: false,
    linkify: true,
    typographer: false,
    highlight(str, lang) {
      const style = styles.codeblock || ''
      if (lang && hljs.getLanguage(lang)) {
        try {
          return `<pre style="${style}"><code>${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`
        } catch (_) { /* use automatic highlighting below */ }
      }
      try {
        const result = hljs.highlightAuto(str)
        if (result.relevance > 5) return `<pre style="${style}"><code>${result.value}</code></pre>`
      } catch (_) { /* use escaped source below */ }
      return `<pre style="${style}"><code>${md.utils.escapeHtml(str)}</code></pre>`
    }
  })

  md.use(taskLists, { enabled: true, label: false })
  md.use(footnotePlugin)

  md.renderer.rules.footnote_ref = (tokens, idx) => {
    const n = Number(tokens[idx].meta.id + 1)
    const id = `fn${n}${tokens[idx].meta.subId > 0 ? `:${tokens[idx].meta.subId}` : ''}`
    return `<sup><a href="#${id}" id="fnref${n}" style="${styles.footnoteRef}">[${n}]</a></sup>`
  }
  md.renderer.rules.footnote_block_open = () => `<section style="${styles.footnoteSection}">\n<ol style="padding-left: 20px; margin: 0;">\n`
  md.renderer.rules.footnote_block_close = () => '</ol>\n</section>\n'
  md.renderer.rules.footnote_open = (tokens, idx) => `<li id="fn${Number(tokens[idx].meta.id + 1)}" style="${styles.footnoteItem}">`
  md.renderer.rules.footnote_close = () => '</li>\n'
  md.renderer.rules.footnote_anchor = (tokens, idx) => ` <a href="#fnref${Number(tokens[idx].meta.id + 1)}" style="${styles.footnoteBackRef}">↩</a>`

  md.renderer.rules.paragraph_open = (tokens, idx) => {
    let insideList = false
    for (let cursor = idx - 1; cursor >= 0; cursor -= 1) {
      if (tokens[cursor].type === 'list_item_open') { insideList = true; break }
      if (['list_item_close', 'bullet_list_close', 'ordered_list_close'].includes(tokens[cursor].type)) break
    }
    return `<p style="${insideList ? styles.liParagraph : styles.p}">`
  }
  md.renderer.rules.paragraph_close = () => '</p>\n'
  md.renderer.rules.heading_open = (tokens, idx) => `<${tokens[idx].tag} style="${styles[tokens[idx].tag] || ''}">`
  md.renderer.rules.heading_close = (tokens, idx) => `</${tokens[idx].tag}>\n`
  for (const [open, close, tag, key] of [
    ['strong_open', 'strong_close', 'strong', 'strong'], ['em_open', 'em_close', 'em', 'em'],
    ['s_open', 's_close', 's', 's']
  ]) {
    md.renderer.rules[open] = () => `<${tag} style="${styles[key]}">`
    md.renderer.rules[close] = () => `</${tag}>`
  }
  md.renderer.rules.code_inline = (tokens, idx) => `<code style="${styles.inlineCode}">${md.utils.escapeHtml(tokens[idx].content)}</code>`
  md.renderer.rules.code_block = (tokens, idx) => `<pre style="${styles.codeblock}"><code>${md.utils.escapeHtml(tokens[idx].content)}</code></pre>\n`
  md.renderer.rules.blockquote_open = () => `<blockquote style="${styles.blockquote}">`
  md.renderer.rules.blockquote_close = () => '</blockquote>\n'
  md.renderer.rules.bullet_list_open = () => `<ul style="${styles.ul}">\n`
  md.renderer.rules.bullet_list_close = () => '</ul>\n'
  md.renderer.rules.ordered_list_open = () => `<ol style="${styles.ol}">\n`
  md.renderer.rules.ordered_list_close = () => '</ol>\n'
  md.renderer.rules.list_item_open = () => `<li style="${styles.li}">`
  md.renderer.rules.list_item_close = () => '</li>\n'
  md.renderer.rules.hr = () => `<div style="${styles.hr}"></div>\n`
  md.renderer.rules.table_open = () => `<table style="${styles.table}">\n`
  md.renderer.rules.table_close = () => '</table>\n'
  md.renderer.rules.th_open = () => `<th style="${styles.th}">`
  md.renderer.rules.th_close = () => '</th>\n'
  md.renderer.rules.td_open = () => `<td style="${styles.td}">`
  md.renderer.rules.td_close = () => '</td>\n'
  md.renderer.rules.image = (tokens, idx) => `<img src="${escapeAttr(tokens[idx].attrGet('src') || '')}" alt="${md.utils.escapeHtml(tokens[idx].content || '')}" style="${styles.img}" />`
  md.renderer.rules.link_open = (tokens, idx) => `<a href="${escapeAttr(tokens[idx].attrGet('href') || '')}" style="${styles.a}">`
  md.renderer.rules.link_close = () => '</a>'
  return md
}

function fallback(text) {
  return `<pre>${String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`
}

function render(text, styles) {
  return createMarkdownRenderer(styles).render(normalizePunctuation(text))
}

export function formatText(text, settings, templateId = 'classic') {
  const styles = createArticleStyles(settings, templateId)
  try {
    return `<section style="${styles.section}">\n${render(text, styles)}</section>`
  } catch (error) {
    console.error('[mdpress] formatText error:', error)
    return `<section style="${styles.section}">${fallback(text)}</section>`
  }
}

export function renderWithStyles(text, styleMap) {
  try { return render(text, styleMap) } catch (error) {
    console.error('[mdpress] renderWithStyles error:', error)
    return fallback(text)
  }
}

const EMPTY_STYLES = new Proxy({}, { get: () => '' })

export function renderPlain(text) {
  try { return render(text, EMPTY_STYLES) } catch (error) {
    console.error('[mdpress] renderPlain error:', error)
    return fallback(text)
  }
}

export default { formatText, renderWithStyles, renderPlain }
