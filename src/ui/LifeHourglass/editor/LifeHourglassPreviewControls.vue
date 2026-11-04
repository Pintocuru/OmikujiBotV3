<!-- src/ui/LifeHourglass/editor/LifeHourglassPreviewControls.vue -->
<template>
  <div class="flex flex-col gap-3 p-2 rounded-box bg-base-200">
    <div class="text-sm font-bold">プレビュー操作</div>

    <label class="flex items-center gap-2 text-sm">
      同時接続数
      <input v-model.number="state.viewer" type="number" min="0" class="input input-bordered input-sm w-24" />
    </label>

    <div class="flex flex-wrap items-center gap-2">
      <span class="text-xs opacity-70 w-full">同接ぶんを進める</span>
      <button v-for="s in SECONDS" :key="s.seconds" class="btn btn-sm" @click="addSeconds(s.seconds)">
        {{ s.label }}
      </button>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <span class="text-xs opacity-70 w-full">ギフト</span>
      <button v-for="yen in GIFTS" :key="yen" class="btn btn-sm btn-warning" @click="addGift(yen)">
        ¥{{ yen.toLocaleString('ja-JP') }}
      </button>
    </div>

    <div class="flex flex-wrap gap-2">
      <button class="btn btn-sm btn-ghost" @click="reset">リセット</button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { watch } from 'vue'
  import { useLifeHourglassPreview, type LifeHourglassPreviewState } from './useLifeHourglassPreview'

  const emit = defineEmits<{ (e: 'update', value: LifeHourglassPreviewState): void }>()

  const { state, addSeconds, addGift, skipToBeforeDome, reset } = useLifeHourglassPreview()

  const SECONDS = [
    { label: '+10秒', seconds: 10 },
    { label: '+1分', seconds: 60 },
    { label: '+10分', seconds: 600 },
    { label: '+1時間', seconds: 3600 },
  ]
  const GIFTS = [100, 1_000, 10_000]
  const SPEEDS = [
    { label: '停止', speed: 0 },
    { label: '×1', speed: 1 },
    { label: '×60', speed: 60 },
    { label: '×600', speed: 600 },
  ]

  // 状態の変化を、プレビュー表示側へスナップショットで渡す
  watch(state, () => emit('update', { ...state }), { deep: true, immediate: true })
</script>
