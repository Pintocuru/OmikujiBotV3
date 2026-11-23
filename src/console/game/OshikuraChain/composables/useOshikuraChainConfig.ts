// src/console/game/OshikuraChain/composables/useOshikuraChainConfig.ts
// コンフィグの読み込み・編集・保存 (サーバーの game-configs/oshikuraChain.json)
import { reactive, ref } from 'vue'
import { gameConfigApi } from '@/manager/services/gameConfigApi'
import { ConnectionError } from '@/manager/services/baseApiClient'
import {
  createDefaultConfig,
  createConfigForDifficulty,
  parseConfig,
  sanitizeConfig,
  type CommentSource,
  type DifficultyLevel,
  type GameMode,
  type OshikuraChainConfig,
} from '../scripts/nuisanceConfig'
import { CONFIG_GAME_KEY } from '../scripts/nuisanceConstants'

const messageOf = (error: unknown) => (error instanceof Error ? error.message : String(error))

export function useOshikuraChainConfig() {
  /** 難易度・ゲームモード・コメントの源・初見コメントの設定。ゲーム中は commit 済みの値を使う */
  const draft = reactive<OshikuraChainConfig>(createDefaultConfig())
  const online = ref(true)
  const loadError = ref('')
  const saveError = ref('')

  const assign = (config: OshikuraChainConfig) => Object.assign(draft, config)

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
  const commit = async (): Promise<OshikuraChainConfig> => {
    const config = sanitizeConfig(draft)
    assign(config)
    saveError.value = ''
    try {
      await gameConfigApi.saveConfig(CONFIG_GAME_KEY, {
        difficulty: config.difficulty,
        resetMultiplierOnFirst: config.resetMultiplierOnFirst,
        gameMode: config.gameMode,
        commentSource: config.commentSource,
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
    assign(createConfigForDifficulty(difficulty, draft.resetMultiplierOnFirst, draft.gameMode, draft.commentSource))
  const setGameMode = (gameMode: GameMode) => {
    draft.gameMode = gameMode
  }
  const setCommentSource = (commentSource: CommentSource) => {
    draft.commentSource = commentSource
  }
  const setResetMultiplierOnFirst = (enabled: boolean) => {
    draft.resetMultiplierOnFirst = enabled
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
    setGameMode,
    setCommentSource,
    setResetMultiplierOnFirst,
  }
}
