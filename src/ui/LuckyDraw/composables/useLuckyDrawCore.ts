// src/ui/LuckyDraw/composables/useLuckyDrawCore.ts
import { computed, onBeforeUnmount, reactive, ref, type Ref } from 'vue'
import type { UserNameType } from '@/types/OmikenComment'
import type { LuckyDrawType } from '@/types/ui'
import { LUCKY_DRAW_COUNT } from '@/types/ui'
import type { LuckyDrawHistoryItem, LuckyDrawState } from '../types'
import { pickRandom } from './pickRandom'

/** 履歴の最大件数 */
const HISTORY_LIMIT = 10

/**
 * 抽選の状態管理(ストアに依存しない。配信画面とエディターのプレビューで共通)
 * - 参加者は UI が持つ(OBS のリロードで消えてよい)
 */
export function useLuckyDrawCore(settings: Ref<LuckyDrawType>) {
  const participants = reactive(new Map<string, UserNameType>())
  const winners = ref<UserNameType[]>([])
  const drawKey = ref(0)
  const hasDrawn = ref(false)
  const isVisible = ref(false)
  const history = ref<LuckyDrawHistoryItem[]>([])

  let hideTimer: ReturnType<typeof setTimeout> | null = null
  const clearHideTimer = () => {
    if (hideTimer !== null) clearTimeout(hideTimer)
    hideTimer = null
  }
  onBeforeUnmount(clearHideTimer)

  // 結果を表示する。displaySeconds が 0 なら、次の抽選まで表示し続ける
  const startVisible = () => {
    clearHideTimer()
    isVisible.value = true
    const seconds = settings.value.displaySeconds
    if (seconds <= 0) return
    hideTimer = setTimeout(() => {
      isVisible.value = false
      hideTimer = null
    }, seconds * 1000)
  }

  /** 参加者を追加する(同じユーザーは 1 人として数える) */
  const join = (user: UserNameType) => {
    const key = user.userId || user.userName
    if (!key) return
    participants.set(key, user)
  }

  /** 参加者を空にする(当選者の表示は残す) */
  const resetParticipants = () => participants.clear()

  /** 参加者から count 名を選ぶ。count が空なら設定値 */
  const draw = (count?: number) => {
    const n = count !== undefined && Number.isFinite(count) && count >= 1 ? Math.floor(count) : settings.value.count
    const picked = pickRandom([...participants.values()], Math.min(n, LUCKY_DRAW_COUNT.max))

    winners.value = picked
    drawKey.value++
    hasDrawn.value = true
    startVisible()

    if (picked.length > 0) {
      history.value = [
        { id: `${Date.now()}-${drawKey.value}`, timestamp: Date.now(), users: picked },
        ...history.value,
      ].slice(0, HISTORY_LIMIT)
    }
    if (settings.value.clearOnDraw) participants.clear()
  }

  const clearHistory = () => {
    history.value = []
  }

  const state = computed<LuckyDrawState>(() => ({
    isVisible: isVisible.value,
    winners: winners.value,
    drawKey: drawKey.value,
    hasDrawn: hasDrawn.value,
    participantCount: participants.size,
  }))

  return { state, history, join, resetParticipants, draw, clearHistory }
}
