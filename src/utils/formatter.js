/**
 * 排版格式化引擎
 * 使用 markdown-it 解析 Markdown，通过自定义 renderer 注入内联样式
 * 集成 highlight.js 实现代码高亮
 */

import { normalizePunctuation } from './punctuation.js'
import { createArticleStyles } from './articleStyle.js'
import MarkdownIt from 'markdown-it'
import taskLists from 'markdown-it-task-lists'
import footnotePlugin from 'markdown-it-footnote'
import hljs from 'highlight.js/lib/core'

// 按需注册常用语言（减小打包体积）
import javascript from 'highlight.js/lib/languages/javascript'
import python from 'highlight.js/lib/languages/python'
import css from 'highlight.js/lib/languages/css'
import xml from 'highlight.js/lib/languages/xml'
import json from 'highlight.js/lib/languages/json'
import bash from 'highlight.js/lib/languages/bash'
import typescript from 'highlight.js/lib/languages/typescript'
import java from 'highlight.js/lib/languages/java'
import sql from 'highlight.js/lib/languages/sql'
import markdown from 'highlight.js/lib/languages/markdown'
import go from 'highlight.js/lib/languages/go'
import swift from 'highlight.js/lib/languages/swift'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('js', javascript)
hljs.registerLanguage('python', python)
hljs.registerLanguage('py', python)
hljs.registerLanguage('css', css)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('json', json)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('sh', bash)
hljs.registerLanguage('shell', bash)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('ts', typescript)
hljs.registerLanguage('java', java)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('markdown', markdown)
hljs.registerLanguage('md', markdown)
hljs.registerLanguage('go', go)
hljs.registerLanguage('swift', swift)

// HTML 属性上下文转义：& < > " ' 全部 escape，避免属性闭合 / XSS
function escapeAttr(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
}

// 由当前 settings 派生的样式表；render 前由 formatText 写入，所有 renderer 通过闭包读取
let currentStyles = createArticleStyles({})

const md = new MarkdownIt({
    html: false,
    breaks: false,
    linkify: true,
    typographer: false,
    highlight(str, lang) {
        const style = currentStyles.codeblock || ''
        if (lang && hljs.getLanguage(lang)) {
            try {
                const highlighted = hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
                return `<pre style="${style}"><code>${highlighted}</code></pre>`
            } catch (_) { /* fall through */ }
        }
        try {
            const result = hljs.highlightAuto(str)
            if (result.relevance > 5) {
                return `<pre style="${style}"><code>${result.value}</code></pre>`
            }
        } catch (_) { /* fall through */ }
        return `<pre style="${style}"><code>${md.utils.escapeHtml(str)}</code></pre>`
    }
})

md.use(taskLists, { enabled: true, label: false })
md.use(footnotePlugin)

// --- Footnote renderers ---
md.renderer.rules.footnote_ref = (tokens, idx) => {
    const n = Number(tokens[idx].meta.id + 1)
    let id = 'fn' + n
    if (tokens[idx].meta.subId > 0) id += ':' + tokens[idx].meta.subId
    return `<sup><a href="#${id}" id="fnref${n}" style="${currentStyles.footnoteRef}">[${n}]</a></sup>`
}

md.renderer.rules.footnote_block_open = () =>
    `<section style="${currentStyles.footnoteSection}">\n<ol style="padding-left: 20px; margin: 0;">\n`

md.renderer.rules.footnote_block_close = () => '</ol>\n</section>\n'

md.renderer.rules.footnote_open = (tokens, idx) => {
    const n = Number(tokens[idx].meta.id + 1)
    return `<li id="fn${n}" style="${currentStyles.footnoteItem}">`
}

md.renderer.rules.footnote_close = () => '</li>\n'

md.renderer.rules.footnote_anchor = (tokens, idx) => {
    const n = Number(tokens[idx].meta.id + 1)
    return ` <a href="#fnref${n}" style="${currentStyles.footnoteBackRef}">↩</a>`
}

