/**
 * 排版格式化引擎
 * 将 Markdown 文本转换为符合公众号规范的 HTML
 */

import { normalizePunctuation } from './punctuation.js'

/**
 * 解析 Markdown 文本结构
 */
function parseStructure(text) {
    const lines = text.split('\n')
    const blocks = []
    let inCodeBlock = false
    let codeBlockContent = []
    let inTable = false
    let tableRows = []

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const trimmed = line.trim()

        // 代码块处理
        if (trimmed.startsWith('```')) {
            if (inCodeBlock) {
                // 结束代码块
                blocks.push({ type: 'codeblock', content: codeBlockContent.join('\n') })
                codeBlockContent = []
                inCodeBlock = false
            } else {
                // 开始代码块
                inCodeBlock = true
            }
            continue
        }

        if (inCodeBlock) {
            codeBlockContent.push(line)
            continue
        }

        // 表格处理
        if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
            if (!inTable) {
                inTable = true
                tableRows = []
            }
            // 跳过分隔行：匹配 | --- | --- | 或 |:---:|:---:| 等格式
            const isSeparator = /^\|(\s*:?-+:?\s*\|)+$/.test(trimmed)
            if (!isSeparator) {
                const cells = trimmed.slice(1, -1).split('|').map(c => c.trim())
                tableRows.push(cells)
            }
            continue
        } else if (inTable) {
            // 表格结束
            blocks.push({ type: 'table', content: tableRows })
            tableRows = []
            inTable = false
        }

        // 空行跳过
        if (!trimmed) continue

        // 分割线（独立一行的 --- 或 *** 或 ___，至少3个字符）
        if (/^-{3,}$/.test(trimmed) || /^\*{3,}$/.test(trimmed) || /^_{3,}$/.test(trimmed)) {
            blocks.push({ type: 'hr', content: '' })
            continue
        }
        // H1 标题
        else if (trimmed.startsWith('# ')) {
            blocks.push({ type: 'h1', content: trimmed.slice(2) })
        }
        // H2 标题
        else if (trimmed.startsWith('## ')) {
            blocks.push({ type: 'h2', content: trimmed.slice(3) })
        }
        // H3 标题
        else if (trimmed.startsWith('### ')) {
            blocks.push({ type: 'h3', content: trimmed.slice(4) })
        }
        // 引用块
        else if (trimmed.startsWith('> ')) {
            blocks.push({ type: 'blockquote', content: trimmed.slice(2) })
        }
        // 待办事项（已完成）
        else if (trimmed.startsWith('- [x] ') || trimmed.startsWith('- [X] ')) {
            blocks.push({ type: 'todo-done', content: trimmed.slice(6) })
        }
        // 待办事项（未完成）
        else if (trimmed.startsWith('- [ ] ')) {
            blocks.push({ type: 'todo', content: trimmed.slice(6) })
        }
        // 无序列表
        else if (/^[-*]\s/.test(trimmed)) {
            blocks.push({ type: 'li', content: trimmed.slice(2) })
        }
        // 有序列表
        else if (/^\d+\.\s/.test(trimmed)) {
            blocks.push({ type: 'oli', content: trimmed.replace(/^\d+\.\s/, '') })
        }
        // 金句（特殊格式）
        else if ((trimmed.includes('【') || trimmed.includes('「')) && trimmed.length < 50) {
            blocks.push({ type: 'highlight', content: trimmed })
        }
        // 普通段落
        else {
            blocks.push({ type: 'p', content: trimmed })
        }
    }

    // 处理未结束的代码块
    if (inCodeBlock && codeBlockContent.length > 0) {
        blocks.push({ type: 'codeblock', content: codeBlockContent.join('\n') })
    }

    // 处理未结束的表格
    if (inTable && tableRows.length > 0) {
        blocks.push({ type: 'table', content: tableRows })
    }

    return blocks
}

/**
 * 处理内联格式：粗体、斜体、行内代码等
 */
