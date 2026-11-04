// src/ui/LifeHourglass/editor/useLifeHourglassPreview.ts
import { onBeforeUnmount, reactive, watch } from 'vue'
import { LIFE_HOURGLASS_BOWLS, LIFE_HOURGLASS_GRAINS_PER_YEN } from '../composables/bowls'

/** エディタのプレビュー用の仮の状態(本番のストアには一切触れない) */
export interface LifeHourglassPreviewState {
  grains: number
  viewer: number
  giftTotal: number
  streamSeconds: number
  giftPulse: number
  /** 自動再生の倍速(0 = 停止) */
  autoSpeed: number
}

export const createLifeHourglassPreviewState = (): LifeHourglassPreviewState => ({
  grains: 0,
  viewer: 100,
  giftTotal: 0,
  streamSeconds: 0,
  giftPulse: 0,
  autoSpeed: 0,
})

const DOME_GRAINS = LIFE_HOURGLASS_BOWLS.find((b) => b.id === 'tokyoDome')!.grains

export const useLifeHourglassPreview = () => {
  const state = reactive(createLifeHourglassPreviewState())

  /** 同接 × 秒数ぶん進める(本番の同接加算と同じ式) */
  const addSeconds = (seconds: number) => {
    state.grains += Math.max(0, state.viewer) * seconds
    state.streamSeconds += seconds
  }

  /** ギフトぶん進める(本番と同じ換算) */
  const addGift = (yen: number) => {
    state.giftTotal += yen
    state.grains += yen * LIFE_HOURGLASS_GRAINS_PER_YEN
    state.giftPulse++
  }

  /** 東京ドームができる直前まで一気に進める(あとは「+1分」等でドームの誕生を確認できる) */
  const skipToBeforeDome = () => {
    state.autoSpeed = 0
    state.grains = Math.max(state.grains, DOME_GRAINS - 600)
  }

  const reset = () => Object.assign(state, createLifeHourglassPreviewState(), { viewer: state.viewer })

  // --- 自動再生(1 秒ごとに autoSpeed 秒ぶん進める。東京ドームができたら止める) ---
  let timer: ReturnType<typeof setInterval> | null = null
  const stopTimer = () => {
    if (timer) clearInterval(timer)
    timer = null
  }
  watch(
    () => state.autoSpeed,
    (speed) => {
      stopTimer()
      if (speed <= 0) return
      timer = setInterval(() => {
        addSeconds(state.autoSpeed)
        if (state.grains >= DOME_GRAINS) state.autoSpeed = 0
      }, 1000)
    }
  )
  onBeforeUnmount(stopTimer)

  return { state, addSeconds, addGift, skipToBeforeDome, reset }
}
