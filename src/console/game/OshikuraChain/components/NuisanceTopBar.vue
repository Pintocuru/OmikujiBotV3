<!-- src/console/game/OshikuraChain/components/NuisanceTopBar.vue -->
<!-- 上部バー。待機中はクリックでメニューを開く。ゲーム中は、アイコンで 残り時間・ヒート倍率・連鎖・経過時間・アイコン数 を表示し、「やめる」ボタン (2 回押し) を出す -->
<template>
  <header
    class="flex h-10 shrink-0 items-center gap-4 bg-base-300 px-3 text-base-content select-none"
    :class="phase === 'idle' ? 'cursor-pointer hover:bg-base-200' : ''"
    @click="emit('toggle')"
  >
    <template v-if="state && phase !== 'idle'">
      <!-- 残り時間 (耐久) / 獲得秒数 (タイムアタック) -->
      <div
        class="flex items-center gap-1"
        :title="isTimeAttack ? oshikuraChainMessages.bar.gained : oshikuraChainMessages.bar.timeLeft"
      >
        <component :is="isTimeAttack ? Target : Hourglass" :size="16" class="opacity-70" />
        <div class="h-3 w-25 overflow-hidden rounded bg-base-100">
          <div
            class="h-full transition-[width] duration-150"
            :class="timeColor"
            :style="{ width: `${timePercent}%` }"
          />
        </div>
        <span class="font-mono text-sm">{{ barLabel }}</span>
      </div>

      <!-- ヒートメーター (耐久のみ): 残り時間が減る速さ。上がるほど赤く、上限では点滅する -->
      <div
        v-if="!isTimeAttack"
        class="flex items-center gap-2"
        :title="oshikuraChainMessages.bar.heatTitle(multiplier)"
      >
        <Flame :size="16" :class="isMaxHeat ? 'text-error animate-pulse' : heatTextColor" />
        <div class="h-3 w-15 overflow-hidden rounded bg-base-100">
          <div
            class="h-full transition-[width] duration-150"
            :class="[heatColor, isMaxHeat ? 'animate-pulse' : '']"
            :style="{ width: `${heatPercent}%` }"
          />
        </div>
        <span class="font-mono text-sm" :class="isMaxHeat ? 'text-error animate-pulse' : ''">
          {{ oshikuraChainMessages.bar.multiplier(multiplier) }}
        </span>
      </div>

      <!-- 経過時間 -->
      <div class="flex items-center gap-1" :title="oshikuraChainMessages.bar.elapsedTitle">
        <Clock :size="16" class="opacity-70" />
        <span :class="isTimeAttack ? 'font-mono text-sm' : 'font-mono text-xs opacity-70'">
          {{ formatClock(clockSeconds) }}
        </span>
      </div>

      <!-- アイコン (コメントした人) の数 -->
      <div class="flex items-center gap-1" :title="oshikuraChainMessages.bar.nuisancesTitle">
        <Users :size="16" class="opacity-70" />
        <span class="font-mono text-xs opacity-70">{{ state.nuisances.length }} / {{ config?.maxNuisances ?? 0 }}</span>
      </div>
    </template>
    <span v-else class="flex items-center gap-2 text-xs opacity-60">
      <Menu :size="16" />
      {{ oshikuraChainMessages.bar.openHint }}
    </span>

    <span class="grow" />

    <!-- オートモード (実コメントは使わないので、購読の状態は出さない) -->
    <span v-if="isAuto" class="badge badge-outline badge-sm gap-1" :title="oshikuraChainMessages.bar.auto">
      <Bot :size="12" />
      {{ oshikuraChainMessages.bar.auto }}
    </span>

    <!-- やめる: 配信中の押し間違いを防ぐため、2 回押しで終了する (3 秒で元に戻る) -->
    <button
      v-if="phase === 'running'"
      type="button"
      class="btn btn-xs gap-1"
      :class="confirming ? 'btn-warning' : 'btn-ghost'"
      :title="oshikuraChainMessages.bar.abortConfirm"
      @click.stop="onAbortClick"
    >
      <X :size="14" />
      {{ confirming ? oshikuraChainMessages.bar.abortConfirm : oshikuraChainMessages.bar.abort }}
    </button>

    <!-- コメント購読の状態 (つながっていないと、コメントがアイコンにならない。言葉でないと伝わらないので文字も出す) -->
    <span v-if="isAuto" />
    <span v-else-if="commentStatus === 'connecting'" class="flex items-center gap-1 text-xs opacity-60">
      <Loader :size="14" class="animate-spin" />
      {{ oshikuraChainMessages.comments.connecting }}
    </span>
    <span v-else-if="commentStatus === 'error'" class="text-error flex items-center gap-2 text-xs" @click.stop>
      <WifiOff :size="14" />
      {{ oshikuraChainMessages.comments.error }}
      <button type="button" class="btn btn-xs gap-1" @click="emit('reconnect')">
        <RefreshCw :size="12" />
        {{ oshikuraChainMessages.comments.retry }}
      </button>
    </span>
  </header>
</template>

<script setup lang="ts">
  import { computed, onBeforeUnmount, ref, watch } from 'vue'
  import { Bot, Clock, Flame, Hourglass, Loader, Menu, RefreshCw, Target, Users, WifiOff, X } from '@lucide/vue'
  import { formatClock } from '../scripts/nuisanceRecord'
  import type { NuisanceConfigType } from '../scripts/nuisanceConfig'
  import { multiplierOf, type GameState } from '../scripts/nuisanceEngine'
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

  // ヒートメーター: 倍率 (1〜上限) を、0〜100% で見せる。上がるほど青 → 黄 → 赤
  const multiplier = computed(() =>
    props.state && props.config ? multiplierOf(props.state.elapsed, props.state.multiplierResetAt, props.config) : 1
  )
  const heatPercent = computed(() => {
    const max = props.config?.multiplierMax ?? 1
    return max > 1 ? Math.max(0, Math.min(100, ((multiplier.value - 1) / (max - 1)) * 100)) : 0
  })
  const heatColor = computed(() =>
    heatPercent.value < 30 ? 'bg-info' : heatPercent.value < 70 ? 'bg-warning' : 'bg-error'
  )
  const heatTextColor = computed(() =>
    heatPercent.value < 30 ? 'text-info' : heatPercent.value < 70 ? 'text-warning' : 'text-error'
  )
  const isMaxHeat = computed(() => !!props.config && multiplier.value >= props.config.multiplierMax - 1e-9)

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
