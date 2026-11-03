// src/ui/GameRanking/GameRankingRegistry.ts
import {
  getUiComponent,
  getUiComponentSets,
  hasUiComponent,
  registerUiComponents,
  type UiComponentDefinition,
  type UiComponentSets,
} from '@/ui/common/uiComponentRegistry'
import type { RankingComponent } from '@/types/ui'

const UI_NAME = 'gameRanking'

/** この UI 固有のメタ。現状はなし。 */
type Meta = object

// 登録に必要な共通型
export type GameRankingComponent = UiComponentDefinition<Meta>
export type GameRankingComponentSets = UiComponentSets<Meta>

// 共通 UI コンポーネント登録
export const registerGameRankingComponents = (sets: GameRankingComponentSets) => registerUiComponents(UI_NAME, sets)
export const getGameRankingComponentSets = () => getUiComponentSets<Meta>(UI_NAME)
export const getGameRankingComponent = (id: string) => getUiComponent<Meta>(UI_NAME, id)

/** 登録済みの ID かどうか */
export const isKnownRankingComponent = (id: string): id is RankingComponent => hasUiComponent(UI_NAME, id)
