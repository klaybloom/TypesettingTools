/**
 * 统一配置文件
 * 所有默认设置的唯一来源 (Single Source of Truth)
 */

export const defaultArticleStyleSettings = {
    fontSize: 15,
    lineHeight: 1.75,
    letterSpacing: 0.5,
    textColor: '#262626',
    accentColor: '#10a37f',
    paragraphMargin: 15,
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
        name: '经典绿',
        settings: { fontSize: 15, lineHeight: 1.75, letterSpacing: 0.5, textColor: '#262626', accentColor: '#10a37f', paragraphMargin: 15, textIndent: false }
    },
    {
        name: '科技蓝',
        settings: { fontSize: 15, lineHeight: 1.75, letterSpacing: 0.5, textColor: '#262626', accentColor: '#1a73e8', paragraphMargin: 15, textIndent: false }
    },
    {
        name: '浅薄紫',
        settings: { fontSize: 16, lineHeight: 1.8, letterSpacing: 0.5, textColor: '#3f3f3f', accentColor: '#7c3aed', paragraphMargin: 16, textIndent: true }
    },
    {
        name: '暖橙调',
        settings: { fontSize: 15, lineHeight: 1.75, letterSpacing: 0.5, textColor: '#3f3f3f', accentColor: '#ff6b35', paragraphMargin: 15, textIndent: false }
    },
    {
        name: '知乎体',
        settings: { fontSize: 16, lineHeight: 2.0, letterSpacing: 0.5, textColor: '#262626', accentColor: '#0066ff', paragraphMargin: 18, textIndent: true }
    },
    {
        name: '商务灰',
        settings: { fontSize: 15, lineHeight: 1.8, letterSpacing: 0.3, textColor: '#333333', accentColor: '#5a5a5a', paragraphMargin: 14, textIndent: false }
    },
    {
        name: '森林绿',
        settings: { fontSize: 15, lineHeight: 1.75, letterSpacing: 0.5, textColor: '#2d3436', accentColor: '#00b894', paragraphMargin: 15, textIndent: false }
    },
    {
        name: '樱花粉',
        settings: { fontSize: 16, lineHeight: 1.85, letterSpacing: 0.6, textColor: '#4a4a4a', accentColor: '#fd79a8', paragraphMargin: 16, textIndent: true }
    },
    {
        name: '深海蓝',
        settings: { fontSize: 15, lineHeight: 1.75, letterSpacing: 0.4, textColor: '#2c3e50', accentColor: '#0984e3', paragraphMargin: 15, textIndent: false }
    },
    {
        name: '琥珀橙',
        settings: { fontSize: 15, lineHeight: 1.8, letterSpacing: 0.5, textColor: '#3f3f3f', accentColor: '#e17055', paragraphMargin: 15, textIndent: false }
    },
    {
        name: '薄荷绿',
        settings: { fontSize: 16, lineHeight: 1.85, letterSpacing: 0.5, textColor: '#2d3436', accentColor: '#55efc4', paragraphMargin: 16, textIndent: false }
    },
    {
        name: '葡萄紫',
        settings: { fontSize: 15, lineHeight: 1.75, letterSpacing: 0.5, textColor: '#2d3436', accentColor: '#6c5ce7', paragraphMargin: 15, textIndent: false }
    },
    {
        name: '夕阳红',
        settings: { fontSize: 16, lineHeight: 1.9, letterSpacing: 0.6, textColor: '#3f3f3f', accentColor: '#d63031', paragraphMargin: 17, textIndent: true }
    }
]

export default defaultArticleStyleSettings
