// src/generator/stores/createAppServices.ts
import { shallowReactive } from 'vue'
import { UserStatsManager } from '@/common/UserStats/UserStatsManager'
import { UserStatsControlSync } from './UserStats/UserStatsControlSync'
import { ServiceMetaStore } from './MetaState/MetaStateService'
import { StreamStatsManager } from './StreamStats/StreamStatsManager'
import { ReactionStatsManager } from './ReactionManager/ReactionStatsManager'
import { ExpressionEngine } from '@/engine/VariablePlaceholder/ExpressionEngine'
import { PlaceholderVariable } from '@/engine/types/VariablePlaceholder'
import { GameScriptManager } from '@/engine/GameScriptPlay/GameScriptManager'

/**
 * 配信の数値を持つ Service を作る
 *
 * 画面に出す値は、Service が Vue のリアクティブな状態として持つ (正本は Service のみ。画面側にコピーは置かない)。
 *   - streamStats / reactionStats / serviceMetaStore: クラスの中で shallowReactive を使う
 *   - userStats / placeholderVariable: engine・common (サーバーも使う) は Vue に依存しないので、
 *     保存先の Map (userStats) と ExpressionEngine (変数。Map を継承) を、ここで shallowReactive にして渡す
 * 画面側は get… を computed / watch の中で読むだけでよく、購読や更新通知は要らない。
 * 書き込みの経路 (Pinia のストア経由か、このファイルの中のインスタンスか) でも挙動は変わらない。
 *
 * 新しい Service を足すときも、画面に出す値は同じようにリアクティブな状態にすること。
 */
export function createAppServices() {
  const userStats = new UserStatsManager(shallowReactive(new Map()))
  const userStatsSync = new UserStatsControlSync(userStats) // LiveConsole で操作した値の取り込み
  const scriptManager = new GameScriptManager()
  const serviceMetaStore = ServiceMetaStore.getInstance()
  const streamStats = new StreamStatsManager()
  const placeholderVariable = new PlaceholderVariable(shallowReactive(new ExpressionEngine()))
  const reactionStats = new ReactionStatsManager()

  // 配信単位のデータ(配信統計・ユーザー統計)をまとめてリセットする
  // 配信開始時、わんコメ側のコメントがリセットされたとき、エディターのセッションリセットで使う。
  // (リアクション統計はリアクション購読の開始・停止に合わせてリセットする。評価ブロックの変数は配信が変わっても残す)
  const resetStreamData = () => {
    streamStats.reset()
    userStats.reset()
  }

  // 配信開始時に各種データリセット
  // previous が null の最初の通知は、遷移ではなく「最初の観測」。配信中にジェネレーターを開き直しても、統計を消さない
  serviceMetaStore.subscribe((event) => {
    if (event.previous === null) return
    const prev = event.previous.isLive
    const curr = event.current.isLive
    if (!prev && curr) resetStreamData()
  })

  return {
    userStats,
    userStatsSync,
    scriptManager,
    serviceMetaStore,
    streamStats,
    placeholderVariable,
    reactionStats,
    resetStreamData,
  }
}
