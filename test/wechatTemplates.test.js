import { describe, expect, it } from 'vitest'
import { wechatTemplates, getWechatTemplateOverrides } from '../src/utils/wechatTemplates.js'

const settings = {
  textColor: '#333333',
  accentColor: '#1a73e8',
  fontSize: 16,
  lineHeight: 1.75,
  paragraphMargin: 16,
  letterSpacing: 0.5,
  textIndent: false
}

describe('wechatTemplates', () => {
  it('exports 3 retained templates', () => {
    expect(wechatTemplates.map(tpl => tpl.id)).toEqual(['classic', 'band', 'program'])
  })

  it('each template has id, name, swatch, and build', () => {
    wechatTemplates.forEach(tpl => {
      expect(tpl).toHaveProperty('id')
      expect(tpl).toHaveProperty('name')
      expect(tpl).toHaveProperty('swatch')
      expect(typeof tpl.build).toBe('function')
    })
  })
})

describe('getWechatTemplateOverrides', () => {
  it('returns long-form reading overrides for classic template', () => {
    const overrides = getWechatTemplateOverrides('classic', settings)
    expect(overrides).not.toBeNull()
    expect(overrides.h1).toContain('border-bottom: 2px solid #1a73e8')
    expect(overrides.h2).toContain('border-left: 4px solid #1a73e8')
  })

  it('returns null for unknown template id', () => {
    const overrides = getWechatTemplateOverrides('nonexistent', settings)
    expect(overrides).toBeNull()
  })

  it('returns style overrides for band template', () => {
    const overrides = getWechatTemplateOverrides('band', settings)
    expect(overrides).not.toBeNull()
    expect(overrides).toHaveProperty('h1')
    expect(overrides).toHaveProperty('h2')
    expect(overrides.h1).toContain('#1a73e8')
    expect(overrides.h2).toContain('#1a73e8')
  })

  it('overrides use the provided accentColor', () => {
    const overrides = getWechatTemplateOverrides('band', settings)
    expect(overrides.h1).toContain('#1a73e8')
    expect(overrides.blockquote).toContain('#1a73e8')
  })

  it('program overrides include monospace codeblock', () => {
    const overrides = getWechatTemplateOverrides('program', settings)
    expect(overrides.codeblock).toContain('SF Mono')
    expect(overrides.inlineCode).toContain('SF Mono')
  })
})
