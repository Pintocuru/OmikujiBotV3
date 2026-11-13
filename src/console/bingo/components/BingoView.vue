<!-- src/console/bingo/components/BingoView.vue -->
<!-- ライバービンゴを操作する画面 (OBS のカードの写しを見ながら、進捗・お題・注目・リセットを命令する) -->
<template>
  <div class="flex flex-col">
    <!-- ツールバー -->
    <div class="flex flex-wrap items-center justify-end gap-3 px-4 pt-3">
      <span class="badge" :class="obsActive ? 'badge-success' : 'badge-warning'">
        <template v-if="obsActive">OBS と接続中</template>
        <template v-else-if="snapshot">OBS からの更新なし ({{ obsAgeSeconds }} 秒前)</template>
        <template v-else>OBS からの更新待ち</template>
      </span>
      <button type="button" class="btn btn-sm" :disabled="!snapshot" @click="focusRandom">ランダム注目</button>
      <button type="button" class="btn btn-sm" :disabled="!snapshot" @click="focus(null)">注目を解除</button>
      <button type="button" class="btn btn-error btn-sm" :disabled="!snapshot" @click="confirmReset">リセット</button>
    </div>

    <StatusNotice :status="status" :errorMessage="errorMessage" />

    <main v-if="status !== 'offline' && status !== 'error'" class="mx-auto flex w-full max-w-5xl flex-col gap-3 p-4">
      <p v-if="!snapshot" class="text-center text-sm opacity-60">
        OBS にライバービンゴを表示すると、ここにカードが出ます(エディターのプレビューは対象外です)
      </p>

      <div v-else class="grid gap-2" :style="{ gridTemplateColumns: `repeat(${snapshot.cardSize}, minmax(0, 1fr))` }">
        <div
          v-for="(cell, index) in snapshot.cells"
          :key="index"
          class="flex flex-col gap-1 rounded border p-2"
          :class="cellClass(cell, index)"
        >
          <!-- お題 -->
          <input
            type="text"
            class="input input-bordered input-xs w-full"
            :value="cell.title"
            :aria-label="`${index + 1} マス目のお題`"
            @change="commitTitle(index, $event)"
          />

          <!-- 進捗 -->
          <div class="flex items-center justify-between gap-1">
            <button type="button" class="btn btn-xs btn-square" aria-label="進捗 -1" @click="decrement(index)">
              −
            </button>
            <span class="text-center text-sm">
              <span class="text-lg font-bold">{{ cell.progress * cell.unit }}</span>
              / {{ cell.target * cell.unit }}
            </span>
            <button type="button" class="btn btn-xs btn-square" aria-label="進捗 +1" @click="increment(index)">
              +
            </button>
          </div>

          <!-- 目標・単位 -->
          <div class="flex gap-1">
            <input
              type="number"
              min="0"
              class="input input-bordered input-xs w-full"
              :value="cell.target"
              aria-label="達成目標"
              @change="commitTarget(index, cell.target, $event)"
            />
            <select
              class="select select-bordered select-xs"
              :value="cell.unit"
              aria-label="単位"
              @change="commitUnit(index, cell.unit, $event)"
            >
              <option v-for="unit in LIVER_BINGO_UNITS" :key="unit" :value="unit">{{ unit }}</option>
            </select>
          </div>

          <!-- 注目・お題の入れ替え -->
          <div class="flex gap-1">
            <button type="button" class="btn btn-xs flex-1" @click="focus(snapshot.focus === index ? null : index)">
              {{ snapshot.focus === index ? '注目中' : '注目' }}
            </button>
            <button type="button" class="btn btn-xs flex-1" :disabled="cell.fixed" @click="reroll(index)">
              入れ替え
            </button>
          </div>
        </div>
      </div>

      <p v-if="snapshot" class="text-center text-sm opacity-60">
        成立ライン: {{ snapshot.lineCount }} / 反映まで 1 秒ほどかかります(固定項目のマスは入れ替えできません)
      </p>
    </main>
  </div>
</template>

<script setup lang="ts">
  import { LIVER_BINGO_UNITS, type LiverBingoUnit } from '@/types/ui'
  import type { LiverBingoSnapshotType } from '@/types/api'
  import StatusNotice from '@/console/common/components/StatusNotice.vue'
  import { useBingoConsole } from '../composables/useBingoConsole'

  const {
    snapshot,
    status,
    errorMessage,
    obsActive,
    obsAgeSeconds,
    increment,
    decrement,
    reroll,
    patchCell,
    focus,
    focusRandom,
    reset,
  } = useBingoConsole()

  type Cell = LiverBingoSnapshotType['cells'][number]

  const cellClass = (cell: Cell, index: number) => {
    if (snapshot.value?.focus === index) return 'border-warning bg-warning/10'
    return cell.progress >= cell.target ? 'border-success bg-success/10' : 'border-base-300'
  }

  const commitTitle = (index: number, event: Event) => {
    void patchCell(index, { title: (event.target as HTMLInputElement).value })
  }

  // 数値でない・負のときは、元の値に戻す
  const commitTarget = (index: number, current: number, event: Event) => {
    const input = event.target as HTMLInputElement
    const value = input.valueAsNumber
    if (!Number.isFinite(value) || value < 0) {
      input.value = String(current)
      return
    }
    void patchCell(index, { target: value })
  }

  const commitUnit = (index: number, current: number, event: Event) => {
    const value = Number((event.target as HTMLSelectElement).value)
    const unit = LIVER_BINGO_UNITS.find((u) => u === value)
    if (!unit) return
    if (unit !== (current as LiverBingoUnit)) void patchCell(index, { unit })
  }

  const confirmReset = () => {
    if (window.confirm('カードを作り直します。今の進捗とお題の入れ替えは失われます。よろしいですか?')) void reset()
  }
</script>
