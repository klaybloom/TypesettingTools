/**
 * 公众号模板系统
 * 每个模板的 build(settings) 返回一组与 createArticleStyles 同键的「样式覆盖」，
 * 在基础样式之上 Object.assign 合并。classic 返回 null（不覆盖），直接用基础样式。
 *
 * 公众号编辑器限制：不支持 class / position / 伪元素，只认元素上的内联 style。
 * 因此居中的「收缩盒」统一用 display:table + margin:auto（mdnice 同款技巧）。
 */

const SERIF = "Georgia, 'Songti SC', 'Noto Serif SC', serif"
const MONO = "'SF Mono', Menlo, Monaco, Consolas, monospace"

const templates = {
  classic: {
    id: 'classic',
    name: '经典',
    swatch: '#1F7A62',
    // 用基础样式：H1 强调色胶囊、H2 居中 + 强调色下划线、干净文档感
    build: () => null
  },

  magazine: {
    id: 'magazine',
    name: '杂志',
    swatch: '#B8860B',
    build: (s) => ({
      h1: `font-family: ${SERIF}; font-size: 27px; font-weight: 700; color: ${s.textColor}; text-align: center; letter-spacing: 1px; margin: 0 0 6px; line-height: 1.3;`,
      h2: `display: table; width: auto; font-family: ${SERIF}; font-size: 21px; font-weight: 700; color: ${s.textColor}; text-align: center; margin: 32px auto 18px; padding: 8px 4px; border-top: 2px solid ${s.textColor}; border-bottom: 2px solid ${s.textColor}; line-height: 1.4;`,
      h3: `font-family: ${SERIF}; font-size: 17px; font-weight: 700; color: ${s.accentColor}; text-align: center; margin: 24px 0 12px;`,
      blockquote: `border-left: 3px solid ${s.accentColor}; padding: 4px 0 4px 18px; margin: 24px 0; color: #6b6b6b; font-style: italic; font-family: ${SERIF}; font-size: 16px; line-height: 1.9;`,
      hr: `width: 40px; height: 3px; background-color: ${s.accentColor}; margin: 34px auto; border: none;`
    })
  },

  minimal: {
    id: 'minimal',
    name: '极简',
    swatch: '#3F3F3F',
    build: (s) => ({
      h1: `font-size: 25px; font-weight: 700; color: ${s.textColor}; text-align: center; letter-spacing: 0.5px; margin: 0 0 24px; line-height: 1.35;`,
      h2: `font-size: 13px; font-weight: 700; color: ${s.accentColor}; text-align: center; letter-spacing: 4px; margin: 34px 0 16px; line-height: 1.5;`,
      h3: `font-size: 16px; font-weight: 600; color: #595959; text-align: center; margin: 24px 0 10px;`,
      blockquote: `background: none; border-left: 2px solid #d9d9d9; padding: 0 0 0 16px; margin: 24px 0; color: #8c8c8c; font-size: 15px; line-height: 1.85;`,
      strong: `color: ${s.textColor}; font-weight: 700;`,
      hr: `width: 100%; height: 1px; background-color: #ececec; margin: 32px 0; border: none;`
    })
  },

  'mono-tech': {
    id: 'mono-tech',
    name: '极客',
    swatch: '#4F6B95',
    build: (s) => ({
      h1: `font-family: ${MONO}; font-size: 23px; font-weight: 700; color: ${s.textColor}; text-align: center; margin: 0 0 22px; line-height: 1.4;`,
      h2: `display: table; width: auto; font-family: ${MONO}; font-size: 18px; font-weight: 700; color: ${s.accentColor}; text-align: center; margin: 28px auto 18px; padding: 6px 18px; border: 1.5px solid ${s.accentColor}; border-radius: 6px; line-height: 1.5;`,
      h3: `font-family: ${MONO}; font-size: 15px; font-weight: 600; color: ${s.textColor}; text-align: center; margin: 24px 0 12px;`,
      codeblock: `background: #f6f8fa; color: #24292e; padding: 16px 20px; margin: 20px 0; border-radius: 8px; border: 1px solid #e1e4e8; font-family: ${MONO}; font-size: 13px; line-height: 1.6; overflow-x: auto; white-space: pre-wrap;`,
      inlineCode: `background: ${s.accentColor}14; color: ${s.accentColor}; padding: 2px 6px; border-radius: 4px; font-family: ${MONO}; font-size: 0.9em;`,
      blockquote: `background: #f6f8fa; border-left: 4px solid ${s.accentColor}; padding: 14px 18px; margin: 22px 0; color: #57606a; font-size: 14px; line-height: 1.7; border-radius: 0 6px 6px 0;`,
      hr: `width: 100%; height: 1px; background-color: #e1e4e8; margin: 28px 0; border: none;`
    })
  },

  warm: {
    id: 'warm',
    name: '暖阳',
    swatch: '#C0552D',
    build: (s) => ({
      h1: `display: table; width: auto; font-size: 22px; font-weight: 700; color: #ffffff; background: ${s.accentColor}; padding: 12px 26px; border-radius: 999px; margin: 0 auto 24px; line-height: 1.4; text-align: center;`,
      h2: `display: table; width: auto; font-size: 18px; font-weight: 700; color: #ffffff; background: ${s.accentColor}; text-align: center; margin: 30px auto 18px; padding: 8px 24px; border-radius: 999px; line-height: 1.5;`,
      h3: `font-size: 16px; font-weight: 700; color: ${s.accentColor}; text-align: center; margin: 24px 0 12px;`,
      blockquote: `background: ${s.accentColor}12; border-left: 4px solid ${s.accentColor}; padding: 16px 20px; margin: 24px 0; color: #7a5c4d; font-size: 14px; line-height: 1.85; border-radius: 0 8px 8px 0;`,
      th: `background: ${s.accentColor}; color: #ffffff; padding: 12px 16px; border: 1px solid ${s.accentColor}; text-align: left; font-weight: 600;`,
      hr: `width: 60px; height: 3px; background-color: ${s.accentColor}; margin: 32px auto; border: none; border-radius: 2px;`
    })
  },

  band: {
    id: 'band',
    name: '色块',
    swatch: '#5B6CC9',
    build: (s) => ({
      h1: `font-size: 24px; font-weight: 800; color: ${s.textColor}; text-align: center; margin: 0 0 24px; line-height: 1.4;`,
      h2: `font-size: 18px; font-weight: 700; color: #ffffff; background: ${s.accentColor}; text-align: center; margin: 30px 0 18px; padding: 11px 0; border-radius: 8px; line-height: 1.5;`,
      h3: `display: table; width: auto; font-size: 16px; font-weight: 700; color: ${s.accentColor}; text-align: center; margin: 24px auto 12px; padding: 2px 12px; background: ${s.accentColor}14; border-radius: 4px;`,
      blockquote: `background: ${s.accentColor}0f; border: none; border-radius: 10px; padding: 16px 20px; margin: 24px 0; color: #5a5a5a; font-size: 14px; line-height: 1.8;`,
      strong: `color: ${s.accentColor}; font-weight: 700;`,
      hr: `width: 100%; height: 2px; background: ${s.accentColor}; margin: 30px 0; border: none; border-radius: 1px;`
    })
  },

  program: {
    id: 'program',
    name: '程序',
    swatch: '#0F4C81',
    build: (s) => ({
      h1: `display: table; width: auto; font-size: 23px; font-weight: 800; color: #ffffff; background: ${s.accentColor}; text-align: center; letter-spacing: 1px; margin: 0 auto 22px; padding: 10px 24px; border-radius: 6px; line-height: 1.4;`,
      h2: `display: table; width: auto; font-size: 19px; font-weight: 700; color: #ffffff; background: ${s.accentColor}; text-align: center; margin: 36px auto 20px; padding: 7px 18px; border-radius: 4px; line-height: 1.5;`,
      h3: `font-size: 16px; font-weight: 700; color: ${s.accentColor}; margin: 24px 0 12px; padding-left: 10px; border-left: 3px solid ${s.accentColor}; line-height: 1.5;`,
      ul: 'margin: 16px 0; padding-left: 1.5em; list-style: circle;',
      ol: 'margin: 16px 0; padding-left: 1.5em;',
      blockquote: `background: ${s.accentColor}0d; border-left: 4px solid ${s.accentColor}; padding: 14px 18px; margin: 22px 0; color: #57606a; font-size: 14px; line-height: 1.75; border-radius: 0 6px 6px 0;`,
      codeblock: `background: #1e1e2e; color: #cdd6f4; padding: 16px 20px; margin: 18px 0; border-radius: 8px; font-family: ${MONO}; font-size: 13px; line-height: 1.6; overflow-x: auto; white-space: pre-wrap;`,
      inlineCode: `background: ${s.accentColor}14; color: ${s.accentColor}; padding: 2px 6px; border-radius: 4px; font-family: ${MONO}; font-size: 0.9em;`,
      th: `background: ${s.accentColor}; color: #ffffff; padding: 10px 14px; border: 1px solid ${s.accentColor}; text-align: left; font-weight: 600;`,
      hr: `width: 100%; height: 2px; background: ${s.accentColor}1f; margin: 30px 0; border: none;`
    })
  }
}

export const wechatTemplates = Object.values(templates)

export function getWechatTemplateOverrides(templateId, settings) {
  const tpl = templates[templateId]
  if (!tpl) return null
  return tpl.build(settings)
}
