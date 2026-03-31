function getBaseStyles(settings) {
  return {
    section: `font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans SC', sans-serif; color: ${settings.textColor}; font-size: ${settings.fontSize}px; line-height: ${settings.lineHeight}; letter-spacing: ${settings.letterSpacing}px;`,
    p: `margin-bottom: ${settings.paragraphMargin}px; text-align: justify;${settings.textIndent ? ' text-indent: 2em;' : ''}`,
    liParagraph: 'margin: 0; text-align: justify; text-indent: 0;'
  }
}

function getHeadingStyles(settings) {
  return {
    h1: `display: table; width: auto; font-size: 22px; font-weight: 700; color: #ffffff; background: ${settings.accentColor}; padding: 12px 18px; border-radius: 12px; margin: 0 auto 24px; line-height: 1.4; text-align: center;`,
    h2: `font-size: 18px; font-weight: 600; color: ${settings.textColor}; margin: 24px 0 16px 0; padding-left: 12px; border-left: 4px solid ${settings.accentColor}; line-height: 1.5;`,
    h3: `font-size: 16px; font-weight: 600; color: ${settings.textColor}; margin: 20px 0 12px 0;`
  }
}

function getTextDecorationStyles(settings) {
  return {
    strong: `color: ${settings.accentColor}; font-weight: 700;`,
    em: 'font-style: italic;',
    s: 'text-decoration: line-through; color: #999;',
    a: `color: ${settings.accentColor}; text-decoration: underline; word-break: break-all;`
  }
}

function getCodeStyles() {
  return {
    codeblock: "background: #1e1e1e; color: #d4d4d4; padding: 16px 20px; margin: 20px 0; border-radius: 8px; font-family: 'SF Mono', Menlo, Monaco, monospace; font-size: 13px; line-height: 1.6; overflow-x: auto; white-space: pre-wrap;",
    inlineCode: "background: #f3f4f6; color: #e83e8c; padding: 2px 6px; border-radius: 4px; font-family: Menlo, Monaco, monospace; font-size: 0.9em;"
  }
}

function getListStyles(settings) {
  return {
    ul: 'margin: 16px 0; padding-left: 24px;',
    ol: 'margin: 16px 0; padding-left: 24px;',
    li: `margin-bottom: 4px; color: ${settings.textColor};`,
    taskList: 'list-style: none; padding-left: 0; margin: 16px 0;',
    taskListItem: 'margin-bottom: 8px; display: flex; align-items: flex-start; gap: 8px;',
    checkbox: `width: 16px; height: 16px; margin-top: 3px; flex-shrink: 0; accent-color: ${settings.accentColor};`
  }
}

function getTableStyles(settings) {
  return {
    table: 'width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;',
    th: `background: ${settings.accentColor}15; padding: 12px 16px; border: 1px solid #e5e5e5; text-align: left; font-weight: 600;`,
    td: 'padding: 12px 16px; border: 1px solid #e5e5e5;'
  }
}

function getOtherStyles(settings) {
  return {
    blockquote: `background: #f7f7f8; border-left: 4px solid ${settings.accentColor}; padding: 16px 20px; margin: 20px 0; color: #595959; font-size: 14px; line-height: 1.8;`,
    hr: `width: 100%; height: 1px; background-color: ${settings.accentColor}; margin: 24px 0; border: none;`,
    img: 'max-width: 100%; border-radius: 8px; margin: 16px auto; display: block;'
  }
}

function getFootnoteStyles(settings) {
  return {
    footnoteRef: `font-size: 0.75em; vertical-align: super; line-height: 0; color: ${settings.accentColor}; text-decoration: none; font-weight: 600;`,
    footnoteSection: 'margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e5e5; font-size: 13px; color: #8c8c8c; line-height: 1.6;',
    footnoteItem: 'margin-bottom: 6px;',
    footnoteBackRef: `font-size: 0.85em; color: ${settings.accentColor}; text-decoration: none; margin-left: 4px;`
  }
}

export function createArticleStyles(settings) {
  return {
    ...getBaseStyles(settings),
    ...getHeadingStyles(settings),
    ...getTextDecorationStyles(settings),
    ...getCodeStyles(),
    ...getListStyles(settings),
    ...getTableStyles(settings),
    ...getOtherStyles(settings),
    ...getFootnoteStyles(settings)
  }
}
