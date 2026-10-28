// src/console/users/composables/useTeamCount.ts
import { computed, ref, watch } from 'vue'
import { teamCounts, type TeamCountType } from '@/console/types'
import { pickTeams } from '../scripts/userConsole'

const STORAGE_KEY = 'liveConsole.teamCount'
const DEFAULT_TEAM_COUNT: TeamCountType = 8 // これまでと同じ (全チーム色を使う)

const isTeamCount = (value: unknown): value is TeamCountType => (teamCounts as readonly unknown[]).includes(value)

/** 前回選んだチームの数 (Chrome の localStorage。読めないときは 8) */
const loadTeamCount = (): TeamCountType => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return DEFAULT_TEAM_COUNT
    const saved = Number(raw)
    return isTeamCount(saved) ? saved : DEFAULT_TEAM_COUNT
  } catch {
    return DEFAULT_TEAM_COUNT
  }
}

/**
 * ユーザー操作画面で使うチームの数
 * - teamCount: 0 = チーム区分なし (チームの表示を OFF)、2〜8 = そのチーム数 (チーム色の先頭から使う)
 * - 表示だけを変える。ユーザーに割り当て済みのチームは、数を変えても消さない
 */
export function useTeamCount() {
  const teamCount = ref<TeamCountType>(loadTeamCount())
  const teams = computed(() => pickTeams(teamCount.value))

  watch(teamCount, (value) => {
    try {
      localStorage.setItem(STORAGE_KEY, String(value))
    } catch {
      // 保存できなくても、画面は使える
    }
  })

  return { teamCount, teams }
}