function formatInline(text, accentColor) {
    let result = text

    // 行内代码 `code`
    result = result.replace(/`([^`]+)`/g,
        '<code style="background: #f3f4f6; color: #e83e8c; padding: 2px 6px; border-radius: 4px; font-family: Menlo, Monaco, monospace; font-size: 0.9em;">$1</code>')

    // 粗体 **text**
    result = result.replace(/\*\*([^*]+)\*\*/g,
        `<strong style="color: ${accentColor}; font-weight: 700;">$1</strong>`)

    // 斜体 *text*
    result = result.replace(/\*([^*]+)\*/g,
        '<em style="font-style: italic;">$1</em>')

    // 高亮百分比数字
    result = result.replace(/(\d+\.?\d*%)/g,
        `<span style="color: ${accentColor}; font-weight: 600;">$1</span>`)

    return result
}

/**
 * 生成内联样式的 HTML
 */
export function formatText(text, settings) {
    const normalized = normalizePunctuation(text)
    const blocks = parseStructure(normalized)

    // 样式定义
    const styles = {
        base: `font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans SC', sans-serif; color: ${settings.textColor}; font-size: ${settings.fontSize}px; line-height: ${settings.lineHeight}; letter-spacing: ${settings.letterSpacing}px;`,
        h1: `font-size: 22px; font-weight: 700; color: ${settings.textColor}; margin-bottom: 24px; line-height: 1.4; text-align: center;`,
        h2: `font-size: 18px; font-weight: 600; color: ${settings.textColor}; margin: 24px 0 16px 0; padding-left: 12px; border-left: 4px solid ${settings.accentColor}; line-height: 1.5;`,
        h3: `font-size: 16px; font-weight: 600; color: ${settings.textColor}; margin: 20px 0 12px 0;`,
        p: `margin-bottom: ${settings.paragraphMargin}px; text-align: justify;`,
        blockquote: `background: #f7f7f8; border-left: 4px solid ${settings.accentColor}; padding: 16px 20px; margin: 20px 0; color: #595959; font-size: 14px; line-height: 1.8;`,
        codeblock: `background: #1e1e1e; color: #d4d4d4; padding: 16px 20px; margin: 20px 0; border-radius: 8px; font-family: 'SF Mono', Menlo, Monaco, monospace; font-size: 13px; line-height: 1.6; overflow-x: auto; white-space: pre-wrap;`,
        hr: `width: 100%; height: 1px; background-color: ${settings.accentColor}; margin: 24px 0; border: none;`,
        highlight: `background: linear-gradient(to right, ${settings.accentColor}15, ${settings.accentColor}08); padding: 16px 20px; margin: 20px 0; border-radius: 8px; font-size: 15px; line-height: 1.8; color: ${settings.textColor};`,
        table: `width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;`,
        th: `background: ${settings.accentColor}15; padding: 12px 16px; border: 1px solid #e5e5e5; text-align: left; font-weight: 600;`,
        td: `padding: 12px 16px; border: 1px solid #e5e5e5;`,
        todo: `display: flex; align-items: flex-start; gap: 8px; margin-bottom: 8px;`,
        todoBox: `width: 16px; height: 16px; border: 2px solid ${settings.accentColor}; border-radius: 3px; margin-top: 3px; flex-shrink: 0;`,
        todoBoxDone: `width: 16px; height: 16px; background: ${settings.accentColor}; border: 2px solid ${settings.accentColor}; border-radius: 3px; margin-top: 3px; flex-shrink: 0; position: relative;`
    }

    let html = `<section style="${styles.base}">\n`
    let inList = false
    let listType = null

    blocks.forEach((block, index) => {
        // 处理列表
        if (block.type === 'li' || block.type === 'oli') {
            if (!inList) {
                inList = true
                listType = block.type === 'li' ? 'ul' : 'ol'
                html += `<${listType} style="margin: 16px 0; padding-left: 24px;">\n`
            }
            const content = formatInline(block.content, settings.accentColor)
            html += `  <li style="margin-bottom: 8px; color: ${settings.textColor};">${content}</li>\n`

            const nextBlock = blocks[index + 1]
            if (!nextBlock || (nextBlock.type !== 'li' && nextBlock.type !== 'oli')) {
                html += `</${listType}>\n`
                inList = false
                listType = null
            }
            return
        }

        // 关闭之前的列表
        if (inList) {
            html += `</${listType}>\n`
            inList = false
            listType = null
        }

        const content = block.type !== 'table' && block.type !== 'codeblock'
            ? formatInline(block.content, settings.accentColor)
            : block.content

        switch (block.type) {
            case 'h1':
                html += `<h1 style="${styles.h1}">${content}</h1>\n`
                break
            case 'h2':
                html += `<h2 style="${styles.h2}">${content}</h2>\n`
                break
            case 'h3':
                html += `<h3 style="${styles.h3}">${content}</h3>\n`
                break
            case 'blockquote':
                html += `<blockquote style="${styles.blockquote}">${content}</blockquote>\n`
                break
            case 'codeblock':
                const escapedCode = escapeHtml(content)
                html += `<pre style="${styles.codeblock}">${escapedCode}</pre>\n`
                break
            case 'hr':
                html += `<div style="${styles.hr}"></div>\n`
                break
            case 'highlight':
                html += `<div style="${styles.highlight}">${content}</div>\n`
                break
            case 'table':
                html += `<table style="${styles.table}">\n`
                block.content.forEach((row, rowIdx) => {
                    html += '  <tr>\n'
                    row.forEach(cell => {
                        const cellStyle = rowIdx === 0 ? styles.th : styles.td
                        const tag = rowIdx === 0 ? 'th' : 'td'
                        const cellContent = formatInline(cell, settings.accentColor)
                        html += `    <${tag} style="${cellStyle}">${cellContent}</${tag}>\n`
                    })
                    html += '  </tr>\n'
                })
                html += '</table>\n'
                break
            case 'todo':
                html += `<div style="${styles.todo}"><div style="${styles.todoBox}"></div><span>${content}</span></div>\n`
                break
            case 'todo-done':
                html += `<div style="${styles.todo}"><div style="${styles.todoBoxDone}"><svg viewBox="0 0 12 12" width="12" height="12" style="position:absolute;left:0;top:0;"><path fill="white" d="M10 3L4.5 8.5 2 6" stroke="white" stroke-width="2" fill="none"/></svg></div><span style="text-decoration: line-through; opacity: 0.6;">${content}</span></div>\n`
                break
            default:
                html += `<p style="${styles.p}">${content}</p>\n`
        }
    })

    // 关闭未结束的列表
    if (inList) {
        html += `</${listType}>\n`
    }

    html += '</section>'
    return html
}

function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/\n/g, '<br>')
}

/**
 * CSS 内联（已经是内联样式，直接返回）
 */
export function inlineStyles(html) {
    return html
}

export default { formatText, inlineStyles }
