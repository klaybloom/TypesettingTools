<template>
  <div ref="surfaceRef" class="card-export-surface" aria-hidden="true">
    <CardCanvas
      v-if="active"
      ref="canvasRef"
      :blocks="active.blocks"
      :settings="settings"
      :index="active.index"
      :total="active.total"
    />
  </div>
</template>

<script setup>
import { nextTick, ref } from 'vue'
import CardCanvas from './CardCanvas.vue'
import { renderElementToCanvas, downloadCanvas, canvasToBlob } from '../composables/useImageExport.js'

const props = defineProps({
  settings: { type: Object, required: true }
})

const surfaceRef = ref(null)
const active = ref(null)

async function renderCard(blocks, index, total) {
  active.value = { blocks, index, total }
  await nextTick()
  // 等待离屏 CardCanvas 内图片解码
  const imgs = Array.from(surfaceRef.value.querySelectorAll('img'))
  if (imgs.length) {
    await Promise.all(imgs.map((img) => (img.decode ? img.decode().catch(() => {}) : Promise.resolve())))
  }
  const cardEl = surfaceRef.value.firstElementChild
  return renderElementToCanvas(cardEl, 3)
}

async function exportOne(blocks, index, total, prefix = 'xhs-card') {
  const canvas = await renderCard(blocks, index, total)
  downloadCanvas(canvas, `${prefix}-${index + 1}.png`)
  active.value = null
}

async function exportAll(cards, prefix = 'xhs-card') {
  for (let i = 0; i < cards.length; i++) {
    const canvas = await renderCard(cards[i], i, cards.length)
    downloadCanvas(canvas, `${prefix}-${i + 1}.png`)
  }
  active.value = null
}

async function copyOne(blocks, index, total) {
  const canvas = await renderCard(blocks, index, total)
  const blob = await canvasToBlob(canvas)
  active.value = null
  if (!blob) return false
  try {
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
    return true
  } catch (_) {
    return false
  }
}

defineExpose({ exportOne, exportAll, copyOne })
</script>

<style scoped>
.card-export-surface {
  position: fixed;
  left: -100000px;
  top: 0;
  pointer-events: none;
}
</style>
