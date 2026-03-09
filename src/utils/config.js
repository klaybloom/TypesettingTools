/**
 * 统一配置文件
 * 所有默认设置的唯一来源 (Single Source of Truth)
 */

export const defaultSettings = {
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

// 主题预设
export const themePresets = [
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
    }
]

export default defaultSettings
