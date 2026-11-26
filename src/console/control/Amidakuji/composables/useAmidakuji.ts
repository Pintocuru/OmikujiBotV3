// src/console/control/Amidakuji/composables/useAmidakuji.ts
// フェーズ・参加者・賞品を持ち、横線 (useLadderRungs) と発表 (useRevealAnimation) をつなぐ
import { computed, ref } from 'vue'
import {
  calculateRowCount,
  DEFAULT_LOSE_LABEL,
  PLAYER_MAX,
  PLAYER_MIN,
  type FollowSpeed,
} from '../scripts/amidakujiConstants'
import { countTotalPrizes, generateShuffledGoals, type PrizeInput } from '../scripts/goals'
import { traceAll } from '../scripts/ladder'
import type { ResultEntry as BaseResultEntry } from '../scripts/results'
import { useJoinComments, type AmidakujiPlayer, type JoinResult } from './useJoinComments'
import { useLadderRungs } from './useLadderRungs'
import { useRevealAnimation, type RevealMode } from './useRevealAnimation'

export type AmidakujiPhase = 'setup' | 'revealing' | 'completed'
export type ResultEntry = BaseResultEntry<AmidakujiPlayer>

export function useAmidakuji() {
  const phase = ref<AmidakujiPhase>('setup')
  const showSetup = ref(true)
  /** 完了後に、結果一覧を重ねて見せるか (「結果を見る」で開く) */
  const showResult = ref(false)
  /** 上限などの、画面に出す知らせ */
  const notice = ref('')

  // 参加者 (縦線の並び = 追加順)
  const players = ref<AmidakujiPlayer[]>([])
  // 削除したコメント参加者は、コメントしても再参加させない
  const removedIds = new Set<string>()
  let manualSeq = 0

  // 当たりリスト
  let prizeSeq = 1
  const prizes = ref<PrizeInput[]>([{ id: '1', name: '当たり', count: 1 }])
  const loseLabel = ref(DEFAULT_LOSE_LABEL)
  const hideGoalsBeforeReveal = ref(true)

  // 発表設定
  const followSpeed = ref<FollowSpeed>('normal')
  const revealMode = ref<RevealMode>('simultaneous')

  const colCount = computed(() => players.value.length)
  const rowCount = computed(() => calculateRowCount(colCount.value))
  const totalPrizes = computed(() => countTotalPrizes(prizes.value))

  const rungs = useLadderRungs(colCount, rowCount)
  const anim = useRevealAnimation({
    players,
    rowCount,
    speed: followSpeed,
    onAllRevealed: () => {
      phase.value = 'completed'
      showResult.value = false
    },
  })

  // --- 参加者 ---
  const addPlayer = (player: AmidakujiPlayer): JoinResult => {
    if (phase.value !== 'setup') return 'duplicate'
    if (removedIds.has(player.id) || players.value.some((p) => p.id === player.id)) return 'duplicate'
    if (players.value.length >= PLAYER_MAX) {
      notice.value = `参加者が上限(${PLAYER_MAX}人)に達しました`
      return 'full'
    }
    players.value.push(player)
    return 'added'
  }

  // 1 行 1 人で、手動追加
  const addManualPlayers = (namesText: string) => {
    if (phase.value !== 'setup') return
    const names = namesText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0)
    let skipped = 0
    for (const name of names) {
      if (players.value.length >= PLAYER_MAX) {
        skipped++
        continue
      }
      players.value.push({ id: `manual-${++manualSeq}-${Date.now()}`, name, isManual: true })
    }
    notice.value = skipped > 0 ? `上限(${PLAYER_MAX}人)のため、${skipped}人は追加できませんでした` : ''
  }

  const removePlayer = (id: string) => {
    if (phase.value !== 'setup') return
    const target = players.value.find((p) => p.id === id)
    if (!target) return
    if (!target.isManual) removedIds.add(id)
    players.value = players.value.filter((p) => p.id !== id)
    notice.value = ''
  }

  const commentJoin = useJoinComments(addPlayer)

  // --- 当たり ---
  const addPrize = () => {
    const id = String(++prizeSeq)
    prizes.value.push({ id, name: `賞品${prizes.value.length + 1}`, count: 1 })
  }

  const removePrize = (id: string) => {
    prizes.value = prizes.value.filter((p) => p.id !== id)
  }

  // --- 横線 (準備中だけ) ---
  const setRung = (col: number, row: number, on: boolean) => {
    if (phase.value !== 'setup') return
    rungs.setRung(col, row, on)
  }
  const generateAuto = () => {
    if (phase.value === 'setup') rungs.generateAuto()
  }

  // --- 発表 ---
  const canStartReveal = computed(() => {
    if (phase.value !== 'setup') return false
    if (players.value.length < PLAYER_MIN) return false
    return totalPrizes.value <= players.value.length
  })

  const startReveal = () => {
    if (!canStartReveal.value) return
    commentJoin.stopRecruiting()

    const goals = generateShuffledGoals(prizes.value, colCount.value, loseLabel.value)
    const paths = traceAll(colCount.value, rungs.allRungs.value, rowCount.value)
    anim.prepare(paths, goals)

    phase.value = 'revealing'
    showResult.value = false
    if (revealMode.value === 'simultaneous') anim.runAll()
    else anim.runNext()
  }

  const nextPlayerReveal = () => {
    if (phase.value === 'revealing' && revealMode.value === 'individual') anim.runNext()
  }

  const selectPlayerReveal = (idx: number) => {
    if (phase.value === 'revealing' && revealMode.value === 'individual') anim.runOne(idx)
  }

  const resetToSetup = () => {
    anim.reset()
    phase.value = 'setup'
    showResult.value = false
  }

  return {
    phase,
    showSetup,
    showResult,
    notice,
    players,
    prizes,
    loseLabel,
    hideGoalsBeforeReveal,
    followSpeed,
    revealMode,
    colCount,
    rowCount,
    totalPrizes,
    canStartReveal,
    commentJoin,
    rungs,
    anim,
    addManualPlayers,
    removePlayer,
    addPrize,
    removePrize,
    setRung,
    generateAuto,
    startReveal,
    nextPlayerReveal,
    selectPlayerReveal,
    resetToSetup,
  }
}
