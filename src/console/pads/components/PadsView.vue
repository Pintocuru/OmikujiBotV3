<!-- src/console/pads/components/PadsView.vue -->
<!-- ポン出しのボタンを押す画面 (押すと、OBS のジェネレーターで「ポン出しイベント」が発火する) -->
<template>
  <div class="flex flex-col">
    <!-- ツールバー -->
    <div class="flex flex-wrap items-center justify-end gap-3 px-4 pt-3">
      <span class="badge" :class="status === 'online' ? 'badge-success' : 'badge-error'">
        {{ status === 'online' ? '接続中' : '未接続' }}
      </span>
      <label class="label gap-2 text-sm">
        ボタン構成
        <select v-model.number="layout" class="select select-sm select-bordered">
          <option v-for="n in padLayouts" :key="n" :value="n">
            {{ n }}個 ({{ padGridSize[n] }}×{{ padGridSize[n] }})
          </option>
        </select>
      </label>
    </div>

    <StatusNotice :status="status" :errorMessage="errorMessage" />

    <main class="mx-auto flex w-full max-w-xl flex-col gap-3 p-4">
      <!-- ボタン (CSS Grid。pad-1 から左上→右→下へ) -->
      <div class="grid gap-3" :style="{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }">
        <button
          v-for="padId in pads"
          :key="padId"
          type="button"
          class="btn aspect-square h-auto min-h-16 text-2xl"
          :class="flashingPadId === padId ? 'btn-primary' : 'btn-neutral'"
          :data-pad-id="padId"
          @click="press(padId)"
        >
          {{ padId.replace('pad-', '') }}
        </button>
      </div>

      <p class="text-center text-sm opacity-60">
        <template v-if="lastPressed">最後に押したボタン: {{ lastPressed.padId.replace('pad-', '') }}</template>
        <template v-else>ボタンを押すと、ジェネレーターの「ポン出しイベント」が発火します</template>
      </p>
    </main>
  </div>
</template>

<script setup lang="ts">
  import { padGridSize, padLayouts } from '@/types/OmikujiData'
  import { usePadsConsole } from '../composables/usePadsConsole'
  import StatusNotice from '@/console/common/components/StatusNotice.vue'

  const { layout, gridSize, pads, status, errorMessage, lastPressed, flashingPadId, press } = usePadsConsole()
</script>
