// src/ui/LiverBingo/composables/useLiverBingo.ts
import { computed, onBeforeUnmount, ref, watch, type Ref } from 'vue'
import type { LiverBingoItemType, LiverBingoType } from '@/types/ui'
import { generateCard, rerollItem } from './bingoItems'
import { getWinLines } from './winLines'
import { useLiverBingoSound } from './useLiverBingoSound'

/** マスのカウントアニメーションの長さ(ms) */
const CELL_ANIMATION_MS = 800
/** ビンゴ成立時のタイトル演出の長さ(ms) */
const BINGO_EFFECT_MS = 3000

/**
 * ライバービンゴの状態と操作
 * - 進行状態(進捗・お題の入れ替え)はメモリだけで持つ(リロードで最初から)
 * - 設定(カードサイズ・固定項目・ランダム項目)が変わったらカードを作り直す
 */
export const useLiverBingo = (settings: Ref<LiverBingoType>) => {
  const sound = useLiverBingoSound()

  const cardSize = computed(() => settings.value.cardSize)
  const totalCells = computed(() => cardSize.value * cardSize.value)

  const items = ref<LiverBingoItemType[]>([])
  const progress = ref<number[]>([])
  const animating = ref<boolean[]>([])
  const randomCell = ref<number | null>(null)
  const showBingoEffect = ref(false)

  // ---- 判定 ----
  const completedCells = computed(() => items.value.map((item, index) => (progress.value[index] ?? 0) >= item.target))
  const winLines = computed(() =>
    getWinLines(cardSize.value).filter((line) => line.every((i) => completedCells.value[i]))
  )
  const lineCount = computed(() => winLines.value.length)
  const highlightedCells = computed(() => [...new Set(winLines.value.flat())])

  // 固定項目のマス(お題の入れ替えをしない)
  const fixedCells = computed(
    () =>
      new Set(
        settings.value.seeds
          .filter((seed) => seed.title !== '' && seed.row < cardSize.value && seed.col < cardSize.value)
          .map((seed) => seed.row * cardSize.value + seed.col)
      )
  )

  // ---- タイマー ----
  const cellTimers = new Map<number, number>()
  let effectTimer: number | undefined

  const triggerAnimation = (index: number) => {
    window.clearTimeout(cellTimers.get(index))
    animating.value[index] = true
    cellTimers.set(
      index,
      window.setTimeout(() => {
        animating.value[index] = false
        cellTimers.delete(index)
      }, CELL_ANIMATION_MS)
    )
  }

  const clearTimers = () => {
    cellTimers.forEach((timer) => window.clearTimeout(timer))
    cellTimers.clear()
    window.clearTimeout(effectTimer)
  }
  onBeforeUnmount(clearTimers)

  // ---- カード生成(音なし。設定変更でも呼ばれる) ----
  const regenerate = () => {
    clearTimers()
    showBingoEffect.value = false
    items.value = generateCard(cardSize.value, settings.value.randomSeeds, settings.value.seeds)
    progress.value = Array(totalCells.value).fill(0)
    animating.value = Array(totalCells.value).fill(false)
    randomCell.value = null
  }

  watch(() => [settings.value.cardSize, settings.value.seeds, settings.value.randomSeeds], regenerate, {
    deep: true,
    immediate: true,
  })

  // ---- ライン成立 ----
  watch(lineCount, (now, before) => {
    if (now <= before) return
    sound.cheers()
    if (now === 1) sound.single()
    else sound.multi()
    showBingoEffect.value = true
    window.clearTimeout(effectTimer)
    effectTimer = window.setTimeout(() => (showBingoEffect.value = false), BINGO_EFFECT_MS)
  })

  // ---- 操作 ----
  /** 左クリック: 進捗 +1 */
  const increment = (index: number) => {
    randomCell.value = null
    progress.value[index] = (progress.value[index] ?? 0) + 1
    triggerAnimation(index)
    sound.click()
  }

  /** 右クリック: 進捗 -1。0 のときはお題を入れ替える(固定項目のマスは入れ替えない) */
  const decrement = (index: number) => {
    randomCell.value = null
    if ((progress.value[index] ?? 0) > 0) {
      progress.value[index]--
    } else if (!fixedCells.value.has(index)) {
      items.value[index] = rerollItem(settings.value.randomSeeds, items.value[index])
    }
    sound.reset()
  }

  /** タイトルを右クリック: カードを作り直す */
  const generate = () => {
    regenerate()
    sound.reset()
  }

  /** [R] ボタン: 未達成のマスを 1 つランダムに光らせる */
  const randomSelect = () => {
    randomCell.value = null
    const available = completedCells.value.flatMap((done, index) => (done ? [] : [index]))
    if (available.length === 0) return
    const index = available[Math.floor(Math.random() * available.length)]
    randomCell.value = index
    triggerAnimation(index)
  }

  return {
    cardSize,
    items,
    progress,
    animating,
    randomCell,
    showBingoEffect,
    completedCells,
    lineCount,
    highlightedCells,
    increment,
    decrement,
    generate,
    randomSelect,
    playHover: sound.hover,
  }
}
