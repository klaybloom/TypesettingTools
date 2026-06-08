# mdpress · Markdown 多模式内容创作工具

一款基于 Vue 3 + Vite 构建的 Markdown 内容创作工具，支持**原生预览**、**微信公众号排版**和**小红书卡片生成**三种模式，让 Markdown 写作一次、多端分发。

## ✨ 功能特性

### 📝 Markdown 编辑
- 基于 **markdown-it** 的解析引擎，完整支持 GFM 语法
- 左侧编辑器常驻，右侧三种预览模式实时联动
- 支持标题、列表、引用、表格、脚注、任务列表、代码块等格式
- 集成 **highlight.js** 代码语法高亮
- 撤销 / 重做历史、Markdown 工具栏

### 👁 原生预览
- GitHub 风格的干净文档排版
- 支持桌面 / 手机宽度切换
- 导出为长截图（PNG）或 PDF

### 📱 公众号排版
- 移动端宽度模拟器预览，贴近公众号实际效果
- **7 套公众号模板**：经典、杂志、极简、极客、暖阳、色块、程序
- 模板覆盖完整标题体系、引用、分割线，切换差异一目了然
- 自定义正文字号、行间距、正文色、强调色、首行缩进
- 悬浮样式面板，鼠标悬浮即可切换模板与参数
- **一键复制**为内联样式 HTML，直接粘贴到公众号后台编辑器
- 导出为图片或 PDF

### 🖼 小红书卡片
- **自动拆卡引擎**：长文自动拆分为多张 3:4 竖版卡片
- 离屏测量 + 贪心装箱算法，智能避免在段落中间断页
- **6 套卡片模板**：边框、简约、备忘、Twitter、手写、几何
- 6 种配色方案 + 4 种字体风格 + 字号滑杆
- 翻页滑杆浏览全部卡片
- 单张 / 全部导出 1080×1440 高清 PNG

### 🎨 界面
- 深色 / 浅色模式切换
- 右侧框内 Tab 切换，编辑器常驻不丢失上下文
- 导出菜单下拉，头部按钮精简不杂乱

## 🛠️ 技术栈

| 技术 | 说明 |
|------|------|
| **Vue 3** | 前端框架 |
| **Vite 5** | 构建工具 |
| **markdown-it** | Markdown 解析引擎 |
| **highlight.js** | 代码语法高亮 |
| **html2canvas** | 页面截图导出 |

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 运行测试

```bash
npm test
```

## 📁 项目结构

```
src/
├── App.vue                            # 主应用容器
├── main.js                            # 应用入口
├── components/
│   ├── Editor.vue                     # Markdown 编辑器
│   ├── NativePreview.vue              # 原生 Markdown 预览
│   ├── Preview.vue                    # 公众号桌面/手机预览
│   ├── CardCanvas.vue                 # 小红书卡片渲染
│   ├── CardPane.vue                   # 卡片翻页 + 预览
│   ├── CardExportSurface.vue          # 卡片离屏导出画布
│   ├── WechatPane.vue                 # 公众号预览容器
│   ├── ExportSurface.vue              # 文章离屏导出画布
│   ├── PrintSurface.vue               # PDF 打印画布
│   ├── ExportMenu.vue                 # 导出下拉菜单
│   └── SettingsPopover.vue            # 悬浮样式设置面板
├── composables/
│   ├── useAppearance.js               # 深浅模式
│   ├── useClipboardHtml.js            # HTML 富文本复制
│   ├── useHistory.js                  # 撤销/重做历史
│   ├── useImageExport.js              # 长图/PNG 导出
│   ├── useCardSplitter.js             # 小红书自动拆卡引擎
│   ├── useCardSettings.js             # 卡片设置持久化
│   ├── useViewMode.js                 # 视图模式状态
│   ├── usePersistentStyleSettings.js  # 排版设置持久化
│   ├── useRenderedDocument.js         # Markdown → HTML 渲染
│   └── useToast.js                    # 全局轻提示
├── styles/
│   ├── base.css                       # 基础重置
│   ├── variables.css                  # 主题 CSS 变量
│   ├── native-preview.css             # 原生预览样式
│   └── print.css                      # 打印/PDF 样式
└── utils/
    ├── articleStyle.js                # 文章内联样式表
    ├── cardStyle.js                   # 卡片样式引擎
    ├── cardTemplates.js               # 卡片模板与配色
    ├── config.js                      # 默认配置
    ├── formatter.js                   # markdown-it 渲染管线
    ├── wechatTemplates.js             # 公众号模板系统
    └── punctuation.js                 # 中文标点规范化
```

## 📄 License

MIT
