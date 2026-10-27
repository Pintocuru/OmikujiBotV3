// src/generator/stores/createAppServices.ts
import { UserStatsManager } from './UserStats/UserStatsManager'
import { UserStatsControlSync } from './UserStats/UserStatsControlSync'
import { ServiceMetaStore } from './MetaState/MetaStateService'
import { StreamStatsManager } from './StreamStats/StreamStatsManager'
import { ReactionStatsManager } from './ReactionManager/ReactionStatsManager'
import { PlaceholderVariable } from '@/engine/types/VariablePlaceholder'
import { GameScriptManager } from '@/engine/GameScriptPlay/GameScriptManager'

export function createAppServices() {
  const userStats = new UserStatsManager()
  const userStatsSync = new UserStatsControlSync(userStats) // LiveConsole で操作した値の取り込み
  const scriptManager = new GameScriptManager()
  const serviceMetaStore = ServiceMetaStore.getInstance()
  const streamStats = new StreamStatsManager()
  const placeholderVariable = new PlaceholderVariable()
  const reactionStats = new ReactionStatsManager()

  // 配信開始時に各種データリセット
  serviceMetaStore.subscribe((event) => {
    const prev = event.previous?.isLive ?? false
    const curr = event.current.isLive
    if (!prev && curr) {
      streamStats.reset()
      userStats.reset()
    }
  })

  return {
    userStats,
    userStatsSync,
    scriptManager,
    serviceMetaStore,
    streamStats,
    placeholderVariable,
    reactionStats,
  }
}
