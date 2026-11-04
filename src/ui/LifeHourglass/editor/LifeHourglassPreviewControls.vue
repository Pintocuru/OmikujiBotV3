```vue
<!-- src/ui/LifeHourglass/editor/LifeHourglassPreviewControls.vue -->
<template>
  <div class="flex flex-col gap-1 p-1.5 rounded-box bg-base-200">
    <!-- 同時接続数 -->
    <label class="flex items-center gap-2 text-xs">
      同接
      <input v-model.number="state.viewer" type="number" min="0" class="input input-bordered input-xs w-16" />
    </label>

    <!-- 時間操作 -->
    <div class="flex flex-wrap items-center gap-1">
      <span class="text-xs opacity-70">時間</span>
      <button v-for="s in SECONDS" :key="s.seconds" class="btn btn-xs" @click="addSeconds(s.seconds)">
        {{ s.label }}
      </button>
    </div>

    <!-- ギフト -->
    <div class="flex flex-wrap items-center gap-1">
      <span class="text-xs opacity-70">ギフト</span>
      <button v-for="yen in GIFTS" :key="yen" class="btn btn-xs btn-warning" @click="addGift(yen)">
        ¥{{ yen.toLocaleString('ja-JP') }}
      </button>
    </div>

    <!-- リセット -->
    <div class="flex justify-end">
      <button class="btn btn-xs btn-ghost" @click="reset">リセット</button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { watch } from 'vue'
  import { useLifeHourglassPreview, type LifeHourglassPreviewState } from './useLifeHourglassPreview'

  const emit = defineEmits<{
    update: [value: LifeHourglassPreviewState]
  }>()

  const { state, addSeconds, addGift, reset } = useLifeHourglassPreview()

  const SECONDS = [
    { label: '+10秒', seconds: 10 },
    { label: '+1分', seconds: 60 },
    { label: '+10分', seconds: 600 },
    { label: '+1時間', seconds: 3600 },
  ]

  const GIFTS = [100, 1_000, 10_000]

  // 状態の変化を、プレビュー表示側へスナップショットで渡す
  watch(state, () => emit('update', { ...state }), { deep: true, immediate: true })
</script>
```