// --- Core block renderers ---
md.renderer.rules.paragraph_open = (tokens, idx) => {
    let isInsideListItem = false
    for (let i = idx - 1; i >= 0; i--) {
        if (tokens[i].type === 'list_item_open') {
            isInsideListItem = true
            break
        }
        if (
            tokens[i].type === 'list_item_close'
            || tokens[i].type === 'bullet_list_close'
            || tokens[i].type === 'ordered_list_close'
        ) break
    }
    const style = isInsideListItem ? currentStyles.liParagraph : currentStyles.p
    return `<p style="${style}">`
}
md.renderer.rules.paragraph_close = () => '</p>\n'

md.renderer.rules.heading_open = (tokens, idx) => {
    const tag = tokens[idx].tag
    const style = currentStyles[tag] || ''
    return `<${tag} style="${style}">`
}
md.renderer.rules.heading_close = (tokens, idx) => `</${tokens[idx].tag}>\n`

md.renderer.rules.strong_open = () => `<strong style="${currentStyles.strong}">`
md.renderer.rules.strong_close = () => '</strong>'

md.renderer.rules.em_open = () => `<em style="${currentStyles.em}">`
md.renderer.rules.em_close = () => '</em>'

md.renderer.rules.code_inline = (tokens, idx) => {
    const content = md.utils.escapeHtml(tokens[idx].content)
    return `<code style="${currentStyles.inlineCode}">${content}</code>`
}

md.renderer.rules.code_block = (tokens, idx) => {
    const content = md.utils.escapeHtml(tokens[idx].content)
    return `<pre style="${currentStyles.codeblock}"><code>${content}</code></pre>\n`
}

md.renderer.rules.blockquote_open = () => `<blockquote style="${currentStyles.blockquote}">`
md.renderer.rules.blockquote_close = () => '</blockquote>\n'

md.renderer.rules.bullet_list_open = () => `<ul style="${currentStyles.ul}">\n`
md.renderer.rules.bullet_list_close = () => '</ul>\n'

md.renderer.rules.ordered_list_open = () => `<ol style="${currentStyles.ol}">\n`
md.renderer.rules.ordered_list_close = () => '</ol>\n'

md.renderer.rules.list_item_open = () => `<li style="${currentStyles.li}">`
md.renderer.rules.list_item_close = () => '</li>\n'

md.renderer.rules.hr = () => `<div style="${currentStyles.hr}"></div>\n`

md.renderer.rules.table_open = () => `<table style="${currentStyles.table}">\n`
md.renderer.rules.table_close = () => '</table>\n'
md.renderer.rules.th_open = () => `<th style="${currentStyles.th}">`
md.renderer.rules.th_close = () => '</th>\n'
md.renderer.rules.td_open = () => `<td style="${currentStyles.td}">`
md.renderer.rules.td_close = () => '</td>\n'

md.renderer.rules.image = (tokens, idx) => {
    const token = tokens[idx]
    const src = escapeAttr(token.attrGet('src') || '')
    const alt = md.utils.escapeHtml(token.content || '')
    return `<img src="${src}" alt="${alt}" style="${currentStyles.img}" />`
}

md.renderer.rules.link_open = (tokens, idx) => {
    const href = escapeAttr(tokens[idx].attrGet('href') || '')
    return `<a href="${href}" style="${currentStyles.a}">`
}
md.renderer.rules.link_close = () => '</a>'

md.renderer.rules.s_open = () => `<s style="${currentStyles.s}">`
md.renderer.rules.s_close = () => '</s>'

/**
 * 主格式化函数：Markdown → 带内联样式的 HTML
 *
 * 协议过滤复用 markdown-it 默认的 validateLink（拦截 javascript: / vbscript: / file:，
 * 仅放行 http(s) / mailto / ftp / 安全 data:image URI），因此 href/src 已经是
 * "协议安全"的；这里只在写入 HTML 属性时再做一次 escape，防止属性闭合 / XSS。
 */
export function formatText(text, settings) {
    currentStyles = createArticleStyles(settings)
    const normalized = normalizePunctuation(text)
    const bodyHtml = md.render(normalized)
    return `<section style="${currentStyles.section}">\n${bodyHtml}</section>`
}

export default { formatText }
