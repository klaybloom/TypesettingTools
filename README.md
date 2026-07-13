# mdpress · Markdown 多端排版工具

mdpress 支持两种使用方式：

1. **网页版编辑器**：在浏览器里编辑 Markdown、预览排版、复制公众号 HTML 或导出小红书图片。
2. **本地 Codex Skill**：对已有 Markdown 文件直接生成公众号内联 HTML 和小红书 1080×1440 图片，不改写原文。

## 网页版功能

- Markdown 原生预览、微信公众号排版、小红书卡片三种模式
- 公众号模板：`classic`、`program`、`band`
- 小红书模板：`simple`、`border`、`handwrite`
- 支持标题、列表、引用、表格、脚注、任务列表、代码块和图片
- 公众号内容可复制为内联样式 HTML；小红书长文自动拆成连续卡片
- 支持深浅色界面、字号、配色、字体和行距设置

## 网页版运行

```bash
npm install
npm run dev
```

打开终端显示的本地地址即可使用。测试命令：

```bash
npm test
```

## 本地命令行发布器

命令行直接读取 `.md` 文件，不调用模型改写内容：

```bash
node scripts/mdpress-publish.mjs /absolute/path/article.md \
  --out /absolute/path/output \
  --wechat-template classic \
  --xhs-template border \
  --xhs-color red \
  --xhs-font hand \
  --xhs-font-size 16 \
  --asset-base-url https://cdn.example.com/assets/
```

默认输出到 Markdown 同目录的 `mdpress-output/<文件名>/`：

- `wechat.html`：可粘贴到公众号编辑器的内联样式 HTML
- `xhs/001.png`、`xhs/002.png`…：1080×1440 小红书图片
- `manifest.json`：生成参数与文件清单

常用参数：

```text
--targets wechat,xhs       仅生成指定目标，默认两个都生成
--force                    覆盖已有输出目录
--wechat-template          classic | program | band
--xhs-template             simple | border | handwrite
--xhs-color                blue | orange | teal | red | green | purple
--xhs-font                 hand | sans | serif | round
--xhs-font-size            13 到 22
```

公众号 Markdown 含本地图片时，必须提供 `--asset-base-url`，让相对路径映射为可访问的 HTTPS 地址。小红书图片可直接读取 Markdown 同目录的本地图片。首次生成小红书图片前，需要安装 Playwright Chromium：

```bash
npx playwright install chromium
```

表格、代码块或单张图片高于一张卡片的可用高度时，命令会停止并说明原因，不会输出被裁切的图片。

## 安装为本地 Codex Skill

此仓库包含 `mdpress-publisher` skill。克隆仓库并安装依赖后，运行：

```bash
node scripts/install-mdpress-skill.mjs
```

它会将 skill 安装到 `~/.codex/skills/mdpress-publisher/`，并记录当前仓库的绝对路径。若要覆盖已有同名 skill：

```bash
node scripts/install-mdpress-skill.mjs --force
```

之后在 Codex 中可以直接提出“使用 `mdpress-publisher` 生成这个 Markdown 的公众号 HTML 和小红书图片”。skill 只调用本地命令，不上传图片、不调用公众号素材库、不发布到任何平台。

## 项目结构

```text
src/                         网页编辑器与共享排版模块
scripts/mdpress-publish.mjs  本地 Markdown 发布命令
scripts/install-mdpress-skill.mjs
skills/mdpress-publisher/    可安装的 Codex skill 模板
test/                        单元与命令行集成测试
```

## 技术栈

Vue 3、Vite、markdown-it、highlight.js、Playwright、html2canvas。

## License

MIT
