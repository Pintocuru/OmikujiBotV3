<!-- src/console/game/OshikuraChain/components/NuisanceTopBar.vue -->
<!-- 上部バー。待機中はクリックでメニュー (タイトル・コンフィグ・スタート) を開く。ゲーム中は、残り時間・係数・連鎖・経過時間と、「やめる」ボタン (2 回押し) を表示する -->
<template>
  <header
    class="flex h-10 shrink-0 items-center gap-4 bg-base-300 px-3 text-base-content select-none"
    :class="phase === 'idle' ? 'cursor-pointer hover:bg-base-200' : ''"
    @click="emit('toggle')"
  >
    <template v-if="state && phase !== 'idle'">
      <div class="flex items-center gap-2">
        <span class="text-xs opacity-70">
          {{ isTimeAttack ? oshikuraChainMessages.bar.gained : oshikuraChainMessages.bar.timeLeft }}
        </span>
        <div class="h-3 w-44 overflow-hidden rounded bg-base-100">
          <div
            class="h-full transition-[width] duration-150"
            :class="timeColor"
            :style="{ width: `${timePercent}%` }"
          />
        </div>
        <span class="font-mono text-sm" :class="isTimeAttack ? 'w-24' : 'w-12'">{{ barLabel }}</span>
      </div>
      <span v-if="!isTimeAttack" class="font-mono text-sm">{{
        oshikuraChainMessages.bar.coefficient(coefficient)
      }}</span>
      <span class="font-mono text-sm">{{
        oshikuraChainMessages.bar.chain(state.chain, formatGain(state.chainTotal))
      }}</span>
      <span :class="isTimeAttack ? 'font-mono text-sm' : 'text-xs opacity-70'">
        {{ oshikuraChainMessages.bar.elapsed(formatClock(clockSeconds)) }}
      </span>
      <span class="text-xs opacity-70">
        {{ oshikuraChainMessages.bar.nuisances(state.nuisances.length, config?.maxNuisances ?? 0) }}
      </span>
    </template>
    <span v-else class="text-xs opacity-60">{{ oshikuraChainMessages.bar.openHint }}</span>

    <!-- コメントの購読の状態 (つながっていないと、コメントが邪魔者にならない。オートモードでは使わないので出さない) -->
    <span class="grow" />
    <span v-if="isAuto" class="badge badge-outline badge-sm">{{ oshikuraChainMessages.bar.auto }}</span>
    <!-- やめる: 配信中の押し間違いを防ぐため、2 回押しで終了する (3 秒で元に戻る) -->
    <button
      v-if="phase === 'running'"
      type="button"
      class="btn btn-xs"
      :class="confirming ? 'btn-warning' : 'btn-ghost'"
      @click.stop="onAbortClick"
    >
      {{ confirming ? oshikuraChainMessages.bar.abortConfirm : oshikuraChainMessages.bar.abort }}
    </button>
    <span v-if="isAuto" />
    <span v-else-if="commentStatus === 'connecting'" class="text-xs opacity-60">
      {{ oshikuraChainMessages.comments.connecting }}
    </span>
    <span v-else-if="commentStatus === 'error'" class="text-error flex items-center gap-2 text-xs" @click.stop>
      {{ oshikuraChainMessages.comments.error }}
      <button type="button" class="btn btn-xs" @click="emit('reconnect')">
        {{ oshikuraChainMessages.comments.retry }}
      </button>
    </span>
  </header>
</template>

<script setup lang="ts">
  import { computed, onBeforeUnmount, ref, watch } from 'vue'
  import { formatClock, formatGain } from '../scripts/nuisanceRecord'
  import type { NuisanceConfigType } from '../scripts/nuisanceConfig'
  import { coefficientOf, type GameState } from '../scripts/nuisanceEngine'
  import type { CommentStatus, NuisancePhase } from '../composables/useOshikuraChain'
  import { oshikuraChainMessages } from '../maps/OshikuraChainMessageMap'

  const props = defineProps<{
    phase: NuisancePhase
    state: GameState | null
    config: NuisanceConfigType | null
    commentStatus: CommentStatus
    getClock: () => number
  }>()
  const emit = defineEmits<{ toggle: []; reconnect: []; abort: [] }>()

  // やめる (2 回押し)
  const CONFIRM_MS = 3000
  const confirming = ref(false)
  let confirmTimer = 0
  const resetConfirm = () => {
    clearTimeout(confirmTimer)
    confirming.value = false
  }
  const onAbortClick = () => {
    if (!confirming.value) {
      confirming.value = true
      confirmTimer = window.setTimeout(resetConfirm, CONFIRM_MS)
      return
    }
    resetConfirm()
    emit('abort')
  }
  watch(
    () => props.phase,
    () => resetConfirm()
  )

  const isTimeAttack = computed(() => props.state?.gameMode === 'timeAttack')
  const isAuto = computed(() => props.config?.commentSource === 'auto')

  // 耐久: 残り時間 (少ないほど赤) / タイムアタック: 目標までの獲得秒数 (増えていく)
  const timePercent = computed(() => {
    if (!props.state || !props.config) return 0
    const ratio = isTimeAttack.value
      ? props.state.gainedSeconds / props.config.targetSeconds
      : props.state.timeLeft / props.config.maxSeconds
    return Math.max(0, Math.min(100, ratio * 100))
  })
  const timeColor = computed(() =>
    isTimeAttack.value
      ? 'bg-info'
      : timePercent.value > 50
        ? 'bg-success'
        : timePercent.value > 25
          ? 'bg-warning'
          : 'bg-error'
  )
  const barLabel = computed(() => {
    if (!props.state || !props.config) return ''
    return isTimeAttack.value
      ? oshikuraChainMessages.bar.gainedValue(
          formatClock(props.state.gainedSeconds),
          formatClock(props.config.targetSeconds)
        )
      : formatClock(props.state.timeLeft)
  })
  const coefficient = computed(() =>
    props.state && props.config ? coefficientOf(props.state.elapsed, props.state.coefficientResetAt, props.config) : 1
  )

  // 生存時間の表示は、実時間で 0.25 秒ごとに更新する (ゲームオーバーのあとは、止まった時刻)
  const clockSeconds = ref(0)
  const refreshClock = () => (clockSeconds.value = props.getClock())
  const timer = setInterval(refreshClock, 250)
  watch(() => [props.phase, props.state?.over], refreshClock, { immediate: true })
  onBeforeUnmount(() => {
    clearInterval(timer)
    clearTimeout(confirmTimer)
  })
</script>
