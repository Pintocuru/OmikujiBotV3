// src/console/control/Amidakuji/composables/useRevealAnimation.ts
// 発表のアニメーション。requestAnimationFrame で、全員(または一人)の高さ y を同じ速さで進める
import { computed, onBeforeUnmount, ref, shallowRef, type Ref } from 'vue'
import { FOLLOW_DURATION_SEC, type FollowSpeed } from '../scripts/amidakujiConstants'
import type { GoalItem } from '../scripts/goals'
import type { TracePath } from '../scripts/ladder'
import { buildResults } from '../scripts/results'
import type { AmidakujiPlayer } from './useJoinComments'

export type RevealMode = 'simultaneous' | 'individual'

type Deps = {
  players: Ref<AmidakujiPlayer[]>
  rowCount: Ref<number>
  speed: Ref<FollowSpeed>
  /** 全員の発表が終わったときに呼ぶ */
  onAllRevealed: () => void
}

export function useRevealAnimation({ players, rowCount, speed, onAllRevealed }: Deps) {
  const paths = shallowRef<TracePath[]>([])
  const goals = shallowRef<GoalItem[]>([])
  /** 参加者ごとの、辿った高さ (0 〜 rowCount) */
  const playerY = shallowRef<number[]>([])
  /** 発表済みの参加者 (縦線の番号) */
  const revealed = shallowRef<ReadonlySet<number>>(new Set())
  /** 一人ずつ辿っているときの、その人の番号 */
  const followIndex = ref<number | null>(null)
  const busy = ref(false)

  let rafId = 0

  const cancel = () => {
    if (rafId) cancelAnimationFrame(rafId)
    rafId = 0
    busy.value = false
    followIndex.value = null
  }

  const prepare = (nextPaths: TracePath[], nextGoals: GoalItem[]) => {
    cancel()
    paths.value = nextPaths
    goals.value = nextGoals
    playerY.value = new Array(nextPaths.length).fill(0)
    revealed.value = new Set()
  }

  const reset = () => {
    cancel()
    paths.value = []
    goals.value = []
    playerY.value = []
    revealed.value = new Set()
  }

  const finish = (targets: number[]) => {
    const next = new Set(revealed.value)
    targets.forEach((i) => next.add(i))
    revealed.value = next
    busy.value = false
    followIndex.value = null
    if (next.size >= paths.value.length) onAllRevealed()
  }

  const run = (targets: number[], follow: number | null) => {
    busy.value = true
    followIndex.value = follow
    const total = rowCount.value
    const rowsPerSec = total / FOLLOW_DURATION_SEC[speed.value]
    let last = performance.now()

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1) // タブが止まったあとの飛びを防ぐ
      last = now
      const next = playerY.value.slice()
      let running = false
      for (const i of targets) {
        next[i] = Math.min(total, next[i] + dt * rowsPerSec)
        if (next[i] < total) running = true
      }
      playerY.value = next
      if (running) {
        rafId = requestAnimationFrame(tick)
      } else {
        rafId = 0
        finish(targets)
      }
    }
    rafId = requestAnimationFrame(tick)
  }

  /** 全員同時 */
  const runAll = () => {
    if (busy.value || paths.value.length === 0) return
    run(
      paths.value.map((_, i) => i),
      null
    )
  }

  /** 一人だけ (発表済みの人は、もう一度辿り直す)。辿っている間は受け付けない */
  const runOne = (idx: number) => {
    if (busy.value || idx < 0 || idx >= paths.value.length) return
    const next = playerY.value.slice()
    next[idx] = 0
    playerY.value = next
    run([idx], idx)
  }

  /** まだ発表していない、先頭の人 */
  const runNext = () => {
    const idx = paths.value.findIndex((_, i) => !revealed.value.has(i))
    if (idx >= 0) runOne(idx)
  }

  /** 到着が明かされたゴールの縦線 (発表済み、または辿り終えた人の終点) */
  const arrivedCols = computed(() => {
    const cols = new Set<number>()
    paths.value.forEach((path, i) => {
      if (revealed.value.has(i) || (playerY.value[i] ?? 0) >= rowCount.value) cols.add(path.endCol)
    })
    return cols
  })

  const results = computed(() => buildResults(players.value, goals.value, paths.value, revealed.value))

  onBeforeUnmount(cancel)

  return {
    paths,
    goals,
    playerY,
    revealed,
    followIndex,
    busy,
    arrivedCols,
    results,
    prepare,
    reset,
    runAll,
    runOne,
    runNext,
  }
}
