/**
 * 标点符号标准化
 * 将西式标点转换为中文出版规范标点
 */

// 引号转换：弯引号 → 直角引号
export function normalizeQuotes(text) {
    // 英文双引号
    let result = text.replace(/"([^""]*)"/g, '「$1」')
    // 英文单引号（嵌套引号）
    result = result.replace(/'([^'']*)'(?=[^a-zA-Z]|$)/g, '『$1』')
    // 中文弯引号
    result = result.replace(/[""]([^""]*)[""]/g, '「$1」')
    result = result.replace(/['']([^'']*)[''](?=[^a-zA-Z]|$)/g, '『$1』')
    return result
}

// 省略号标准化：... → ……
export function normalizeEllipsis(text) {
    return text.replace(/\.{3,}/g, '……').replace(/。{2,}/g, '……')
}

// 破折号标准化：-- → —— （但保留 Markdown 分割线语法）
export function normalizeDash(text) {
    // 不转换独立一行的 --- 或表格分隔符 | --- |
    // 只处理行内的双破折号
    return text.split('\n').map(line => {
        const trimmed = line.trim()
        // 跳过 Markdown 分割线（独立一行的 ---）
        if (/^[-*_]{3,}$/.test(trimmed)) {
            return line
        }
        // 跳过表格分隔行
        if (/^\|.*\|$/.test(trimmed) && trimmed.includes('---')) {
            return line
        }
        // 其他情况转换双破折号为中文破折号
        return line.replace(/(?<!\|[\s-]*)--(?![-\s]*\|)/g, '——')
    }).join('\n')
}

// 全角半角空格规范
export function normalizeSpaces(text) {
    // 中英文之间添加空格
    let result = text.replace(/([\u4e00-\u9fa5])([a-zA-Z0-9])/g, '$1 $2')
    result = result.replace(/([a-zA-Z0-9])([\u4e00-\u9fa5])/g, '$1 $2')
    // 移除多余空格
    result = result.replace(/  +/g, ' ')
    return result
}

// 综合标点规范化
export function normalizePunctuation(text) {
    let result = text
    result = normalizeQuotes(result)
    result = normalizeEllipsis(result)
    result = normalizeDash(result)
    result = normalizeSpaces(result)
    return result
}

export default normalizePunctuation
