// src/console/game/WordAlchemy/ai/aiClient.ts
// AI への問い合わせ (サーバーの中継ハンドラを呼ぶ層)。メイン → サブの切り替えは、サーバーが行う
import { aiApi, AiRateLimitedError } from '@/manager/services/aiApi'
import type { AiSlotKeyType } from '@/types/api'
import { AlchemyRateLimitError, type AlchemyClient } from './alchemy'

/** onSlot: 実際に返事をくれた接続先 (メイン / サブ) を受け取る (画面の表示用) */
export const createAiClient = (onSlot: (slot: AiSlotKeyType) => void): AlchemyClient => ({
  complete: async (prompt) => {
    try {
      const { text, slot } = await aiApi.ask(prompt)
      onSlot(slot)
      return text
    } catch (error) {
      // 使える接続先がすべて上限超過のときは、Mock にフォールバックして、その旨を表示する
      if (error instanceof AiRateLimitedError) throw new AlchemyRateLimitError()
      throw error
    }
  },
})
