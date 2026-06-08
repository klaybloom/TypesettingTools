<template>
  <div class="card-pane">
    <div class="card-stage">
      <div v-if="!cards.length" class="card-empty">
        <svg viewBox="0 0 24 24" width="46" height="46">
          <path fill="currentColor" opacity="0.3" d="M4 6h16v2H4zm0 5h16v2H4zm0 5h10v2H4z"/>
        </svg>
        <p>{{ splitting ? '正在拆分卡片...' : '在左侧输入内容即可生成卡片' }}</p>
      </div>

      <template v-else>
        <div class="card-viewport">
          <CardCanvas
            :blocks="cards[safeIndex] || []"
            :settings="settings"
            :index="safeIndex"
            :total="cards.length"
          />
        </div>

        <div class="card-pager">
          <button class="pager-btn" :disabled="safeIndex === 0" @click="go(-1)">‹</button>
          <input
            class="pager-slider"
            type="range"
            min="0"
            :max="cards.length - 1"
            :value="safeIndex"
            @input="$emit('update:index', +$event.target.value)"
          />
          <span class="pager-count">{{ safeIndex + 1 }} / {{ cards.length }}</span>
          <button class="pager-btn" :disabled="safeIndex >= cards.length - 1" @click="go(1)">›</button>
        </div>

        <p v-if="overflowNotice" class="card-warn">部分内容过长，单张卡片已裁剪显示</p>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import CardCanvas from './CardCanvas.vue'

const props = defineProps({
  cards: { type: Array, default: () => [] },
  settings: { type: Object, required: true },
  index: { type: Number, default: 0 },
  splitting: { type: Boolean, default: false },
  overflowNotice: { type: Boolean, default: false }
})

const emit = defineEmits(['update:index'])

const safeIndex = computed(() => {
  if (!props.cards.length) return 0
  return Math.min(Math.max(props.index, 0), props.cards.length - 1)
})

function go(delta) {
  const next = Math.min(Math.max(safeIndex.value + delta, 0), props.cards.length - 1)
  emit('update:index', next)
}
</script>

<style scoped>
.card-pane {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 18px;
  overflow: hidden;
}

.card-stage {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  min-width: 0;
  overflow: auto;
}

.card-viewport {
  display: flex;
  justify-content: center;
}

.card-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: var(--text-tertiary);
  text-align: center;
}

.card-empty p { font-size: 0.85rem; }

.card-pager {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  max-width: 360px;
}

.pager-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 16px;
  line-height: 1;
  color: var(--text-secondary);
  background: var(--ui-muted-bg);
  border: 1px solid var(--ui-muted-border);
}

.pager-btn:disabled { opacity: 0.35; }

.pager-slider {
  flex: 1;
  height: 3px;
  background: var(--border-color);
  border-radius: 2px;
  appearance: none;
  cursor: pointer;
}

.pager-slider::-webkit-slider-thumb {
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--accent-primary);
  cursor: pointer;
}

.pager-count {
  font-size: 12px;
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
  min-width: 48px;
  text-align: right;
}

.card-warn {
  font-size: 11px;
  color: #c0552d;
}
</style>
