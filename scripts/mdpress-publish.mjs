#!/usr/bin/env node
import { access, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { constants } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { chromium } from 'playwright'
import { formatText, renderWithStyles } from '../src/utils/formatter.js'
import { createCardStyles } from '../src/utils/cardStyle.js'
import { cardTemplates, cardColorSchemes, cardFontFamilies, CARD_PADDING, CARD_WIDTH } from '../src/utils/cardTemplates.js'
import { wechatTemplates } from '../src/utils/wechatTemplates.js'
import { defaultArticleStyleSettings, defaultCardSettings } from '../src/utils/config.js'
import { cardShellCss, getCardContentBox, renderCardShell } from '../src/utils/cardShell.js'

const usage = `用法：node scripts/mdpress-publish.mjs <input.md> [选项]

选项：
  --out <目录>                    输出目录
  --targets wechat,xhs            只生成指定目标，默认两个都生成
  --wechat-template <模板>        classic | program | band
  --xhs-template <模板>           simple | border | handwrite
  --xhs-color <配色>              blue | orange | teal | red | green | purple
  --xhs-font <字体>               hand | sans | serif | round
  --xhs-font-size <13-22>         小红书字号，默认 16
  --asset-base-url <HTTPS URL>    公众号本地图片的可访问地址前缀
  --force                         覆盖已有输出
  --help                          显示本说明`

function fail(message) { throw new Error(message) }
function parseArgs(argv) {
  const args = { force: false }
  const values = new Set(['out', 'targets', 'wechat-template', 'xhs-template', 'xhs-color', 'xhs-font', 'xhs-font-size', 'asset-base-url'])
  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index]
    if (item === '--help') return { help: true }
    if (item === '--force') { args.force = true; continue }
    if (!item.startsWith('--')) { if (args.input) fail(`只支持一个 Markdown 输入文件：${item}`); args.input = item; continue }
    const key = item.slice(2)
    if (!values.has(key)) fail(`未知参数：${item}`)
    const value = argv[++index]
    if (!value || value.startsWith('--')) fail(`${item} 缺少值`)
    args[key] = value
  }
  if (!args.input) fail('请提供 Markdown 输入文件')
  return args
}

