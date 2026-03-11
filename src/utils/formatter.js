/**
 * 排版格式化引擎
 * 使用 markdown-it 解析 Markdown，通过自定义 renderer 注入内联样式
 * 集成 highlight.js 实现代码高亮
 */

import { normalizePunctuation } from './punctuation.js'
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

/**
 * 生成样式对象
 */
function getStyles(settings) {
    return {
        // 外层容器
        section: `font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans SC', sans-serif; color: ${settings.textColor}; font-size: ${settings.fontSize}px; line-height: ${settings.lineHeight}; letter-spacing: ${settings.letterSpacing}px;`,
        // 标题
        h1: `font-size: 22px; font-weight: 700; color: ${settings.textColor}; margin-bottom: 24px; line-height: 1.4; text-align: center;`,
        h2: `font-size: 18px; font-weight: 600; color: ${settings.textColor}; margin: 24px 0 16px 0; padding-left: 12px; border-left: 4px solid ${settings.accentColor}; line-height: 1.5;`,
        h3: `font-size: 16px; font-weight: 600; color: ${settings.textColor}; margin: 20px 0 12px 0;`,
        // 段落
        p: `margin-bottom: ${settings.paragraphMargin}px; text-align: justify;${settings.textIndent ? ' text-indent: 2em;' : ''}`,
        // 引用
        blockquote: `background: #f7f7f8; border-left: 4px solid ${settings.accentColor}; padding: 16px 20px; margin: 20px 0; color: #595959; font-size: 14px; line-height: 1.8;`,
        // 代码块
        codeblock: `background: #1e1e1e; color: #d4d4d4; padding: 16px 20px; margin: 20px 0; border-radius: 8px; font-family: 'SF Mono', Menlo, Monaco, monospace; font-size: 13px; line-height: 1.6; overflow-x: auto; white-space: pre-wrap;`,
        // 行内代码
        inlineCode: `background: #f3f4f6; color: #e83e8c; padding: 2px 6px; border-radius: 4px; font-family: Menlo, Monaco, monospace; font-size: 0.9em;`,
        // 分割线
        hr: `width: 100%; height: 1px; background-color: ${settings.accentColor}; margin: 24px 0; border: none;`,
        // 列表
        ul: `margin: 16px 0; padding-left: 24px;`,
        ol: `margin: 16px 0; padding-left: 24px;`,
        li: `margin-bottom: 4px; color: ${settings.textColor};`,
        // 列表项内的段落（去掉额外 margin）
        liParagraph: `margin: 0; text-align: justify;${settings.textIndent ? ' text-indent: 2em;' : ''}`,
        // 粗体
        strong: `color: ${settings.accentColor}; font-weight: 700;`,
        // 斜体
        em: `font-style: italic;`,
        // 表格
        table: `width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;`,
        th: `background: ${settings.accentColor}15; padding: 12px 16px; border: 1px solid #e5e5e5; text-align: left; font-weight: 600;`,
        td: `padding: 12px 16px; border: 1px solid #e5e5e5;`,
        // 图片
        img: `max-width: 100%; border-radius: 8px; margin: 16px auto; display: block;`,
        // 链接
        a: `color: ${settings.accentColor}; text-decoration: underline; word-break: break-all;`,
        // 任务列表
        taskList: `list-style: none; padding-left: 0; margin: 16px 0;`,
        taskListItem: `margin-bottom: 8px; display: flex; align-items: flex-start; gap: 8px;`,
        checkbox: `width: 16px; height: 16px; margin-top: 3px; flex-shrink: 0; accent-color: ${settings.accentColor};`,
        // 删除线
        s: `text-decoration: line-through; color: #999;`,
        // 脚注
        footnoteRef: `font-size: 0.75em; vertical-align: super; line-height: 0; color: ${settings.accentColor}; text-decoration: none; font-weight: 600;`,
        footnoteSection: `margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e5e5; font-size: 13px; color: #8c8c8c; line-height: 1.6;`,
        footnoteItem: `margin-bottom: 6px;`,
        footnoteBackRef: `font-size: 0.85em; color: ${settings.accentColor}; text-decoration: none; margin-left: 4px;`,
    }
}

/**
 * 创建配置了自定义 renderer 的 markdown-it 实例
 */
