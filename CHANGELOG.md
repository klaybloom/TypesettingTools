# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- 撤销/重做功能（Ctrl+Z/Ctrl+Y）支持编辑历史管理
- 预计阅读时间统计（基于 400 字/分钟）
- 图片上传大小限制（最大 5MB）
- 8 个新主题预设（商务灰、森林绿、樱花粉、深海蓝、琥珀橙、薄荷绿、葡萄紫、夕阳红）
- 单元测试框架（Vitest）和 formatter.js 测试用例
- 导出图片加载状态指示器和旋转动画

### Changed
- 优化 formattedContent 计算属性，添加防抖处理（300ms）提升性能
- 重构 formatter.js 的 getStyles 函数，拆分为多个小函数提高可维护性
- 锁定 package.json 依赖版本（使用 `~` 替代 `^`）
- 优化 Vite 构建配置：代码分割、压缩优化、移除生产环境 console

### Fixed
- 增强 exportImage 错误提示，区分不同错误类型
- 修复图片读取失败时的错误处理

## [0.1.0] - 2026-03-13

### Added
- 编辑器与预览区域双向滚动同步
- 桌面/手机预览模式切换
- 多套主题预设（Notion、Vercel、Linear、Macaron、Cyberpunk、Retro、Neon）
- 明暗模式切换
- 样式面板抽屉式布局，带半透明遮罩

### Changed
- 将 Markdown 工具栏整合进编辑器顶栏
- 收紧主内容区间距，提升布局利用率
- 压缩样式设置面板的控件与留白
- 主题菜单仅保留中文展示，收紧列表间距

### Fixed
- 修复首行缩进误作用于列表项的问题
- 修复导出图片仅为当前页面的问题，改为导出完整长截图
- 修复有序列表和无序列表格式转换时出现多余空白的问题
- 修复列表项内的段落样式，去掉额外的 margin

## [0.0.1] - 2026-03-10

### Added
- 使用 markdown-it 实现 Markdown 解析
- 集成 highlight.js 实现代码块语法高亮
- 集中式样式配置系统
- 编辑器与预览区域同步滚动功能

### Changed
- 重构 Markdown 解析引擎与样式系统

## [0.0.0] - 2026-02-06

### Added
- 基于 Vue 3 + Vite 搭建项目框架
- 基础 Markdown 编辑与预览功能
- 一键复制排版内容到剪贴板
- 基础样式面板与排版参数配置

[Unreleased]: https://github.com/yourusername/TypesettingTools/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/yourusername/TypesettingTools/compare/v0.0.1...v0.1.0
[0.0.1]: https://github.com/yourusername/TypesettingTools/compare/v0.0.0...v0.0.1
[0.0.0]: https://github.com/yourusername/TypesettingTools/releases/tag/v0.0.0
