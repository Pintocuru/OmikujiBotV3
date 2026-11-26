// src/console/control/Amidakuji/composables/useAmidakuji.ts
import { computed, ref, shallowRef } from 'vue'
import {
  calculateRowCount,
  DEFAULT_LOSE_LABEL,
  DEFAULT_RUNG_DENSITY,
  FOLLOW_SPEED_MS,
  PLAYER_MAX,
  PLAYER_MIN,
  type FollowSpeed,
} from '../scripts/amidakujiConstants'
import { generateAutoRungs, toggleRung, traceAll, type Rung, type TracePath, type TraceStep } from '../scripts/ladder'
import { countTotalPrizes, generateShuffledGoals, type GoalItem, type PrizeInput } from '../scripts/goals'
import { useJoinComments, type AmidakujiPlayer } from './useJoinComments'

export type AmidakujiPhase = 'setup' | 'revealing' | 'completed'

export type ResultEntry = {
  player: AmidakujiPlayer
  goal: GoalItem
  startCol: number
  endCol: number
}

export function useAmidakuji() {
  const phase = ref<AmidakujiPhase>('setup')

  // 参加者リスト
  const players = ref<AmidakujiPlayer[]>([])

  // 当たりリスト
  const prizes = ref<PrizeInput[]>([{ id: '1', name: '当たり', count: 1 }])
  const loseLabel = ref(DEFAULT_LOSE_LABEL)
  const hideGoalsBeforeReveal = ref(true)

  // 横線
  const manualRungs = ref<Rung[]>([])
  const autoRungs = ref<Rung[]>([])
  const rungDensity = ref(DEFAULT_RUNG_DENSITY)

  // 発表設定
  const followSpeed = ref<FollowSpeed>('normal')
  const revealMode = ref<'simultaneous' | 'individual'>('simultaneous')

  // 発表進行状態
  const activePaths = shallowRef<TracePath[]>([])
  const shuffledGoals = shallowRef<GoalItem[]>([])
  const currentRevealingPlayerIndex = ref<number | null>(null)
  /** 進行度: 各参加者の現在到達したアニメーション補間点 (col, row) */
  const playerProgress = ref<Record<number, { col: number; row: number; finished: boolean }>>({})
  /** 完了した結果リスト */
  const results = ref<ResultEntry[]>([])

  const totalPrizes = computed(() => countTotalPrizes(prizes.value))
  const colCount = computed(() => players.value.length)
  const rowCount = computed(() => calculateRowCount(colCount.value))

  const allRungs = computed<Rung[]>(() => {
    return [...manualRungs.value, ...autoRungs.value]
  })

  // 参加者追加
  const addPlayer = (player: AmidakujiPlayer): boolean => {
    if (players.value.length >= PLAYER_MAX) return false
    if (players.value.some((p) => p.id === player.id)) return false
    players.value.push(player)
    return true
  }

  // 手動で名前を一括・単一追加
  const addManualPlayers = (namesText: string) => {
    const lines = namesText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0)

    for (const name of lines) {
      if (players.value.length >= PLAYER_MAX) break
      const id = `manual-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      players.value.push({
        id,
        name,
        isManual: true,
      })
    }
  }

  // 参加者削除
  const removePlayer = (id: string) => {
    if (phase.value !== 'setup') return
    players.value = players.value.filter((p) => p.id !== id)
  }

  // コメント募集
  const commentJoin = useJoinComments(addPlayer)

  // 当たり賞品の追加・削除
  const addPrize = () => {
    const id = Date.now().toString()
    prizes.value.push({ id, name: `賞品${prizes.value.length + 1}`, count: 1 })
  }

  const removePrize = (id: string) => {
    prizes.value = prizes.value.filter((p) => p.id !== id)
  }

  // 横線の手動トグル
  const onToggleRung = (col: number, row: number) => {
    if (phase.value !== 'setup') return
    // すでに autoRungs にある場合は消せないようにするか、autoRungs と合わせて判定
    const combined = allRungs.value
    const res = toggleRung(combined, col, row, colCount.value, rowCount.value)
    if (res.changed) {
      // 既存の手動横線にあれば消す
      const inManual = manualRungs.value.some((r) => r.col === col && r.row === row)
      if (inManual) {
        manualRungs.value = manualRungs.value.filter((r) => !(r.col === col && r.row === row))
      } else {
        const inAuto = autoRungs.value.some((r) => r.col === col && r.row === row)
        if (inAuto) {
          autoRungs.value = autoRungs.value.filter((r) => !(r.col === col && r.row === row))
        } else {
          manualRungs.value.push({ col, row })
        }
      }
    }
  }

  // 横線の自動生成
  const generateAuto = () => {
    if (phase.value !== 'setup') return
    // 手動の横線を維持しつつ、密度に合わせて autoRungs を再生成
    autoRungs.value = generateAutoRungs(manualRungs.value, colCount.value, rowCount.value, rungDensity.value).filter(
      (r) => !manualRungs.value.some((m) => m.col === r.col && m.row === r.row)
    )
  }

  const resetAutoRungs = () => {
    autoRungs.value = []
  }

  const resetAllRungs = () => {
    manualRungs.value = []
    autoRungs.value = []
  }

  // 発表可能かどうかのバリデーション
  const canStartReveal = computed(() => {
    if (phase.value !== 'setup') return false
    if (players.value.length < PLAYER_MIN) return false
    if (totalPrizes.value > players.value.length) return false
    return true
  })

  // 発表開始
  const startReveal = () => {
    if (!canStartReveal.value) return

    // コメント募集を締め切る
    commentJoin.stopRecruiting()

    // ゴールを確定・シャッフル
    shuffledGoals.value = generateShuffledGoals(prizes.value, colCount.value, loseLabel.value)

    // 全経路を計算
    activePaths.value = traceAll(colCount.value, allRungs.value, rowCount.value)

    phase.value = 'revealing'
    results.value = []
    playerProgress.value = {}

    // 初期プログレス設定
    for (let c = 0; c < colCount.value; c++) {
      playerProgress.value[c] = { col: c, row: 0, finished: false }
    }

    if (revealMode.value === 'simultaneous') {
      runSimultaneousReveal()
    } else {
      currentRevealingPlayerIndex.value = 0
      runSingleReveal(0)
    }
  }

  let animationTimer: any = null

  // 全員同時アニメーション
  const runSimultaneousReveal = () => {
    const paths = activePaths.value
    const stepDuration = FOLLOW_SPEED_MS[followSpeed.value]

    // 各 path の現在のステップインデックス
    const stepIndices = new Array(paths.length).fill(0)
    let anyRunning = true

    clearInterval(animationTimer)
    animationTimer = setInterval(() => {
      anyRunning = false
      for (let i = 0; i < paths.length; i++) {
        const path = paths[i]
        const currentIdx = stepIndices[i]
        if (currentIdx < path.steps.length) {
          anyRunning = true
          const st = path.steps[currentIdx]
          playerProgress.value[i] = { col: st.col, row: st.row, finished: false }
          stepIndices[i]++
        } else {
          if (!playerProgress.value[i]?.finished) {
            playerProgress.value[i] = {
              col: path.endCol,
              row: rowCount.value,
              finished: true,
            }
          }
        }
      }

      if (!anyRunning) {
        clearInterval(animationTimer)
        // 結果作成
        const res: ResultEntry[] = paths.map((p, idx) => ({
          player: players.value[idx],
          goal: shuffledGoals.value[p.endCol],
          startCol: p.startCol,
          endCol: p.endCol,
        }))
        // 当たりを先頭にソート
        res.sort((a, b) => (b.goal.isHit ? 1 : 0) - (a.goal.isHit ? 1 : 0))
        results.value = res
        phase.value = 'completed'
      }
    }, stepDuration)
  }

  // 一人ずつアニメーション
  const runSingleReveal = (playerIdx: number) => {
    if (playerIdx < 0 || playerIdx >= players.value.length) return
    const path = activePaths.value[playerIdx]
    const stepDuration = FOLLOW_SPEED_MS[followSpeed.value]
    let stepIdx = 0

    clearInterval(animationTimer)
    animationTimer = setInterval(() => {
      if (stepIdx < path.steps.length) {
        const st = path.steps[stepIdx]
        playerProgress.value[playerIdx] = { col: st.col, row: st.row, finished: false }
        stepIdx++
      } else {
        clearInterval(animationTimer)
        playerProgress.value[playerIdx] = {
          col: path.endCol,
          row: rowCount.value,
          finished: true,
        }

        // 当該参加者を結果に追加 (重複防止)
        if (!results.value.some((r) => r.startCol === playerIdx)) {
          const entry: ResultEntry = {
            player: players.value[playerIdx],
            goal: shuffledGoals.value[path.endCol],
            startCol: path.startCol,
            endCol: path.endCol,
          }
          const updated = [...results.value, entry]
          updated.sort((a, b) => (b.goal.isHit ? 1 : 0) - (a.goal.isHit ? 1 : 0))
          results.value = updated
        }

        // 全員終了したか判定
        if (results.value.length === players.value.length) {
          phase.value = 'completed'
        }
      }
    }, stepDuration)
  }

  // 一人ずつモードで次の人を辿る
  const nextPlayerReveal = () => {
    if (phase.value !== 'revealing' || revealMode.value !== 'individual') return
    const unrevealedIdx = players.value.findIndex((_, idx) => !results.value.some((r) => r.startCol === idx))
    if (unrevealedIdx >= 0) {
      currentRevealingPlayerIndex.value = unrevealedIdx
      runSingleReveal(unrevealedIdx)
    }
  }

  const selectPlayerReveal = (idx: number) => {
    if (phase.value !== 'revealing' || revealMode.value !== 'individual') return
    currentRevealingPlayerIndex.value = idx
    runSingleReveal(idx)
  }

  // もう一度 (リセット)
  const resetToSetup = () => {
    clearInterval(animationTimer)
    phase.value = 'setup'
    results.value = []
    playerProgress.value = {}
    currentRevealingPlayerIndex.value = null
  }

  return {
    phase,
    players,
    prizes,
    loseLabel,
    hideGoalsBeforeReveal,
    manualRungs,
    autoRungs,
    allRungs,
    rungDensity,
    followSpeed,
    revealMode,
    activePaths,
    shuffledGoals,
    currentRevealingPlayerIndex,
    playerProgress,
    results,
    totalPrizes,
    colCount,
    rowCount,
    canStartReveal,
    commentJoin,
    addPlayer,
    addManualPlayers,
    removePlayer,
    addPrize,
    removePrize,
    onToggleRung,
    generateAuto,
    resetAutoRungs,
    resetAllRungs,
    startReveal,
    nextPlayerReveal,
    selectPlayerReveal,
    resetToSetup,
  }
}
