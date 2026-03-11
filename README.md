# 📝 微信公众号排版工具

一款基于 Vue 3 + Vite 构建的微信公众号文章排版工具，支持 Markdown 编写、实时预览、一键复制和导出图片，让公众号排版更高效、更美观。

## ✨ 功能特性

### 📖 Markdown 编辑与解析
- 基于 **markdown-it** 的强大解析引擎，完整支持 GFM（GitHub Flavored Markdown）语法
- 支持标题、段落、列表（有序/无序）、引用、表格、脚注、任务列表等常见格式
- 支持图片和链接的渲染

### 🎨 代码高亮
- 集成 **highlight.js**，支持多种编程语言的语法高亮
- 代码块自动识别语言并着色，提升阅读体验

### 🖌️ 主题与样式
- 内置多套配色主题预设，一键切换不同风格
- 可自定义正文字号、字体颜色、段落间距等排版参数
- 支持首行缩进选项
- 样式面板侧边栏，设置便捷直观

### 👀 实时预览
- 左右分栏布局，左侧编辑、右侧实时预览
- 编辑器与预览区域同步滚动，所见即所得

### 📋 一键复制
- 将排版后的富文本内容一键复制到剪贴板
- 直接粘贴至微信公众号编辑器，格式完美保留

### 📸 导出图片
- 支持将排版内容导出为长截图（整页）
- 基于 **html2canvas** 实现高质量图片导出

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

### 预览生产构建

```bash
npm run preview
```

## 📁 项目结构

```
TypesettingTools/
├── src/
│   ├── App.vue              # 主应用组件
│   ├── main.js              # 应用入口
│   ├── components/
│   │   ├── Editor.vue       # Markdown 编辑器组件
│   │   ├── Preview.vue      # 实时预览组件
│   │   └── StylePanel.vue   # 样式设置面板
│   ├── styles/
│   │   ├── base.css         # 基础样式
│   │   └── variables.css    # CSS 变量定义
│   └── utils/
│       ├── config.js        # 主题与配置管理
│       ├── formatter.js     # Markdown 格式化与样式内联
│       └── punctuation.js   # 中文标点处理
├── index.html               # HTML 入口
├── vite.config.js           # Vite 配置
└── package.json             # 项目配置
```

## 📄 License

MIT
