import { describe, expect, it } from 'vitest'
import {
  normalizePunctuation,
  normalizeQuotes,
  normalizeEllipsis,
  normalizeDash,
  normalizeSpaces
} from '../src/utils/punctuation.js'

describe('punctuation', () => {
  describe('normalizeQuotes', () => {
    it('英文直引号双引号 → 「」', () => {
      expect(normalizeQuotes('他说"你好"。')).toBe('他说「你好」。')
    })

    it('英文直引号单引号 → 『』（但不误伤 it\'s）', () => {
      expect(normalizeQuotes("他写了 'hello' 。")).toBe('他写了 『hello』 。')
      // 缩写场景：右侧是字母则不替换
      expect(normalizeQuotes("it's a test")).toBe("it's a test")
    })

    it('中文弯引号 → 「」/『』', () => {
      expect(normalizeQuotes('他说“你好”。')).toBe('他说「你好」。')
    })
  })

  describe('normalizeEllipsis', () => {
    it('... → ……', () => {
      expect(normalizeEllipsis('等等...')).toBe('等等……')
    })

    it('连续句号 → ……', () => {
      expect(normalizeEllipsis('好的。。。')).toBe('好的……')
    })
  })

  describe('normalizeDash', () => {
    it('普通 -- → ——', () => {
      expect(normalizeDash('hello -- world')).toBe('hello —— world')
    })

    it('独立分割线不替换', () => {
      expect(normalizeDash('---')).toBe('---')
    })

    it('表格分隔行不替换', () => {
      expect(normalizeDash('| --- | --- |')).toBe('| --- | --- |')
    })
  })

  describe('normalizeSpaces', () => {
    it('中英文之间补空格', () => {
      expect(normalizeSpaces('中文English')).toBe('中文 English')
      expect(normalizeSpaces('English中文')).toBe('English 中文')
    })

    it('合并多余空格', () => {
      expect(normalizeSpaces('hello   world')).toBe('hello world')
    })
  })

  describe('normalizePunctuation 代码保护', () => {
    it('fenced code 内容不被改写', () => {
      const input = '说明\n```js\nconst s = "hello"; // -- comment\n```\n结束。'
      const result = normalizePunctuation(input)
      // fenced 块原样保留
      expect(result).toContain('const s = "hello"; // -- comment')
    })

    it('inline code 内容不被改写', () => {
      const input = '使用 `const a = "x"` 这样写。'
      const result = normalizePunctuation(input)
      expect(result).toContain('`const a = "x"`')
    })

    it('代码外的标点正常被规范化', () => {
      const input = '看代码 `let x = 1` 之后说 "结束" --- 完成。'
      const result = normalizePunctuation(input)
      expect(result).toContain('`let x = 1`')
      // 代码块外的直引号被转换
      expect(result).toContain('「结束」')
    })

    it('代码块中的中英文邻接不会被加空格', () => {
      const input = '```\n中文Hello\n```'
      const result = normalizePunctuation(input)
      expect(result).toContain('中文Hello')
      expect(result).not.toContain('中文 Hello')
    })

    it('多个 fenced 与 inline code 混合', () => {
      const input = '前 `a` 中 ```\nblock1\n``` 后 `b` 末尾。'
      const result = normalizePunctuation(input)
      expect(result).toContain('`a`')
      expect(result).toContain('```\nblock1\n```')
      expect(result).toContain('`b`')
    })
  })
})
