<!-- src/editor/shell/GeneratorStage.vue -->
<template>
  <div class="flex flex-col h-full min-h-0 gap-2">
    <!-- 表示サイズ・背景の操作 -->
    <div class="flex flex-wrap items-center gap-2 text-xs">
      <div class="join">
        <input
          type="number"
          min="100"
          :value="logicalWidth"
          class="input input-bordered input-xs join-item w-20 text-center"
          title="横幅(px)"
          @change="onSizeInput('w', $event)"
        />
        <span class="join-item bg-base-200 px-1 flex items-center">×</span>
        <input
          type="number"
          min="100"
          :value="logicalHeight"
          class="input input-bordered input-xs join-item w-20 text-center"
          title="縦幅(px)"
          @change="onSizeInput('h', $event)"
        />
      </div>

      <div class="join">
        <button class="btn btn-xs join-item" :class="fit ? 'btn-accent' : 'btn-outline'" @click="fit = true">
          全体に合わせる
        </button>
        <button
          v-for="preset in SIZE_PRESETS"
          :key="preset.label"
          class="btn btn-xs btn-outline join-item"
          @click="setSize(preset.w, preset.h)"
        >
          {{ preset.label }}
        </button>
      </div>

      <div class="flex items-center gap-1" title="表示倍率">
        <span class="opacity-60">{{ Math.round(scale * 100) }}%</span>
        <input type="range" min="0.2" max="2" step="0.1" v-model.number="scale" class="range range-xs w-30" />
      </div>

      <div class="join">
        <button
          v-for="bg in BG_OPTIONS"
          :key="bg.key"
          class="btn btn-xs join-item"
          :class="background === bg.key ? 'btn-accent' : 'btn-outline'"
          @click="background = bg.key"
        >
          {{ bg.label }}
        </button>
      </div>
    </div>

    <!-- ステージ: 余白をスクロールできる領域の中に、サイズ可変の枠を置く -->
    <div class="flex-1 min-h-0 overflow-auto rounded bg-base-300 p-2">
      <div
        ref="outerRef"
        class="relative overflow-hidden outline outline-base-content/30"
        :class="fit ? 'w-full h-full' : 'resize'"
        :style="outerStyle"
      >
        <!-- 倍率をかけた内側。生成側(OBS 想定)のレイアウトには 100% 幅・高さとして見える -->
        <div class="stage-inner origin-top-left" :style="innerStyle">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref } from 'vue'

  type BackgroundKey = 'checker' | 'green' | 'dark' | 'light'

  const SIZE_PRESETS = [
    { label: '300x400', w: 300, h: 400 },
    { label: '600×900', w: 600, h: 900 },
  ] as const

  const BG_OPTIONS: { key: BackgroundKey; label: string }[] = [
    { key: 'checker', label: '透過' },
    { key: 'dark', label: '黒' },
    { key: 'light', label: '白' },
  ]

  const BG_STYLES: Record<BackgroundKey, Record<string, string>> = {
    checker: {
      backgroundColor: '#999',
      backgroundImage: 'conic-gradient(#777 25%, #aaa 0 50%, #777 0 75%, #aaa 0)',
      backgroundSize: '16px 16px',
    },
    green: { backgroundColor: '#00b140' },
    dark: { backgroundColor: '#111' },
    light: { backgroundColor: '#f5f5f5' },
  }

  const fit = ref(true) // true: 領域いっぱいに広げる
  const fixedWidth = ref(1280) // fit=false のときの横幅(倍率をかける前のpx)
  const fixedHeight = ref(720)
  const scale = ref(1)
  const background = ref<BackgroundKey>('checker')

  // 枠の実寸(倍率をかけた後)
  const outerRef = ref<HTMLElement | null>(null)
  const boxWidth = ref(0)
  const boxHeight = ref(0)

  // ジェネレーターから見たサイズ(= 実寸 ÷ 倍率)
  const logicalWidth = computed(() => Math.round(boxWidth.value / scale.value))
  const logicalHeight = computed(() => Math.round(boxHeight.value / scale.value))

  const outerStyle = computed(() => ({
    ...(fit.value
      ? {}
      : { width: `${fixedWidth.value * scale.value}px`, height: `${fixedHeight.value * scale.value}px` }),
    ...BG_STYLES[background.value],
    minWidth: '120px',
    minHeight: '120px',
    maxWidth: '100%',
  }))

  const innerStyle = computed(() => ({
    width: `${logicalWidth.value}px`,
    height: `${logicalHeight.value}px`,
    transform: `scale(${scale.value})`,
    // ジェネレーター側を透過表示にする(OBS 用 CSS と同じ状態)
    '--color-base-100': 'transparent',
  }))

  function setSize(w: number, h: number) {
    fit.value = false
    fixedWidth.value = w
    fixedHeight.value = h
  }

  function onSizeInput(axis: 'w' | 'h', event: Event) {
    const value = Number((event.target as HTMLInputElement).value)
    if (!Number.isFinite(value) || value < 100) return
    setSize(axis === 'w' ? value : logicalWidth.value, axis === 'h' ? value : logicalHeight.value)
  }

  let observer: ResizeObserver | null = null
  onMounted(() => {
    if (!outerRef.value) return
    observer = new ResizeObserver(([entry]) => {
      boxWidth.value = entry.contentRect.width
      boxHeight.value = entry.contentRect.height
      // 右下のハンドルでサイズを変えたときも、固定サイズとして覚える
      if (!fit.value) {
        fixedWidth.value = Math.round(entry.contentRect.width / scale.value)
        fixedHeight.value = Math.round(entry.contentRect.height / scale.value)
      }
    })
    observer.observe(outerRef.value)
  })
  onUnmounted(() => observer?.disconnect())
</script>

<style scoped>
  /* ジェネレーターのルートは h-screen(画面高さ)なので、ステージ内では枠の高さに合わせる */
  .stage-inner :deep(.h-screen) {
    height: 100%;
  }
  /* 100% の高さは、親が高さを持っていないと 0 になる。ジェネレーターのルート(h-screen の親)にも高さを渡す */
  .stage-inner > :deep(*) {
    height: 100%;
  }
</style>
