<!-- src/console/control/Amidakuji/components/SetupPanel.vue -->
<template>
  <div
    class="w-80 shrink-0 border-r border-base-300 bg-base-100 p-4 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-3rem)]"
  >
    <!-- 1. 参加者募集 -->
    <div class="card bg-base-200 shadow-sm p-3 flex flex-col gap-2">
      <div class="font-bold text-sm flex items-center justify-between">
        <span>参加者の募集</span>
        <span class="text-xs opacity-70">{{ players.length }}/{{ PLAYER_MAX }}人</span>
      </div>

      <!-- コメント募集 -->
      <div class="flex flex-col gap-1.5 border-t border-base-300 pt-2">
        <label class="text-xs opacity-80">合言葉 (空なら全コメント):</label>
        <input
          v-model="commentJoin.keyword.value"
          type="text"
          placeholder="例: あみだ"
          class="input input-xs input-bordered w-full"
          :disabled="commentJoin.isRecruiting.value"
        />
        <button
          type="button"
          class="btn btn-xs mt-1 font-bold"
          :class="commentJoin.isRecruiting.value ? 'btn-error' : 'btn-success'"
          @click="toggleRecruiting"
        >
          {{ commentJoin.isRecruiting.value ? '募集を締切る' : 'コメント募集開始' }}
        </button>
      </div>

      <!-- 手動追加 -->
      <div class="flex flex-col gap-1 border-t border-base-300 pt-2">
        <label class="text-xs opacity-80">手動追加 (改行で複数人):</label>
        <textarea
          v-model="manualInputText"
          rows="2"
          placeholder="名前1&#10;名前2"
          class="textarea textarea-bordered textarea-xs w-full"
        />
        <button
          type="button"
          class="btn btn-xs btn-outline mt-1"
          :disabled="!manualInputText.trim()"
          @click="handleManualAdd"
        >
          手動で追加
        </button>
      </div>

      <!-- 参加者一覧 (削除可能) -->
      <div v-if="players.length > 0" class="mt-2 flex flex-col gap-1">
        <div class="text-xs font-semibold opacity-80">参加者一覧:</div>
        <div class="max-h-28 overflow-y-auto flex flex-col gap-1 pr-1">
          <div
            v-for="(p, idx) in players"
            :key="p.id"
            class="flex items-center justify-between bg-base-100 rounded px-2 py-0.5 text-xs"
          >
            <span class="truncate max-w-42" :title="p.name"> {{ idx + 1 }}. {{ p.name }} </span>
            <button
              type="button"
              class="text-error hover:font-bold px-1"
              title="削除"
              @click="emit('remove-player', p.id)"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. ゴール設定 -->
    <div class="card bg-base-200 shadow-sm p-3 flex flex-col gap-2">
      <div class="font-bold text-sm flex items-center justify-between">
        <span>当たり賞品の設定</span>
        <button type="button" class="btn btn-xs btn-ghost text-primary" @click="emit('add-prize')">＋追加</button>
      </div>

      <div class="flex flex-col gap-2 max-h-36 overflow-y-auto pr-1">
        <div v-for="prize in prizes" :key="prize.id" class="flex items-center gap-1.5 bg-base-100 p-1.5 rounded">
          <input v-model="prize.name" type="text" placeholder="賞品名" class="input input-xs input-bordered flex-1" />
          <input
            v-model.number="prize.count"
            type="number"
            min="1"
            class="input input-xs input-bordered w-14 font-mono text-center"
          />
          <span class="text-xs">個</span>
          <button
            v-if="prizes.length > 1"
            type="button"
            class="btn btn-ghost btn-xs text-error px-1"
            @click="emit('remove-prize', prize.id)"
          >
            ×
          </button>
        </div>
      </div>

      <div class="flex items-center justify-between border-t border-base-300 pt-2 text-xs">
        <span class="opacity-80">はずれの表示名:</span>
        <input v-model="loseLabelModel" type="text" class="input input-xs input-bordered w-24 text-center" />
      </div>

      <div class="flex items-center justify-between text-xs">
        <span class="opacity-80">当たり合計 / 参加者数:</span>
        <span class="font-bold font-mono" :class="totalPrizes > players.length ? 'text-error' : ''">
          {{ totalPrizes }} / {{ players.length }}
        </span>
      </div>

      <label class="label cursor-pointer justify-start gap-2 pt-0 pb-0 text-xs">
        <input v-model="hideGoalsModel" type="checkbox" class="checkbox checkbox-xs" />
        <span class="label-text text-xs">発表前はゴールを隠す</span>
      </label>
    </div>

    <!-- 3. 横線の設定 -->
    <div class="card bg-base-200 shadow-sm p-3 flex flex-col gap-2">
      <div class="font-bold text-sm">横線の生成</div>
      <div class="flex items-center justify-between text-xs">
        <span>密度 (既定 30%):</span>
        <span class="font-mono font-bold">{{ Math.round(rungDensityModel * 100) }}%</span>
      </div>
      <input
        v-model.number="rungDensityModel"
        type="range"
        min="0.1"
        max="0.6"
        step="0.05"
        class="range range-xs range-primary"
      />

      <div class="grid grid-cols-2 gap-1.5 mt-1">
        <button
          type="button"
          class="btn btn-xs btn-primary"
          :disabled="players.length < 2"
          @click="emit('generate-auto')"
        >
          自動で埋める
        </button>
        <button type="button" class="btn btn-xs btn-outline" @click="emit('reset-auto')">自動分やり直し</button>
      </div>
      <button type="button" class="btn btn-xs btn-ghost text-error" @click="emit('reset-all-rungs')">
        横線を全リセット
      </button>
    </div>

    <!-- 4. 発表方法・開始ボタン -->
    <div class="card bg-base-200 shadow-sm p-3 flex flex-col gap-2">
      <div class="font-bold text-sm">発表設定</div>
      <div class="flex items-center justify-between text-xs">
        <span>発表方式:</span>
        <div class="join">
          <input
            v-model="revealModeModel"
            type="radio"
            name="revealMode"
            value="simultaneous"
            aria-label="一斉"
            class="btn btn-xs join-item"
          />
          <input
            v-model="revealModeModel"
            type="radio"
            name="revealMode"
            value="individual"
            aria-label="一人ずつ"
            class="btn btn-xs join-item"
          />
        </div>
      </div>

      <div class="flex items-center justify-between text-xs">
        <span>速度:</span>
        <select v-model="followSpeedModel" class="select select-xs select-bordered">
          <option value="slow">ゆっくり</option>
          <option value="normal">ふつう</option>
          <option value="fast">はやい</option>
        </select>
      </div>

      <div v-if="validationMessage" class="text-error text-xs">
        {{ validationMessage }}
      </div>

      <button
        type="button"
        class="btn btn-sm btn-accent font-bold mt-2 text-white"
        :disabled="!canStartReveal"
        @click="emit('start-reveal')"
      >
        あみだくじ スタート！
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { PLAYER_MAX } from '../scripts/amidakujiConstants'
  import type { PrizeInput } from '../scripts/goals'
  import type { AmidakujiPlayer } from '../composables/useJoinComments'

  const props = defineProps<{
    players: AmidakujiPlayer[]
    prizes: PrizeInput[]
    loseLabel: string
    hideGoals: boolean
    rungDensity: number
    followSpeed: 'slow' | 'normal' | 'fast'
    revealMode: 'simultaneous' | 'individual'
    totalPrizes: number
    canStartReveal: boolean
    commentJoin: any
  }>()

  const emit = defineEmits<{
    (e: 'update:loseLabel', val: string): void
    (e: 'update:hideGoals', val: boolean): void
    (e: 'update:rungDensity', val: number): void
    (e: 'update:followSpeed', val: 'slow' | 'normal' | 'fast'): void
    (e: 'update:revealMode', val: 'simultaneous' | 'individual'): void
    (e: 'add-manual-players', text: string): void
    (e: 'remove-player', id: string): void
    (e: 'add-prize'): void
    (e: 'remove-prize', id: string): void
    (e: 'generate-auto'): void
    (e: 'reset-auto'): void
    (e: 'reset-all-rungs'): void
    (e: 'start-reveal'): void
  }>()

  const manualInputText = ref('')

  const loseLabelModel = computed({
    get: () => props.loseLabel,
    set: (v) => emit('update:loseLabel', v),
  })

  const hideGoalsModel = computed({
    get: () => props.hideGoals,
    set: (v) => emit('update:hideGoals', v),
  })

  const rungDensityModel = computed({
    get: () => props.rungDensity,
    set: (v) => emit('update:rungDensity', v),
  })

  const followSpeedModel = computed({
    get: () => props.followSpeed,
    set: (v) => emit('update:followSpeed', v),
  })

  const revealModeModel = computed({
    get: () => props.revealMode,
    set: (v) => emit('update:revealMode', v),
  })

  const toggleRecruiting = () => {
    if (props.commentJoin.isRecruiting.value) {
      props.commentJoin.stopRecruiting()
    } else {
      props.commentJoin.startRecruiting()
    }
  }

  const handleManualAdd = () => {
    if (!manualInputText.value.trim()) return
    emit('add-manual-players', manualInputText.value)
    manualInputText.value = ''
  }

  const validationMessage = computed(() => {
    if (props.players.length < 2) {
      return '参加者を2人以上集めてください'
    }
    if (props.totalPrizes > props.players.length) {
      return '当たりの合計数が参加者数を超えています'
    }
    return ''
  })
</script>
