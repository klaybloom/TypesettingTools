import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    environmentMatchGlobs: [
      ['test/browser/**/*.test.js', 'jsdom']
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.config.js',
        '**/test/**'
      ]
    }
  }
})
