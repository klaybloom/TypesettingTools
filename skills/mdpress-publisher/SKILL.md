---
name: mdpress-publisher
description: 将指定 Markdown 文件原样排版为微信公众号内联 HTML 和小红书 1080×1440 PNG 图片。用户提出生成公众号 HTML、制作小红书图文或使用 mdpress 发布器时使用；不改写、上传或发布内容。
---

# mdpress 发布器

使用本机项目 `{{PROJECT_DIR}}` 中的 `scripts/mdpress-publish.mjs`。网页编辑器用于可视化预览；此 skill 只运行本地生成命令。

## 使用规则

1. 确认输入文件存在且扩展名为 `.md`，不得修改原文。
2. 未指定目标时，同时生成公众号 HTML 和小红书图片；默认模板为公众号 `classic`、小红书 `border`。
3. 可选模板与参数：
   - 公众号：`classic`、`program`、`band`
   - 小红书：`simple`、`border`、`handwrite`
   - 配色：`blue`、`orange`、`teal`、`red`、`green`、`purple`
   - 字体：`hand`、`sans`、`serif`、`round`
4. 公众号内容有本地图片时，必须取得 `--asset-base-url` 的 HTTPS 前缀；不能编造资源地址。
5. 输出目录已存在时保留原有内容；仅在用户明确要求覆盖时使用 `--force`。

## 命令

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

默认输出位于 Markdown 文件旁的 `mdpress-output/<文件名>/`，包含 `wechat.html`、`xhs/001.png` 起的连续图片，以及 `manifest.json`。

## 边界

- 不调用模型改写 Markdown，不生成标题、发布文案或话题。
- 不上传图片，不调用公众号素材库，不发布小红书。
- Chromium 缺失时提示执行 `npx playwright install chromium`。
- 表格、代码块或单张图片超过一张卡片可用高度时，停止并报告错误，不输出裁切图片。
