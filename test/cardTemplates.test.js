import { describe, expect, it } from 'vitest'
import {
  CARD_WIDTH,
  CARD_HEIGHT,
  CARD_PADDING,
  cardColorSchemes,
  cardFontFamilies,
  cardTemplates,
  getCardTemplate,
  getColorScheme,
  getFontFamily
} from '../src/utils/cardTemplates.js'

describe('cardTemplates constants', () => {
  it('exports card dimensions', () => {
    expect(CARD_WIDTH).toBe(360)
    expect(CARD_HEIGHT).toBe(480)
    expect(CARD_PADDING).toBe(28)
  })

  it('has 6 color schemes', () => {
    expect(cardColorSchemes).toHaveLength(6)
    cardColorSchemes.forEach(s => {
      expect(s).toHaveProperty('id')
      expect(s).toHaveProperty('name')
      expect(s).toHaveProperty('accent')
      expect(s).toHaveProperty('text')
      expect(s).toHaveProperty('page')
    })
  })

  it('has 4 font families', () => {
    expect(cardFontFamilies).toHaveLength(4)
    cardFontFamilies.forEach(f => {
      expect(f).toHaveProperty('id')
      expect(f).toHaveProperty('name')
      expect(f).toHaveProperty('stack')
    })
  })

  it('has 3 retained templates', () => {
    expect(cardTemplates.map(t => t.id)).toEqual(['border', 'simple', 'handwrite'])
  })
})

describe('getCardTemplate', () => {
  it('returns template by id', () => {
    const tpl = getCardTemplate('simple')
    expect(tpl.id).toBe('simple')
    expect(tpl.reserveTop).toBe(0)
    expect(tpl.reserveBottom).toBe(0)
  })

  it('returns border template for unknown id (fallback)', () => {
    const tpl = getCardTemplate('nonexistent')
    expect(tpl.id).toBe('border')
  })

  it('each template has required fields', () => {
    cardTemplates.forEach(tpl => {
      expect(tpl).toHaveProperty('id')
      expect(tpl).toHaveProperty('name')
      expect(typeof tpl.reserveTop).toBe('number')
      expect(typeof tpl.reserveBottom).toBe('number')
      expect(typeof tpl.frameInset).toBe('number')
      expect(typeof tpl.pageBg).toBe('function')
      expect(typeof tpl.panelBg).toBe('function')
    })
  })

  it('template pageBg returns a string for given scheme', () => {
    const scheme = cardColorSchemes[0]
    const tpl = getCardTemplate('border')
    const bg = tpl.pageBg(scheme)
    expect(typeof bg).toBe('string')
    expect(bg.length).toBeGreaterThan(0)
  })
})

describe('getColorScheme', () => {
  it('returns scheme by id', () => {
    const scheme = getColorScheme('blue')
    expect(scheme.id).toBe('blue')
    expect(scheme.accent).toBe('#4C6EF5')
  })

  it('falls back to first scheme for unknown id', () => {
    const scheme = getColorScheme('nonexistent')
    expect(scheme.id).toBe(cardColorSchemes[0].id)
  })
})

describe('getFontFamily', () => {
  it('returns font by id', () => {
    const font = getFontFamily('sans')
    expect(font.id).toBe('sans')
    expect(font.stack).toContain('PingFang SC')
  })

  it('falls back to first font for unknown id', () => {
    const font = getFontFamily('nonexistent')
    expect(font.id).toBe(cardFontFamilies[0].id)
  })
})
