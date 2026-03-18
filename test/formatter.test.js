/**
 * formatter.js 单元测试
 */
import { describe, it, expect } from 'vitest'
import { formatText, inlineStyles } from '../src/utils/formatter.js'
import { defaultArticleStyleSettings } from '../src/utils/config.js'

describe('formatter.js', () => {
  describe('formatText', () => {
    it('应该正确渲染标题', () => {
      const markdown = '# 一级标题\n## 二级标题\n### 三级标题'
      const result = formatText(markdown, defaultArticleStyleSettings)

      expect(result).toContain('<h1')
      expect(result).toContain('一级标题')
      expect(result).toContain('<h2')
      expect(result).toContain('二级标题')
      expect(result).toContain('<h3')
      expect(result).toContain('三级标题')
    })

    it('应该正确渲染段落', () => {
      const markdown = '这是一个段落。\n\n这是另一个段落。'
      const result = formatText(markdown, defaultArticleStyleSettings)

      expect(result).toContain('<p')
      expect(result).toContain('这是一个段落')
      expect(result).toContain('这是另一个段落')
    })

    it('应该正确渲染粗体和斜体', () => {
      const markdown = '**粗体文本** 和 *斜体文本*'
      const result = formatText(markdown, defaultArticleStyleSettings)

      expect(result).toContain('<strong')
      expect(result).toContain('粗体文本')
      expect(result).toContain('<em')
      expect(result).toContain('斜体文本')
    })

    it('应该正确渲染列表', () => {
      const markdown = '- 项目1\n- 项目2\n- 项目3'
      const result = formatText(markdown, defaultArticleStyleSettings)

      expect(result).toContain('<ul')
      expect(result).toContain('<li')
      expect(result).toMatch(/项目\s*1/)
      expect(result).toMatch(/项目\s*2/)
      expect(result).toMatch(/项目\s*3/)
    })

    it('应该正确渲染有序列表', () => {
      const markdown = '1. 第一项\n2. 第二项\n3. 第三项'
      const result = formatText(markdown, defaultArticleStyleSettings)

      expect(result).toContain('<ol')
      expect(result).toContain('<li')
      expect(result).toContain('第一项')
      expect(result).toContain('第二项')
    })

    it('应该正确渲染引用块', () => {
      const markdown = '> 这是一个引用'
      const result = formatText(markdown, defaultArticleStyleSettings)

      expect(result).toContain('<blockquote')
      expect(result).toContain('这是一个引用')
    })

    it('应该正确渲染行内代码', () => {
      const markdown = '这是 `行内代码` 示例'
      const result = formatText(markdown, defaultArticleStyleSettings)

      expect(result).toContain('<code')
      expect(result).toContain('行内代码')
    })

    it('应该正确渲染代码块', () => {
      const markdown = '```javascript\nconst x = 1;\n```'
      const result = formatText(markdown, defaultArticleStyleSettings)

      expect(result).toContain('<pre')
      expect(result).toContain('<code')
      expect(result).toContain('const')
    })

    it('应该正确渲染链接', () => {
      const markdown = '[链接文本](https://example.com)'
      const result = formatText(markdown, defaultArticleStyleSettings)

      expect(result).toContain('<a')
      expect(result).toContain('href="https://example.com"')
      expect(result).toContain('链接文本')
    })

    it('应该正确渲染分割线', () => {
      const markdown = '---'
      const result = formatText(markdown, defaultArticleStyleSettings)

      expect(result).toContain('<div')
      expect(result).toContain('style=')
    })

    it('应该正确应用自定义样式设置', () => {
      const customSettings = {
        ...defaultArticleStyleSettings,
        fontSize: 18,
        textColor: '#ff0000',
        accentColor: '#00ff00'
      }
      const markdown = '# 标题\n\n**粗体**'
      const result = formatText(markdown, customSettings)

      expect(result).toContain('font-size: 18px')
      expect(result).toContain('#ff0000')
      expect(result).toContain('#00ff00')
    })

    it('应该正确处理首行缩进设置', () => {
      const settingsWithIndent = {
        ...defaultArticleStyleSettings,
        textIndent: true
      }
      const markdown = '这是一个段落'
      const result = formatText(markdown, settingsWithIndent)

      expect(result).toContain('text-indent: 2em')
    })

    it('应该正确处理空内容', () => {
      const result = formatText('', defaultArticleStyleSettings)

      expect(result).toContain('<section')
      expect(result).toBeTruthy()
    })

    it('应该正确渲染表格', () => {
      const markdown = '| 列1 | 列2 |\n| --- | --- |\n| 值1 | 值2 |'
      const result = formatText(markdown, defaultArticleStyleSettings)

      expect(result).toContain('<table')
      expect(result).toContain('<th')
      expect(result).toContain('<td')
      expect(result).toMatch(/列\s*1/)
      expect(result).toMatch(/值\s*1/)
    })

    it('应该正确渲染任务列表', () => {
      const markdown = '- [ ] 未完成任务\n- [x] 已完成任务'
      const result = formatText(markdown, defaultArticleStyleSettings)

      expect(result).toContain('未完成任务')
      expect(result).toContain('已完成任务')
    })
  })

  describe('inlineStyles', () => {
    it('应该直接返回HTML内容', () => {
      const html = '<p>测试内容</p>'
      const result = inlineStyles(html)

      expect(result).toBe(html)
    })
  })
})
