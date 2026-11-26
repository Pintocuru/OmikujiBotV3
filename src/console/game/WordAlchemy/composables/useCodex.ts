// src/console/game/WordAlchemy/composables/useCodex.ts
// 図鑑 (鍋ごと) の読み込み・記録・保存・リセット (サーバーの game-configs/wordAlchemyCodex.json。配信者ごとに 1 つ)
import { ref } from 'vue'
import { ConnectionError } from '@/manager/services/baseApiClient'
import { gameConfigApi } from '@/manager/services/gameConfigApi'
import { itemList } from '../maps/WordAlchemyItemMap'
import {
  CODEX_GAME_KEY,
  countDiscovered,
  createEmptyCodex,
  getEntry,
  parseCodex,
  setEntry,
  type Codex,
  type CodexEntry,
} from '../scripts/codex'

export function useCodex() {
  const codex = ref<Codex>(createEmptyCodex())
  /** サーバーに繋がっていない (保存できない。図鑑はこの画面を開いている間だけ残る) */
  const offline = ref(false)
  /** 保存されていた図鑑を読めず、初期化した */
  const discarded = ref(false)
  const saveError = ref('')

  /** その鍋で発見したアイテムの数 (分母は total) */
  const foundIn = (pot: string) => countDiscovered(codex.value, pot, itemList)
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

  /** その鍋の図鑑の枠 (なければ undefined) */
  const entryOf = (pot: string, itemId: string): CodexEntry | undefined => getEntry(codex.value, pot, itemId)

  /**
   * 枠に入れて保存する。空の枠 (新種) への登録にも、すでにある枠の置き換え (新旧のどちらを残すかの選択で、新しいほうを選んだとき) にも使う。
   * 置き換えるかどうかは、呼び出し側が決める (ここでは、渡されたものをそのまま入れる)
   */
  const store = (pot: string, itemId: string, entry: CodexEntry): void => {
    touched = true
    codex.value = setEntry(codex.value, pot, itemId, entry)
    void persist()
  }

  /** 全部の鍋の図鑑を削除する (保存を、初期状態で上書きする) */
  const reset = () => {
    touched = true
    codex.value = createEmptyCodex()
    discarded.value = false
    return persist()
  }

  return { codex, foundIn, total, offline, discarded, saveError, load, entryOf, store, reset }
}
