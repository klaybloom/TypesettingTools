import { afterEach, describe, expect, it } from 'vitest'
import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const fixture = path.join(root, 'test/fixtures/publish-source.md')
const tempDirs = []

async function makeOutput() {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'mdpress-publish-'))
  tempDirs.push(dir)
  return dir
}

function publish(args, { input = fixture, env = {} } = {}) {
  return spawnSync(process.execPath, ['scripts/mdpress-publish.mjs', input, ...args], {
    cwd: root,
    encoding: 'utf8',
    timeout: 60000,
    env: { ...process.env, ...env }
  })
}

function pngDimensions(buffer) {
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) }
}

afterEach(async () => Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true }))))

describe('mdpress-publish', () => {
  it('preflights local WeChat images before creating output', async () => {
    const out = await makeOutput()
    const result = publish(['--out', out, '--targets', 'wechat'])
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('--asset-base-url')
    expect(await readdir(out)).toEqual([])
  })

  it('generates inline WeChat HTML and 1080×1440 Xiaohongshu PNG files', async () => {
    const out = await makeOutput()
    const result = publish([
      '--out', out,
      '--wechat-template', 'program',
      '--xhs-template', 'handwrite',
      '--xhs-color', 'red',
      '--xhs-font', 'hand',
      '--xhs-font-size', '16',
      '--asset-base-url', 'https://cdn.example.com/assets/'
    ])
    expect(result.status, result.stderr).toBe(0)
    const html = await readFile(path.join(out, 'wechat.html'), 'utf8')
    expect(html).toContain('<section style=')
    expect(html).toContain('https://cdn.example.com/assets/local-image.svg')
    expect(html).toContain('<table style=')
    expect(html).toContain('<pre style=')
    const pngs = (await readdir(path.join(out, 'xhs'))).filter((file) => file.endsWith('.png')).sort()
    expect(pngs).toEqual(pngs.map((_, index) => `${String(index + 1).padStart(3, '0')}.png`))
    for (const file of pngs) expect(pngDimensions(await readFile(path.join(out, 'xhs', file)))).toEqual({ width: 1080, height: 1440 })
    const manifest = JSON.parse(await readFile(path.join(out, 'manifest.json'), 'utf8'))
    expect(manifest.xhs.files).toEqual(pngs.map((file) => `xhs/${file}`))
  }, 70000)

  it('rejects unsupported templates and preserves an existing output without --force', async () => {
    const out = await makeOutput()
    const invalid = publish(['--out', out, '--targets', 'xhs', '--xhs-template', 'missing'])
    expect(invalid.status).toBe(1)
    expect(invalid.stderr).toContain('--xhs-template 无效')
    const result = publish(['--out', out, '--targets', 'wechat', '--asset-base-url', 'https://cdn.example.com/assets/'])
    expect(result.status, result.stderr).toBe(0)
    const again = publish(['--out', out, '--targets', 'wechat', '--asset-base-url', 'https://cdn.example.com/assets/'])
    expect(again.status).toBe(1)
    expect(again.stderr).toContain('--force')
  })

  it('reports missing Chromium before writing Xiaohongshu images', async () => {
    const out = await makeOutput()
    const result = publish(['--out', out, '--targets', 'xhs'], { env: { MDPRESS_CHROMIUM_PATH: '/missing/chromium' } })
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('Chromium 未安装')
    expect(await readdir(out)).toEqual([])
  })

  it('rejects a code block that is taller than one card', async () => {
    const sourceDir = await makeOutput()
    const source = path.join(sourceDir, 'too-tall.md')
    await writeFile(source, `\`\`\`txt\n${'a very long code line\n'.repeat(120)}\`\`\`\n`)
    const result = publish(['--out', path.join(sourceDir, 'output'), '--targets', 'xhs'], { input: source })
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('pre 超过单张小红书图片可用高度')
  }, 70000)

  it('rejects a table that is taller than one card', async () => {
    const sourceDir = await makeOutput()
    const source = path.join(sourceDir, 'too-tall-table.md')
    const rows = Array.from({ length: 40 }, (_, index) => `| ${index} | 一行表格内容 |`).join('\n')
    await writeFile(source, `| 序号 | 内容 |\n| --- | --- |\n${rows}\n`)
    const result = publish(['--out', path.join(sourceDir, 'output'), '--targets', 'xhs'], { input: source })
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('table 超过单张小红书图片可用高度')
  }, 70000)
})
