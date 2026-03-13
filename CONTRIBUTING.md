# 贡献指南

感谢你对 TypesettingTools 项目的关注！我们欢迎任何形式的贡献。

## 如何贡献

### 报告问题

如果你发现了 bug 或有功能建议：

1. 在 [Issues](https://github.com/yourusername/TypesettingTools/issues) 页面搜索是否已有相关问题
2. 如果没有，创建新 Issue，并提供：
   - 清晰的标题和描述
   - 复现步骤（如果是 bug）
   - 预期行为和实际行为
   - 截图或错误信息（如果适用）
   - 浏览器版本和操作系统信息

### 提交代码

1. **Fork 项目**
   ```bash
   # 点击 GitHub 页面右上角的 Fork 按钮
   ```

2. **克隆到本地**
   ```bash
   git clone https://github.com/your-username/TypesettingTools.git
   cd TypesettingTools
   ```

3. **安装依赖**
   ```bash
   npm install
   ```

4. **创建分支**
   ```bash
   git checkout -b feature/your-feature-name
   # 或
   git checkout -b fix/your-bug-fix
   ```

5. **开发和测试**
   ```bash
   # 启动开发服务器
   npm run dev

   # 运行测试
   npm run test
   ```

6. **提交代码**
   ```bash
   git add .
   git commit -m "feat: 添加新功能描述"
   # 或
   git commit -m "fix: 修复问题描述"
   ```

   提交信息格式：
   - `feat:` 新功能
   - `fix:` 修复 bug
   - `docs:` 文档更新
   - `style:` 代码格式调整（不影响功能）
   - `refactor:` 代码重构
   - `test:` 测试相关
   - `chore:` 构建或辅助工具变动

7. **推送到 GitHub**
   ```bash
   git push origin feature/your-feature-name
   ```

8. **创建 Pull Request**
   - 访问你的 Fork 仓库页面
   - 点击 "New Pull Request"
   - 填写 PR 描述，说明改动内容和原因
   - 等待代码审查

## 开发规范

### 代码风格

- 使用 2 空格缩进
- 组件文件使用 PascalCase 命名（如 `StylePanel.vue`）
- 工具函数文件使用 camelCase 命名（如 `formatter.js`）
- 变量和函数使用 camelCase
- 常量使用 UPPER_SNAKE_CASE

### Vue 组件规范

- 使用 Composition API（`<script setup>`）
- Props 定义要包含类型和默认值
- 事件使用 `defineEmits` 声明
- 组件要有清晰的职责划分

### 测试

- 为新功能添加单元测试
- 确保所有测试通过：`npm run test`
- 测试覆盖核心逻辑和边界情况

### 提交前检查

- [ ] 代码符合项目风格
- [ ] 添加了必要的注释
- [ ] 更新了相关文档
- [ ] 添加或更新了测试
- [ ] 所有测试通过
- [ ] 本地构建成功：`npm run build`

## 项目结构

```
TypesettingTools/
├── src/
│   ├── components/       # Vue 组件
│   │   ├── Editor.vue    # Markdown 编辑器
│   │   ├── Preview.vue   # 预览组件
│   │   └── StylePanel.vue # 样式面板
│   ├── composables/      # Vue Composables
│   │   └── useHistory.js # 历史记录管理
│   ├── utils/            # 工具函数
│   │   ├── config.js     # 配置和主题
│   │   ├── formatter.js  # Markdown 格式化
│   │   └── punctuation.js # 标点处理
│   ├── styles/           # 全局样式
│   ├── App.vue           # 根组件
│   └── main.js           # 入口文件
├── test/                 # 测试文件
├── public/               # 静态资源
└── index.html            # HTML 模板
```

## 功能开发建议

### 添加新主题

1. 在 `src/utils/config.js` 的 `themePresets` 数组中添加新主题
2. 确保包含所有必需的样式属性
3. 在 `src/App.vue` 的 `themeName` 映射中添加显示名称

### 添加新的 Markdown 功能

1. 在 `src/utils/formatter.js` 中扩展 markdown-it 配置
2. 添加对应的样式定义
3. 在 `test/formatter.test.js` 中添加测试用例

### 优化性能

- 使用 `computed` 和 `watch` 时注意防抖
- 大型列表考虑虚拟滚动
- 图片处理注意内存占用

## 获取帮助

- 查看 [README.md](README.md) 了解项目基本信息
- 查看 [Issues](https://github.com/yourusername/TypesettingTools/issues) 寻找已知问题
- 在 Issue 中提问或讨论

## 行为准则

- 尊重所有贡献者
- 保持友好和专业的交流
- 接受建设性的批评
- 关注项目的最佳利益

## 许可证

通过贡献代码，你同意你的贡献将在 MIT 许可证下发布。

---

再次感谢你的贡献！🎉
