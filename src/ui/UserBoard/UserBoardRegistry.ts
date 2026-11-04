// src/ui/UserBoard/UserBoardRegistry.ts
import {
  getUiComponent,
  getUiComponentSets,
  hasUiComponent,
  registerUiComponents,
  type UiComponentDefinition,
  type UiComponentSets,
} from '@/ui/common/uiComponentRegistry'
import type { BoardComponent } from '@/types/ui'

const UI_NAME = 'userBoard'

/** この UI 固有のメタ。 */
type Meta = {
  description: string // エディターの選択肢に出す説明
  hasLimit: boolean // 表示件数(limit)の設定を使うか
}

// 登録に必要な共通型
export type UserBoardComponent = UiComponentDefinition<Meta>
export type UserBoardComponentSets = UiComponentSets<Meta>

// 共通 UI コンポーネント登録
export const registerUserBoardComponents = (sets: UserBoardComponentSets) => registerUiComponents(UI_NAME, sets)
export const getUserBoardComponentSets = () => getUiComponentSets<Meta>(UI_NAME)
export const getUserBoardComponent = (id: string) => getUiComponent<Meta>(UI_NAME, id)

/** 登録済みの ID かどうか */
export const isKnownBoardComponent = (id: string): id is BoardComponent => hasUiComponent(UI_NAME, id)
