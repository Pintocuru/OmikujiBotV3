// src/console/game/WordAlchemy/composables/useCodex.ts
// 図鑑の読み込み・記録・保存・リセット (サーバーの game-configs/wordAlchemyCodex.json。配信者ごとに 1 つ)
import { computed, ref } from 'vue'
import { ConnectionError } from '@/manager/services/baseApiClient'
import { gameConfigApi } from '@/manager/services/gameConfigApi'
import { itemList } from '../maps/WordAlchemyItemMap'
import {
  CODEX_GAME_KEY,
  countDiscovered,
  createEmptyCodex,
  parseCodex,
  recordDiscovery,
  type Codex,
} from '../scripts/codex'

export function useCodex() {
  const codex = ref<Codex>(createEmptyCodex())
  /** サーバーに繋がっていない (保存できない。図鑑はこの画面を開いている間だけ残る) */
  const offline = ref(false)
  /** 保存されていた図鑑を読めず、初期化した */
  const discarded = ref(false)
  const saveError = ref('')

  const found = computed(() => countDiscovered(codex.value, itemList))
  const total = itemList.length

  // 読み込み前に記録・リセットが起きたら、あとから届いた保存データで上書きしない
  let touched = false
  // 保存は順番に行う (連続で発見しても、古い内容が最後に書かれないように)
  let queue: Promise<void> = Promise.resolve()

  const handleError = (error: unknown) => {
    if (error instanceof ConnectionError) offline.value = true
    else saveError.value = error instanceof Error ? error.message : String(error)
  }

  const load = async () => {
    try {
      const raw = await gameConfigApi.loadConfig(CODEX_GAME_KEY)
      offline.value = false
      if (touched) return
      const parsed = parseCodex(raw)
      codex.value = parsed.codex
      discarded.value = parsed.discarded
    } catch (error) {
      handleError(error)
    }
  }

  const persist = () => {
    const snapshot = codex.value
    queue = queue.then(async () => {
      try {
        await gameConfigApi.saveConfig(CODEX_GAME_KEY, snapshot)
        offline.value = false
        saveError.value = ''
      } catch (error) {
        handleError(error)
      }
    })
    return queue
  }

  /** 発見を記録して保存する。新種なら true */
  const record = (found: { itemId: string; name: string; userNames: readonly string[]; pot: string }): boolean => {
    touched = true
    const result = recordDiscovery(codex.value, { ...found, at: Date.now() })
    codex.value = result.codex
    void persist()
    return result.isNew
  }

  /** 発見履歴を含め、図鑑をすべて削除する (保存を、初期状態で上書きする) */
  const reset = () => {
    touched = true
    codex.value = createEmptyCodex()
    discarded.value = false
    return persist()
  }

  return { codex, found, total, offline, discarded, saveError, load, record, reset }
}