async function exists(file) { try { await access(file, constants.F_OK); return true } catch { return false } }
function select(value, items, label) {
  const found = items.find((item) => item.id === value)
  if (!found) fail(`${label} 无效：${value}；可选值：${items.map((item) => item.id).join(', ')}`)
  return found.id
}
function isRemote(src) { return /^https:\/\//i.test(src) || /^data:image\//i.test(src) }
function isLocal(src) { return src && !isRemote(src) && !/^[a-z][a-z\d+.-]*:/i.test(src) && !src.startsWith('#') }
function imageSources(html) { return [...html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"[^>]*>/gi)].map((match) => match[1]) }
function mapImages(html, mapper) { return html.replace(/(<img\b[^>]*\bsrc=")([^"]+)(")/gi, (_, before, src, after) => `${before}${mapper(src)}${after}`) }

function makeWechatHtml(markdown, settings, assetBaseUrl) {
  const html = formatText(markdown, settings, settings.wechatTemplateId)
  const local = imageSources(html).filter(isLocal)
  if (local.length && !assetBaseUrl) fail('公众号内容含本地图片，请提供 --asset-base-url，例如 https://cdn.example.com/assets/')
  if (!assetBaseUrl) return html
  let base
  try { base = new URL(assetBaseUrl) } catch { fail('--asset-base-url 必须是完整 HTTPS URL') }
  if (base.protocol !== 'https:') fail('--asset-base-url 必须使用 HTTPS')
  return mapImages(html, (src) => isLocal(src) ? new URL(src, base).href : src)
}

function toLocalFileUrl(src, inputDir) {
  if (!isLocal(src)) return src
  return pathToFileURL(path.resolve(inputDir, src.split(/[?#]/, 1)[0])).href
}

async function verifyLocalImages(html, inputDir) {
  const sources = [...new Set(imageSources(html).filter(isLocal))]
  for (const src of sources) {
    const file = path.resolve(inputDir, src.split(/[?#]/, 1)[0])
    if (!(await exists(file))) fail(`找不到本地图片：${src}`)
  }
}

async function splitInPage(page, html, styles, contentBox) {
  const contentWidth = CARD_WIDTH - CARD_PADDING * 2
  await page.setContent(`<!doctype html><html><head><style>body{margin:0}</style></head><body><div id="measure" style="position:fixed;left:-100000px;top:0;width:${contentWidth}px;visibility:hidden;pointer-events:none;box-sizing:border-box;${styles.container}">${html}</div></body></html>`)
  await page.locator('#measure img').evaluateAll(async (images) => Promise.all(images.map((image) => image.decode?.().catch(() => {}) || Promise.resolve())))
  return page.locator('#measure').evaluate((root, box) => {
    const unsplittable = new Set(['TABLE', 'PRE', 'IMG'])
    const headings = new Set(['H1', 'H2', 'H3'])
    const measure = (element) => {
      const wrap = document.createElement('div')
      wrap.style.cssText = 'overflow:hidden;display:flow-root;'
      root.appendChild(wrap); wrap.appendChild(element)
      const result = { html: element.outerHTML, height: wrap.offsetHeight, tag: element.tagName }
      wrap.remove(); return result
    }
    const splitLarge = (element) => {
      if (unsplittable.has(element.tagName)) throw new Error(`${element.tagName.toLowerCase()} 超过单张小红书图片可用高度，无法安全拆分`)
      let pieces
      if (element.tagName === 'P') {
        const sentences = (element.textContent || '').match(/[^。！？!?；;\n]+[。！？!?；;\n]*/g) || []
        if (sentences.length > 1) {
          const nodes = []
          const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
          let textNode
          while ((textNode = walker.nextNode())) nodes.push(textNode)
          const pointAt = (offset) => {
            let seen = 0
            for (const node of nodes) {
              const next = seen + node.data.length
              if (offset <= next) return { node, offset: offset - seen }
              seen = next
            }
            return { node: nodes.at(-1), offset: nodes.at(-1).data.length }
          }
          let start = 0
          pieces = sentences.map((sentence) => {
            const copy = element.cloneNode(false)
            const range = document.createRange()
            const from = pointAt(start)
            const end = start + sentence.length
            const to = pointAt(end)
            range.setStart(from.node, from.offset); range.setEnd(to.node, to.offset)
            copy.appendChild(range.cloneContents())
            start = end
            return copy
          })
        }
      } else if (element.tagName === 'UL' || element.tagName === 'OL') {
        const items = [...element.children].filter((child) => child.tagName === 'LI')
        pieces = items.length > 1 ? items.map((item) => { const copy = element.cloneNode(false); copy.appendChild(item.cloneNode(true)); return copy }) : null
      }
      if (!pieces) throw new Error(`${element.tagName.toLowerCase()} 超过单张小红书图片可用高度，无法安全拆分`)
      const cards = []; let current = []; let used = 0
      for (const piece of pieces) {
        const item = measure(piece)
        if (item.height > box) throw new Error(`${element.tagName.toLowerCase()} 的单个内容单元超过单张小红书图片可用高度`)
        if (used + item.height > box && current.length) { cards.push(current); current = []; used = 0 }
        current.push(item.html); used += item.height
      }
      if (current.length) cards.push(current)
      return cards
    }
    const cards = []; let current = []; let used = 0
    const push = () => { if (current.length) { cards.push(current); current = []; used = 0 } }
    for (const block of [...root.children]) {
      const item = measure(block)
      if (item.height > box) { push(); cards.push(...splitLarge(block)); continue }
      if (used + item.height > box && current.length) push()
      if (headings.has(item.tag) && current.length && box - used < 80) push()
      current.push(item.html); used += item.height
    }
    push(); return cards
  }, contentBox)
}

async function renderXhs(markdown, inputDir, outputDir, settings) {
  const executable = process.env.MDPRESS_CHROMIUM_PATH || chromium.executablePath()
  if (!executable || !(await exists(executable))) fail('Playwright Chromium 未安装。请执行：npx playwright install chromium')
  const styles = createCardStyles(settings)
  const rendered = renderWithStyles(markdown, styles)
  await verifyLocalImages(rendered, inputDir)
  const body = mapImages(rendered, (src) => toLocalFileUrl(src, inputDir))
  const browser = await chromium.launch({ headless: true })
  try {
    const context = await browser.newContext({ viewport: { width: 360, height: 480 }, deviceScaleFactor: 3 })
    const page = await context.newPage()
    const cards = await splitInPage(page, body, styles, getCardContentBox(settings))
    if (!cards.length) return []
    const xhsDir = path.join(outputDir, 'xhs')
    await mkdir(xhsDir, { recursive: true })
    const files = []
    for (const [index, blocks] of cards.entries()) {
      await page.setContent(`<!doctype html><html><head><style>${cardShellCss}</style></head><body>${renderCardShell({ blocks, settings, index, total: cards.length })}</body></html>`)
      const filename = `${String(index + 1).padStart(3, '0')}.png`
      await page.locator('.xhs-card').screenshot({ path: path.join(xhsDir, filename), type: 'png' })
      files.push(`xhs/${filename}`)
    }
    await context.close()
    return files
  } finally { await browser.close() }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  if (args.help) { process.stdout.write(`${usage}\n`); return }
  const input = path.resolve(args.input)
  if (path.extname(input).toLowerCase() !== '.md') fail('输入文件必须是 .md')
  if (!(await exists(input))) fail(`找不到输入文件：${input}`)
  const targets = (args.targets || 'wechat,xhs').split(',').map((item) => item.trim()).filter(Boolean)
  if (!targets.length || targets.some((item) => !['wechat', 'xhs'].includes(item))) fail('--targets 只能包含 wechat 和 xhs')
  const uniqueTargets = [...new Set(targets)]
  const wechatTemplateId = select(args['wechat-template'] || 'classic', wechatTemplates, '--wechat-template')
  const templateId = select(args['xhs-template'] || 'border', cardTemplates, '--xhs-template')
  const colorSchemeId = select(args['xhs-color'] || 'red', cardColorSchemes, '--xhs-color')
  const fontFamilyId = select(args['xhs-font'] || 'hand', cardFontFamilies, '--xhs-font')
  const fontSize = Number(args['xhs-font-size'] || 16)
  if (!Number.isInteger(fontSize) || fontSize < 13 || fontSize > 22) fail('--xhs-font-size 必须是 13 到 22 的整数')
  const outputDir = path.resolve(args.out || path.join(path.dirname(input), 'mdpress-output', path.basename(input, '.md')))
  if ((await exists(outputDir)) && (await readdir(outputDir)).length && !args.force) fail(`输出目录已存在且不为空：${outputDir}；如需覆盖请使用 --force`)
  if (args.force && (await exists(outputDir))) await rm(outputDir, { recursive: true, force: true })
  const markdown = await readFile(input, 'utf8')
  const wechatSettings = { ...defaultArticleStyleSettings, wechatTemplateId }
  const xhsSettings = { ...defaultCardSettings, templateId, colorSchemeId, fontFamilyId, fontSize }
  const wechatHtml = uniqueTargets.includes('wechat') ? makeWechatHtml(markdown, wechatSettings, args['asset-base-url']) : null
  await mkdir(outputDir, { recursive: true })
  if (wechatHtml != null) await writeFile(path.join(outputDir, 'wechat.html'), wechatHtml, 'utf8')
  const xhsFiles = uniqueTargets.includes('xhs') ? await renderXhs(markdown, path.dirname(input), outputDir, xhsSettings) : []
  const manifest = { input, generatedAt: new Date().toISOString(), targets: uniqueTargets, wechatTemplate: wechatTemplateId, xhs: { template: templateId, color: colorSchemeId, font: fontFamilyId, fontSize, files: xhsFiles } }
  await writeFile(path.join(outputDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
  process.stdout.write(`已生成：${outputDir}\n`)
}

main().catch((error) => { process.stderr.write(`mdpress-publish: ${error.message}\n`); process.exitCode = 1 })
