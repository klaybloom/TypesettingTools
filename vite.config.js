import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [vue()],
    server: {
        port: 5173,
        open: true
    },
    build: {
        // 代码分割优化
        rollupOptions: {
            output: {
                manualChunks: {
                    // 将 Vue 相关库打包到一起
                    'vue-vendor': ['vue'],
                    // 将 Markdown 相关库打包到一起
                    'markdown-vendor': [
                        'markdown-it',
                        'markdown-it-footnote',
                        'markdown-it-task-lists'
                    ],
                    // 将代码高亮库单独打包
                    'highlight-vendor': ['highlight.js'],
                    // 将 html2canvas 单独打包
                    'canvas-vendor': ['html2canvas']
                }
            }
        },
        // 压缩优化
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true, // 生产环境移除 console
                drop_debugger: true
            }
        },
        // chunk 大小警告阈值
        chunkSizeWarningLimit: 1000,
        // 启用 CSS 代码分割
        cssCodeSplit: true,
        // 构建目标
        target: 'es2015',
        // 生成 sourcemap
        sourcemap: false
    },
    // 优化依赖预构建
    optimizeDeps: {
        include: [
            'vue',
            'markdown-it',
            'markdown-it-footnote',
            'markdown-it-task-lists',
            'highlight.js',
            'html2canvas'
        ]
    }
})
