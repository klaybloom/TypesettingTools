#!/usr/bin/env node
import { access, cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { constants } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourceDir = path.join(repositoryRoot, 'skills', 'mdpress-publisher')
const destination = path.join(os.homedir(), '.codex', 'skills', 'mdpress-publisher')
const force = process.argv.slice(2).includes('--force')

async function exists(file) {
  try { await access(file, constants.F_OK); return true } catch { return false }
}

if ((await exists(destination)) && !force) {
  throw new Error(`skill 已存在：${destination}。如需覆盖，请使用 --force`)
}

if (force) await rm(destination, { recursive: true, force: true })
await mkdir(path.join(destination, 'agents'), { recursive: true })
const template = await readFile(path.join(sourceDir, 'SKILL.md'), 'utf8')
await writeFile(path.join(destination, 'SKILL.md'), template.replaceAll('{{PROJECT_DIR}}', repositoryRoot), 'utf8')
await cp(path.join(sourceDir, 'agents', 'openai.yaml'), path.join(destination, 'agents', 'openai.yaml'))
process.stdout.write(`已安装 mdpress-publisher：${destination}\n`)
