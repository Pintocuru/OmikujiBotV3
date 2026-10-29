// src/console/users/composables/useTeamNames.ts
import { ref } from 'vue'
import { daisyUIColor, type DaisyUIColorType } from '@/types/core'
import { usersMessages } from '../maps/UsersMessageMap'
import { defaultTeamName } from '../scripts/userConsole'

const STORAGE_KEY = 'liveConsole.teamNames'
const MAX_LENGTH = usersMessages.teamNameDialog.maxLength

type TeamNames = Partial<Record<DaisyUIColorType, string>>

/** 前回付けたチーム名 (Chrome の localStorage。読めないときは、すべて初期の名前) */
const loadTeamNames = (): TeamNames => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return {}
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return {}
    const names: TeamNames = {}
    for (const team of daisyUIColor) {
      const value = (parsed as Record<string, unknown>)[team]
      if (typeof value === 'string' && value.trim() !== '') names[team] = value.trim().slice(0, MAX_LENGTH)
    }
    return names
  } catch {
    return {}
  }
}

/**
 * チームの名前 (チーム色ごと)
 * - 付けていないチームは、初期の名前 (「チーム1」など)。チーム色の名前 (warning など) は画面に出さない
 * - ブラウザごとの設定。OBS の表示には使わない (操作画面だけの名前)
 */
export function useTeamNames() {
  const names = ref<TeamNames>(loadTeamNames())

  const teamLabel = (team: DaisyUIColorType): string => names.value[team] ?? defaultTeamName(team)

  /** チーム名をまとめて保存する (空欄のチームは、初期の名前に戻す。next に含まれないチームは、そのまま) */
  const saveTeamNames = (next: Partial<Record<DaisyUIColorType, string>>) => {
    const cleaned: TeamNames = {}
    for (const team of daisyUIColor) {
      const value = (team in next ? (next[team] ?? '') : (names.value[team] ?? '')).trim().slice(0, MAX_LENGTH)
      if (value !== '') cleaned[team] = value
    }
    names.value = cleaned
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned))
    } catch {
      // 保存できなくても、画面は使える
    }
  }

  return { teamLabel, saveTeamNames }
}
