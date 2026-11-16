<!-- src/ui/LifeHourglass/editor/LifeHourglassPreviewControls.vue -->
<template>
  <div class="flex flex-col gap-1 p-1.5 rounded-box bg-base-200">
    <!-- 同時接続数 -->
    <label class="flex items-center gap-2 text-xs">
      {{ $t('uiSettings.lifeHourglass.preview.viewer') }}
      <input v-model.number="state.viewer" type="number" min="0" class="input input-bordered input-xs w-16" />
    </label>

    <!-- 時間操作 -->
    <div class="flex flex-wrap items-center gap-1">
      <span class="text-xs opacity-70">{{ $t('uiSettings.lifeHourglass.preview.time') }}</span>
      <button v-for="s in SECONDS" :key="s.seconds" class="btn btn-xs" @click="addSeconds(s.seconds)">
        {{ $t(s.labelKey) }}
      </button>
    </div>

    <!-- ギフト -->
    <div class="flex flex-wrap items-center gap-1">
      <span class="text-xs opacity-70">{{ $t('uiSettings.lifeHourglass.preview.gift') }}</span>
      <button v-for="yen in GIFTS" :key="yen" class="btn btn-xs btn-warning" @click="addGift(yen)">
        ¥{{ yen.toLocaleString('ja-JP') }}
      </button>
    </div>

    <!-- リセット -->
    <div class="flex justify-end">
      <button class="btn btn-xs btn-ghost" @click="reset">
        {{ $t('uiSettings.lifeHourglass.preview.reset') }}
      </button>
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
    { labelKey: 'uiSettings.lifeHourglass.preview.add10s', seconds: 10 },
    { labelKey: 'uiSettings.lifeHourglass.preview.add1m', seconds: 60 },
    { labelKey: 'uiSettings.lifeHourglass.preview.add10m', seconds: 600 },
    { labelKey: 'uiSettings.lifeHourglass.preview.add1h', seconds: 3600 },
  ]

  const GIFTS = [100, 1_000, 10_000]

  // 状態の変化を、プレビュー表示側へスナップショットで渡す
  watch(state, () => emit('update', { ...state }), { deep: true, immediate: true })
</script>
