import { describe, expect, it } from 'vitest'
import { createArticleStyles } from '../src/utils/articleStyle.js'
import { defaultArticleStyleSettings } from '../src/utils/config.js'

describe('articleStyle', () => {
  it('derives article styles from article settings', () => {
    const styles = createArticleStyles({
      ...defaultArticleStyleSettings,
      fontSize: 18,
      accentColor: '#ff0000',
      textIndent: true
    })

    expect(styles.section).toContain('font-size: 18px')
    expect(styles.strong).toContain('#ff0000')
    expect(styles.p).toContain('text-indent: 2em')
    expect(styles.h1).toContain('background: #ff0000')
    expect(styles.h1).toContain('color: #ffffff')
    expect(styles.h2).toContain('border-left: 4px solid #ff0000')
  })
})
