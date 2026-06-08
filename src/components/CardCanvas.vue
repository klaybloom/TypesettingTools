<template>
  <div class="xhs-card" :style="rootStyle">
    <div class="xhs-card__panel" :style="panelStyle"></div>
    <div class="xhs-card__layer" :style="layerStyle">
      <!-- 顶部装饰 chrome -->
      <div class="xhs-card__deco-top" :style="{ height: tpl.reserveTop + 'px' }">
        <template v-if="tpl.decoTop?.type === 'dots'">
          <span class="deco-dots"><i></i><i></i><i></i></span>
          <span class="deco-tag" :style="{ color: scheme.accent }">{{ tpl.decoTop.label }}</span>
        </template>
        <template v-else-if="tpl.decoTop?.type === 'avatar'">
          <span class="deco-avatar" :style="{ background: scheme.accent }"></span>
          <span class="deco-handle">@mdpress</span>
        </template>
        <template v-else-if="tpl.decoTop?.type === 'quote'">
          <span class="deco-quote" :style="{ color: scheme.accent }">&ldquo;</span>
        </template>
      </div>

      <!-- 正文 -->
      <div class="xhs-card__content" :style="contentStyle" v-html="bodyHtml"></div>

      <!-- 底部装饰 chrome -->
      <div class="xhs-card__deco-bottom" :style="{ height: tpl.reserveBottom + 'px' }">
        <template v-if="tpl.decoBottom?.type === 'rule-date'">
          <span class="deco-rule" :style="{ background: scheme.accent + '40' }"></span>
          <span class="deco-date">{{ pageLabel }}</span>
        </template>
        <template v-else-if="tpl.decoBottom?.type === 'meta'">
          <span class="deco-meta">{{ pageLabel }} · mdpress</span>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  CARD_WIDTH,
  CARD_HEIGHT,
  CARD_PADDING,
  getCardTemplate,
  getColorScheme,
  getFontFamily
} from '../utils/cardTemplates.js'
import { createCardStyles } from '../utils/cardStyle.js'

const props = defineProps({
  blocks: { type: Array, default: () => [] }, // 当前卡的块 outerHTML 数组
  settings: { type: Object, required: true },
  index: { type: Number, default: 0 },
  total: { type: Number, default: 1 }
})

const tpl = computed(() => getCardTemplate(props.settings.templateId))
const scheme = computed(() => getColorScheme(props.settings.colorSchemeId))
const font = computed(() => getFontFamily(props.settings.fontFamilyId))
const styleMap = computed(() => createCardStyles(props.settings))

const bodyHtml = computed(() => props.blocks.join('\n'))
const pageLabel = computed(() => `${props.index + 1} / ${props.total}`)

const rootStyle = computed(() => ({
  width: CARD_WIDTH + 'px',
  height: CARD_HEIGHT + 'px',
  background: tpl.value.pageBg(scheme.value)
}))

const panelStyle = computed(() => {
  const inset = tpl.value.frameInset + 'px'
  return `position:absolute; top:${inset}; left:${inset}; right:${inset}; bottom:${inset}; background:${tpl.value.panelBg(scheme.value)}; ${tpl.value.panelStyle}`
})

const layerStyle = computed(() => ({ padding: CARD_PADDING + 'px' }))

const contentStyle = computed(() => ({
  flex: '1 1 auto',
  overflow: 'hidden',
  fontFamily: font.value.stack,
  color: scheme.value.text,
  fontSize: props.settings.fontSize + 'px',
  lineHeight: '1.75'
}))
</script>

<style scoped>
.xhs-card {
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}

.xhs-card__panel {
  position: absolute;
}

.xhs-card__layer {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.xhs-card__deco-top,
.xhs-card__deco-bottom {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  overflow: hidden;
}

.xhs-card__deco-bottom {
  justify-content: space-between;
}

.deco-dots { display: inline-flex; gap: 3px; }
.deco-dots i { width: 5px; height: 5px; border-radius: 50%; background: #c8c8c8; }
.deco-tag { margin-left: auto; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; }

.deco-avatar { width: 26px; height: 26px; border-radius: 50%; }
.deco-handle { font-size: 12px; color: #657786; }

.deco-quote { font-size: 40px; line-height: 1; font-weight: 700; }

.deco-rule { flex: 1; height: 1px; }
.deco-date { font-size: 11px; color: #9aa0a6; font-style: italic; white-space: nowrap; }
.deco-meta { font-size: 11px; color: #9aa0a6; }

.xhs-card__content :deep(*:first-child) { margin-top: 0 !important; }
.xhs-card__content :deep(*:last-child) { margin-bottom: 0 !important; }
</style>
