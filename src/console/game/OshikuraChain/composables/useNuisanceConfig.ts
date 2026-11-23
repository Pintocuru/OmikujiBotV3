// src/console/game/OshikuraChain/composables/useNuisanceConfig.ts
// コンフィグの読み込み・編集・保存 (サーバーの game-configs/oshikuraChain.json)
import { reactive, ref } from 'vue'
import { gameConfigApi } from '@/manager/services/gameConfigApi'
import { ConnectionError } from '@/manager/services/baseApiClient'
import {
  createDefaultConfig,
  createConfigForDifficulty,
  parseConfig,
  sanitizeConfig,
  type DifficultyLevel,
  type NuisanceConfigType,
} from '../scripts/nuisanceConfig'
import { CONFIG_GAME_KEY } from '../scripts/nuisanceConstants'

const messageOf = (error: unknown) => (error instanceof Error ? error.message : String(error))

export function useNuisanceConfig() {
  /** 難易度と初見コメントの設定。ゲーム中は commit 済みの値を使う */
  const draft = reactive<NuisanceConfigType>(createDefaultConfig())
  const online = ref(true)
  const loadError = ref('')
  const saveError = ref('')

  const assign = (config: NuisanceConfigType) => Object.assign(draft, config)

  const load = async () => {
    loadError.value = ''
    try {
      const raw = await gameConfigApi.loadConfig(CONFIG_GAME_KEY)
      online.value = true
      if (raw === null) return
      const { config, error } = parseConfig(raw)
      assign(config)
      if (error) loadError.value = error
    } catch (error) {
      if (error instanceof ConnectionError) online.value = false
      else loadError.value = messageOf(error)
    }
  }

  /** 設定を保存する。保存に失敗してもゲームは開始できる */
  const commit = async (): Promise<NuisanceConfigType> => {
    const config = sanitizeConfig(draft)
    assign(config)
    saveError.value = ''
    try {
      await gameConfigApi.saveConfig(CONFIG_GAME_KEY, {
        difficulty: config.difficulty,
        resetCoefficientOnFirst: config.resetCoefficientOnFirst,
      })
      online.value = true
    } catch (error) {
      if (error instanceof ConnectionError) online.value = false
      else saveError.value = messageOf(error)
    }
    return config
  }

  const reset = () => assign(createDefaultConfig())
  const setDifficulty = (difficulty: DifficultyLevel) =>
    assign(createConfigForDifficulty(difficulty, draft.resetCoefficientOnFirst))
  const setResetCoefficientOnFirst = (enabled: boolean) => {
    draft.resetCoefficientOnFirst = enabled
  }

  return {
    draft,
    online,
    loadError,
    saveError,
    load,
    commit,
    reset,
    setDifficulty,
    setResetCoefficientOnFirst,
  }
}
