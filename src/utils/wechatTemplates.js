/**
 * 公众号模板系统
 * 每个模板的 build(settings) 返回一组与 createArticleStyles 同键的「样式覆盖」，
 * 在基础样式之上 Object.assign 合并。classic 返回 null（不覆盖），直接用基础样式。
 *
 * 公众号编辑器限制：不支持 class / position / 伪元素，只认元素上的内联 style。
 * 因此居中的「收缩盒」统一用 display:table + margin:auto（mdnice 同款技巧）。
 */

const MONO = "'SF Mono', Menlo, Monaco, Consolas, monospace"

const templates = {
  classic: {
    id: 'classic',
    name: '经典',
    swatch: '#1F7A62',
    // 长文优先：保留强调色，但避免标题胶囊抢走正文注意力。
    build: (s) => ({
      h1: `font-size: 26px; font-weight: 700; color: ${s.textColor}; letter-spacing: 0.6px; margin: 0 0 28px; padding-bottom: 13px; border-bottom: 2px solid ${s.accentColor}; line-height: 1.38;`,
      h2: `font-size: 19px; font-weight: 700; color: ${s.textColor}; margin: 34px 0 17px; padding-left: 12px; border-left: 4px solid ${s.accentColor}; line-height: 1.45;`,
      h3: `font-size: 16px; font-weight: 700; color: ${s.accentColor}; margin: 24px 0 11px; line-height: 1.55;`,
      blockquote: `background: ${s.accentColor}0d; border-left: 3px solid ${s.accentColor}; padding: 13px 17px; margin: 24px 0; color: #5b625f; font-size: 14px; line-height: 1.85; border-radius: 0 6px 6px 0;`,
      hr: `width: 42px; height: 2px; background-color: ${s.accentColor}; margin: 32px 0; border: none;`
    })
  },

  band: {
    id: 'band',
    name: '色块',
    swatch: '#5B6CC9',
    build: (s) => ({
      h1: `font-size: 25px; font-weight: 800; color: ${s.textColor}; margin: 0 0 26px; padding-bottom: 11px; border-bottom: 3px solid ${s.accentColor}; line-height: 1.4;`,
      h2: `font-size: 18px; font-weight: 700; color: #ffffff; background: ${s.accentColor}; margin: 32px 0 17px; padding: 9px 13px; border-radius: 6px; line-height: 1.5;`,
      h3: `display: table; width: auto; font-size: 16px; font-weight: 700; color: ${s.accentColor}; margin: 23px 0 11px; padding: 3px 10px; background: ${s.accentColor}14; border-radius: 4px;`,
      blockquote: `background: ${s.accentColor}0f; border-left: 3px solid ${s.accentColor}; border-radius: 0 8px 8px 0; padding: 14px 17px; margin: 24px 0; color: #5a5a5a; font-size: 14px; line-height: 1.8;`,
      strong: `color: ${s.accentColor}; font-weight: 700;`,
      th: `background: ${s.accentColor}; color: #ffffff; padding: 10px 13px; border: 1px solid ${s.accentColor}; text-align: left; font-weight: 600;`,
      hr: `width: 100%; height: 2px; background: ${s.accentColor}; margin: 30px 0; border: none; border-radius: 1px;`
    })
  },

  program: {
    id: 'program',
    name: '程序',
    swatch: '#0F4C81',
    build: (s) => ({
      h1: `font-family: ${MONO}; font-size: 24px; font-weight: 700; color: #ffffff; background: #1f2937; letter-spacing: 0.3px; margin: 0 0 26px; padding: 13px 16px; border-radius: 6px; line-height: 1.4;`,
      h2: `font-family: ${MONO}; font-size: 18px; font-weight: 700; color: ${s.accentColor}; margin: 34px 0 16px; padding: 7px 11px; border-left: 3px solid ${s.accentColor}; border-bottom: 1px solid ${s.accentColor}55; line-height: 1.5;`,
      h3: `font-family: ${MONO}; font-size: 15px; font-weight: 700; color: ${s.textColor}; margin: 24px 0 11px; line-height: 1.5;`,
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
