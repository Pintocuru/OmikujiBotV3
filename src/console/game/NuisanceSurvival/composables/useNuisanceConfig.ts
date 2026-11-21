// src/console/game/NuisanceSurvival/composables/useNuisanceConfig.ts
// コンフィグの読み込み・編集・保存 (サーバーの game-configs/nuisanceSurvival.json)
import { computed, reactive, ref } from 'vue'
import { gameConfigApi } from '@/manager/services/gameConfigApi'
import { ConnectionError } from '@/manager/services/baseApiClient'
import {
  CONFIG_KEYS,
  CONFIG_LIMITS,
  CONFIG_PRESETS,
  CONFIG_PRESET_IDS,
  createDefaultConfig,
  findMatchingPreset,
  parseConfig,
  sanitizeConfig,
  type ConfigPresetId,
  type NuisanceConfigKey,
  type NuisanceConfigType,
} from '../scripts/nuisanceConfig'
import { CONFIG_GAME_KEY } from '../scripts/nuisanceConstants'

const messageOf = (error: unknown) => (error instanceof Error ? error.message : String(error))

export function useNuisanceConfig() {
  /** フォームで編集中の値 (スタートを押すまで、ゲームには使われない) */
  const draft = reactive<NuisanceConfigType>(createDefaultConfig())
  /** サーバーに接続できているか (できなければ、設定も結果も保存されない) */
  const online = ref(true)
  const loadError = ref('')
  const saveError = ref('')

  const assign = (config: NuisanceConfigType) => {
    for (const key of CONFIG_KEYS) draft[key] = config[key]
  }

  const load = async () => {
    loadError.value = ''
    try {
      const raw = await gameConfigApi.loadConfig(CONFIG_GAME_KEY)
      online.value = true
      if (raw === null) return // まだ保存されていない: 既定値のまま
      const { config, error } = parseConfig(raw)
      assign(config)
      if (error) loadError.value = error
    } catch (error) {
      if (error instanceof ConnectionError) online.value = false
      else loadError.value = messageOf(error)
    }
  }

  /** 範囲に収めた値を、ゲームに使う設定として返す (フォームの表示も、収めた値にそろえる)。保存は失敗しても、ゲームは始められる */
  const commit = async (): Promise<NuisanceConfigType> => {
    const config = sanitizeConfig(draft)
    assign(config)
    saveError.value = ''
    try {
      await gameConfigApi.saveConfig(CONFIG_GAME_KEY, config)
      online.value = true
    } catch (error) {
      if (error instanceof ConnectionError) online.value = false
      else saveError.value = messageOf(error)
    }
    return config
  }

  const reset = () => assign(createDefaultConfig())

  /** プリセットの値を入力欄に入れる (保存はスタート時。入れたあとも、個別に編集できる) */
  const applyPreset = (id: ConfigPresetId) => assign(CONFIG_PRESETS[id])
  const activePreset = computed(() => findMatchingPreset(draft))

  /** フォームの入力を反映する (空欄などの数字でない値は、スタート時に既定値になる) */
  const setField = (key: NuisanceConfigKey, value: number) => {
    draft[key] = value
  }

  return {
    draft,
    limits: CONFIG_LIMITS,
    keys: CONFIG_KEYS,
    presetIds: CONFIG_PRESET_IDS,
    activePreset,
    online,
    loadError,
    saveError,
    load,
    commit,
    reset,
    applyPreset,
    setField,
  }
}
