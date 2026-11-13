// src/ui/LiverBingo/composables/useLiverBingo.ts
import { computed, onBeforeUnmount, ref, watch, type Ref } from 'vue'
import type { LiverBingoCellPatchType } from '@/types/api'
import type { LiverBingoItemType, LiverBingoType } from '@/types/ui'
import { generateCard, rerollItem } from './bingoItems'
import { getWinLines } from './winLines'
import { useLiverBingoSound } from './useLiverBingoSound'

/** マスのカウントアニメーションの長さ(ms) */
const CELL_ANIMATION_MS = 800

/**
 * ライバービンゴの状態と操作
 * - 進行状態(進捗・お題の入れ替え)はメモリだけで持つ(リロードで最初から)
 * - 設定(カードサイズ・固定項目・ランダム項目)が変わったらカードを作り直す
 * - OBS 上のクリックと、LiveConsole からの命令(useLiverBingoSync)は、同じ操作を呼ぶ
 */
export const useLiverBingo = (settings: Ref<LiverBingoType>) => {
  const sound = useLiverBingoSound()

  const cardSize = computed(() => settings.value.cardSize)
  const totalCells = computed(() => cardSize.value * cardSize.value)

  const items = ref<LiverBingoItemType[]>([])
  const progress = ref<number[]>([])
  const animating = ref<boolean[]>([])
  /** 注目中のマス(LiveConsole から指定される) */
  const focusCell = ref<number | null>(null)

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
  }
  onBeforeUnmount(clearTimers)

  // ---- カード生成(音なし。設定変更でも呼ばれる) ----
  const regenerate = () => {
    clearTimers()
    items.value = generateCard(cardSize.value, settings.value.randomSeeds, settings.value.seeds)
    progress.value = Array(totalCells.value).fill(0)
    animating.value = Array(totalCells.value).fill(false)
    focusCell.value = null
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
  })

  // ---- 操作 ----
  const isCell = (index: number) => Number.isInteger(index) && index >= 0 && index < totalCells.value

  /** 進捗 +1(OBS では左クリック) */
  const increment = (index: number) => {
    if (!isCell(index)) return
    focusCell.value = null
    progress.value[index] = (progress.value[index] ?? 0) + 1
    triggerAnimation(index)
    sound.click()
  }

  /** お題を入れ替える(進捗は 0 に戻す) */
  const reroll = (index: number) => {
    if (!isCell(index)) return
    focusCell.value = null
    items.value[index] = rerollItem(settings.value.randomSeeds, items.value[index])
    progress.value[index] = 0
    sound.reset()
  }

  /** 進捗 -1(OBS では右クリック)。0 のときはお題を入れ替える(固定項目のマスは入れ替えない) */
  const decrement = (index: number) => {
    if (!isCell(index)) return
    if ((progress.value[index] ?? 0) > 0) {
      focusCell.value = null
      progress.value[index]--
      sound.reset()
    } else if (!fixedCells.value.has(index)) {
      reroll(index)
    }
  }

  /** カードを作り直す */
  const reset = () => {
    regenerate()
    sound.reset()
  }

  /** 注目するマスを光らせる(null で解除) */
  const focus = (index: number | null) => {
    if (index === null) {
      focusCell.value = null
      return
    }
    if (!isCell(index)) return
    focusCell.value = index
    triggerAnimation(index)
  }

  /** お題・目標・単位を書き換える(進捗はそのまま) */
  const patchCell = (index: number, patch: LiverBingoCellPatchType) => {
    if (!isCell(index)) return
    const current = items.value[index]
    items.value[index] = {
      ...current,
      ...(patch.title !== undefined && { title: patch.title }),
      ...(patch.target !== undefined && { target: patch.target }),
      ...(patch.unit !== undefined && { unit: patch.unit }),
    }
  }

  return {
    cardSize,
    items,
    progress,
    animating,
    focusCell,
    completedCells,
    lineCount,
    highlightedCells,
    fixedCells,
    increment,
    decrement,
    reroll,
    reset,
    focus,
    patchCell,
    playHover: sound.hover,
  }
}

export type LiverBingoBoardState = ReturnType<typeof useLiverBingo>
