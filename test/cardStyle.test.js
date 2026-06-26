import { describe, expect, it } from 'vitest'
import { createCardStyles } from '../src/utils/cardStyle.js'

const defaultSettings = {
  colorSchemeId: 'blue',
  fontFamilyId: 'sans',
  fontSize: 16
}

describe('createCardStyles', () => {
  it('returns a full style map with all expected keys', () => {
    const styles = createCardStyles(defaultSettings)
    const expectedKeys = [
      'container', 'section', 'p', 'liParagraph',
      'h1', 'h2', 'h3',
      'strong', 'em', 's', 'a',
      'codeblock', 'inlineCode',
      'ul', 'ol', 'li', 'taskList', 'taskListItem', 'checkbox',
      'table', 'th', 'td',
      'blockquote', 'hr', 'img',
      'footnoteRef', 'footnoteSection', 'footnoteItem', 'footnoteBackRef'
    ]
    expectedKeys.forEach(key => {
      expect(styles).toHaveProperty(key)
      expect(typeof styles[key]).toBe('string')
    })
  })

  it('applies accent color to h1', () => {
    const styles = createCardStyles(defaultSettings)
    expect(styles.h1).toContain('#4C6EF5')
  })

  it('applies custom font size to heading offsets', () => {
    const styles = createCardStyles({ ...defaultSettings, fontSize: 20 })
    expect(styles.h1).toContain('font-size: 30px') // 20 + 10
    expect(styles.h2).toContain('font-size: 25px') // 20 + 5
    expect(styles.h3).toContain('font-size: 22px') // 20 + 2
  })

  it('uses different color scheme when specified', () => {
    const styles = createCardStyles({ ...defaultSettings, colorSchemeId: 'red' })
    expect(styles.h1).toContain('#D9402A')
    expect(styles.strong).toContain('#D9402A')
  })

  it('uses different font family when specified', () => {
    const styles = createCardStyles({ ...defaultSettings, fontFamilyId: 'serif' })
    expect(styles.container).toContain('Georgia')
  })

  it('computes paragraph margin relative to font size', () => {
    const styles = createCardStyles({ ...defaultSettings, fontSize: 20 })
    expect(styles.p).toContain('margin: 0 0 14px') // 20 * 0.7 = 14
  })
})