function createRenderer(settings) {
    const styles = getStyles(settings)

    const md = new MarkdownIt({
        html: false,
        breaks: false,
        linkify: true,
        typographer: false,
        highlight: function (str, lang) {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    const highlighted = hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
                    return `<pre style="${styles.codeblock}"><code>${highlighted}</code></pre>`
                } catch (_) { /* fall through */ }
            }
            // 自动检测语言
            try {
                const result = hljs.highlightAuto(str)
                if (result.relevance > 5) {
                    return `<pre style="${styles.codeblock}"><code>${result.value}</code></pre>`
                }
            } catch (_) { /* fall through */ }
            // 回退：无高亮
            const escaped = md.utils.escapeHtml(str)
            return `<pre style="${styles.codeblock}"><code>${escaped}</code></pre>`
        }
    })

    // 启用任务列表插件
    md.use(taskLists, { enabled: true, label: false })

    // 启用脚注插件
    md.use(footnotePlugin)

    // --- 自定义 Footnote Renderers ---
    md.renderer.rules.footnote_ref = (tokens, idx) => {
        const n = Number(tokens[idx].meta.id + 1)
        let id = 'fn' + n
        if (tokens[idx].meta.subId > 0) id += ':' + tokens[idx].meta.subId
        return `<sup><a href="#${id}" id="fnref${n}" style="${styles.footnoteRef}">[${n}]</a></sup>`
    }

    md.renderer.rules.footnote_block_open = () =>
        `<section style="${styles.footnoteSection}">\n<ol style="padding-left: 20px; margin: 0;">\n`

    md.renderer.rules.footnote_block_close = () =>
        '</ol>\n</section>\n'

    md.renderer.rules.footnote_open = (tokens, idx) => {
        const n = Number(tokens[idx].meta.id + 1)
        return `<li id="fn${n}" style="${styles.footnoteItem}">`
    }

    md.renderer.rules.footnote_close = () => '</li>\n'

    md.renderer.rules.footnote_anchor = (tokens, idx) => {
        const n = Number(tokens[idx].meta.id + 1)
        return ` <a href="#fnref${n}" style="${styles.footnoteBackRef}">↩</a>`
    }

    // --- 自定义 Renderer Rules ---

    // 段落（判断是否在列表项内，在列表项内时去掉多余 margin）
    md.renderer.rules.paragraph_open = (tokens, idx) => {
        // 向前查找，判断是否嵌套在 list_item 内
        let isInsideListItem = false
        for (let i = idx - 1; i >= 0; i--) {
            if (tokens[i].type === 'list_item_open') {
                isInsideListItem = true
                break
            }
            if (tokens[i].type === 'list_item_close' || tokens[i].type === 'bullet_list_close' || tokens[i].type === 'ordered_list_close') {
                break
            }
        }
        const style = isInsideListItem ? styles.liParagraph : styles.p
        return `<p style="${style}">`
    }
    md.renderer.rules.paragraph_close = () => '</p>\n'

    // 标题
    md.renderer.rules.heading_open = (tokens, idx) => {
        const tag = tokens[idx].tag
        const style = styles[tag] || ''
        return `<${tag} style="${style}">`
    }
    md.renderer.rules.heading_close = (tokens, idx) => {
        const tag = tokens[idx].tag
        return `</${tag}>\n`
    }

    // 粗体
    md.renderer.rules.strong_open = () => `<strong style="${styles.strong}">`
    md.renderer.rules.strong_close = () => '</strong>'

    // 斜体
    md.renderer.rules.em_open = () => `<em style="${styles.em}">`
    md.renderer.rules.em_close = () => '</em>'

    // 行内代码
    md.renderer.rules.code_inline = (tokens, idx) => {
        const content = md.utils.escapeHtml(tokens[idx].content)
        return `<code style="${styles.inlineCode}">${content}</code>`
    }

    // 代码块（fence 已由 highlight 选项处理，这里处理 code_block 类型）
    md.renderer.rules.code_block = (tokens, idx) => {
        const content = md.utils.escapeHtml(tokens[idx].content)
        return `<pre style="${styles.codeblock}"><code>${content}</code></pre>\n`
    }

    // 引用块
    md.renderer.rules.blockquote_open = () => `<blockquote style="${styles.blockquote}">`
    md.renderer.rules.blockquote_close = () => '</blockquote>\n'

    // 无序列表
    md.renderer.rules.bullet_list_open = () => `<ul style="${styles.ul}">\n`
    md.renderer.rules.bullet_list_close = () => '</ul>\n'

    // 有序列表
    md.renderer.rules.ordered_list_open = () => `<ol style="${styles.ol}">\n`
    md.renderer.rules.ordered_list_close = () => '</ol>\n'

    // 列表项
    md.renderer.rules.list_item_open = () => `<li style="${styles.li}">`
    md.renderer.rules.list_item_close = () => '</li>\n'

    // 分割线
    md.renderer.rules.hr = () => `<div style="${styles.hr}"></div>\n`

    // 表格
    md.renderer.rules.table_open = () => `<table style="${styles.table}">\n`
    md.renderer.rules.table_close = () => '</table>\n'
    md.renderer.rules.th_open = () => `<th style="${styles.th}">`
    md.renderer.rules.th_close = () => '</th>\n'
    md.renderer.rules.td_open = () => `<td style="${styles.td}">`
    md.renderer.rules.td_close = () => '</td>\n'

    // 图片
    md.renderer.rules.image = (tokens, idx) => {
        const token = tokens[idx]
        const src = token.attrGet('src') || ''
        const alt = md.utils.escapeHtml(token.content || '')
        return `<img src="${src}" alt="${alt}" style="${styles.img}" />`
    }

    // 链接
    md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
        const href = tokens[idx].attrGet('href') || ''
        return `<a href="${href}" style="${styles.a}">`
    }
    md.renderer.rules.link_close = () => '</a>'

    // 删除线
    md.renderer.rules.s_open = () => `<s style="${styles.s}">`
    md.renderer.rules.s_close = () => '</s>'

    return md
}

/**
 * 主格式化函数：Markdown → 带内联样式的 HTML
 */
export function formatText(text, settings) {
    const normalized = normalizePunctuation(text)
    const md = createRenderer(settings)
    const bodyHtml = md.render(normalized)

    // 包裹在 section 容器中
    const sectionStyle = getStyles(settings).section
    return `<section style="${sectionStyle}">\n${bodyHtml}</section>`
}

/**
 * CSS 内联（已经是内联样式，直接返回）
 */
export function inlineStyles(html) {
    return html
}

export default { formatText, inlineStyles }
