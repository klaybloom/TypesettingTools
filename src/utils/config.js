/**
 * 统一配置文件
 * 所有默认设置的唯一来源 (Single Source of Truth)
 */

export const defaultArticleStyleSettings = {
    fontSize: 15,
    lineHeight: 1.8,
    letterSpacing: 0.5,
    textColor: '#2B2B2B',
    accentColor: '#1F7A62',
    paragraphMargin: 16,
    textIndent: false
}

// 推荐颜色
export const textColors = [
    { name: '深墨', value: '#262626' },
    { name: '墨灰', value: '#3f3f3f' },
    { name: '炭灰', value: '#595959' },
    { name: '中灰', value: '#8c8c8c' }
]

export const accentColors = [
    { name: '翡翠绿', value: '#10a37f' },
    { name: '科技蓝', value: '#1a73e8' },
    { name: '活力橙', value: '#ff6b35' },
    { name: '优雅紫', value: '#7c3aed' },
    { name: '玫瑰红', value: '#e11d48' }
]

// 文章样式预设
export const articleStylePresets = [
    {
        name: '经典公号',
        settings: { fontSize: 15, lineHeight: 1.8, letterSpacing: 0.5, textColor: '#2B2B2B', accentColor: '#1F7A62', paragraphMargin: 16, textIndent: false }
    },
    {
        name: '优雅专栏',
        settings: { fontSize: 16, lineHeight: 1.92, letterSpacing: 0.6, textColor: '#4A4037', accentColor: '#B86A4B', paragraphMargin: 18, textIndent: true }
    },
    {
        name: '极简说明',
        settings: { fontSize: 15, lineHeight: 1.72, letterSpacing: 0.3, textColor: '#1F2937', accentColor: '#4F6B95', paragraphMargin: 14, textIndent: false }
    },
    {
        name: '教程手册',
        settings: { fontSize: 15, lineHeight: 1.86, letterSpacing: 0.4, textColor: '#243240', accentColor: '#C06B2D', paragraphMargin: 17, textIndent: false }
    }
]

export default defaultArticleStyleSettings
