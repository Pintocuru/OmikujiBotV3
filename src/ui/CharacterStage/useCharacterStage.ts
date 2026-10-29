// src/ui/CharacterStage/useCharacterStage.ts
import { ref, watch, onUnmounted, type Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/generator/stores/useAppStore'
import { useCharacters } from '@/generator/composables/useCharacters'
import { isBubbleMessage } from '@/types/generator'
import type { CharacterStageType } from '@/types/ui'
import { resolveStageSlots } from './resolveStageSlots'
import { buildStageItem } from './buildStageItem'
import type { StageItem } from './types'

// Leave アニメーションが終わらなかった場合の保険(after-leave が来ない場合でも取り除く)
const FORCE_REMOVE_DELAY = 3000

/**
 * CharacterStage の表示管理
 * - useBotDisplay / useFilteredBotMessages は「本文が空だと弾く・表示秒数を文字数から決める」ため使えない。
 *   本文を使わない UI なので、ここで専用に管理する。
 * - TODO: 個別対応。表示時間・本文の扱いを useBotDisplay の option で切り替えられるようにすれば共通化できる
 */
export const useCharacterStage = (settings: Ref<CharacterStageType>) => {
  const appStore = useAppStore()
  const { botMessages, data } = storeToRefs(appStore)
  const { getCharacterLayers, getCharacterAnimation } = useCharacters(() => appStore.data.assets.characters)

  const items = ref<StageItem[]>([])
  const processed = new Set<string>()
  const forceTimers = new Map<string, number>()
  let zCounter = 0

  const clearTimer = (item: StageItem) => {
    if (item.display.hideTimeout) clearTimeout(item.display.hideTimeout)
    item.display.hideTimeout = undefined
  }

  const remove = (id: string) => {
    const index = items.value.findIndex((i) => i.id === id)
    if (index === -1) return
    clearTimer(items.value[index])
    const force = forceTimers.get(id)
    if (force) clearTimeout(force)
    forceTimers.delete(id)
    items.value.splice(index, 1)
  }

  // visible を false にして Leave アニメーションを始める(取り除くのは MotionWrapper の after-leave)
  const hide = (id: string) => {
    const item = items.value.find((i) => i.id === id)
    if (!item || !item.display.visible) return
    clearTimer(item)
    item.display.visible = false
    forceTimers.set(id, setTimeout(() => remove(id), FORCE_REMOVE_DELAY) as unknown as number)
  }

  //
  const show = (msg: Parameters<typeof getCharacterLayers>[0]) => {
    const layers = getCharacterLayers(msg)
    if (layers.length === 0) return // キャラ未指定・画像なしは表示しない

    const spec = resolveStageSlots(msg.slots, settings.value)

    // clearPrevious: 同じ UI で表示中のものだけを消す(このメッセージ自身は消さない)
    if (spec.clearPrevious) items.value.filter((i) => i.display.visible).forEach((i) => hide(i.id))

    const item: StageItem = buildStageItem({
      id: msg.id,
      layers,
      animation: getCharacterAnimation(msg),
      spec,
      characterSize: settings.value.characterSize,
      z: ++zCounter,
    })
    if (spec.seconds > 0) {
      item.display.hideTimeout = setTimeout(() => hide(item.id), spec.seconds * 1000) as unknown as number
    }
    items.value.push(item)
  }

  // 新しく届いたメッセージを、到着順に処理する
  const stopWatch = watch(
    botMessages,
    (list) => {
      if (!data.value.ui.settings.characterStage) return // この UI が有効でなければ何もしない
      for (const msg of list) {
        if (msg.uiKey !== 'characterStage' || !isBubbleMessage(msg) || processed.has(msg.id)) continue
        processed.add(msg.id)
        show(msg)
      }
    },
    { immediate: true }
  )

  const clearAll = () => {
    items.value.forEach(clearTimer)
    forceTimers.forEach((t) => clearTimeout(t))
    forceTimers.clear()
    items.value = []
    processed.clear()
  }

  onUnmounted(() => {
    stopWatch()
    clearAll()
  })

  return { items, remove }
}
