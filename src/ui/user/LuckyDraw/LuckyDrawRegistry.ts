// src/ui/user/LuckyDraw/LuckyDrawRegistry.ts
import {
  getUiComponent,
  getUiComponentSets,
  hasUiComponent,
  registerUiComponents,
  type UiComponentDefinition,
  type UiComponentSets,
} from '@/ui/common/uiComponentRegistry'
// ID 型(スキーマ側)と名前が同じになるため、別名で import する
import type { LuckyDrawComponent as LuckyDrawComponentId } from '@/types/ui'

const UI_NAME = 'luckyDraw'

/** この UI 固有のメタ。現状はなし。 */
type Meta = object

// 登録に必要な共通型
export type LuckyDrawUiComponent = UiComponentDefinition<Meta>
export type LuckyDrawUiComponentSets = UiComponentSets<Meta>

// 共通 UI コンポーネント登録
export const registerLuckyDrawComponents = (sets: LuckyDrawUiComponentSets) => registerUiComponents(UI_NAME, sets)
export const getLuckyDrawComponentSets = () => getUiComponentSets<Meta>(UI_NAME)
export const getLuckyDrawComponent = (id: string) => getUiComponent<Meta>(UI_NAME, id)

/** 登録済みの ID かどうか */
export const isKnownLuckyDrawComponent = (id: string): id is LuckyDrawComponentId => hasUiComponent(UI_NAME, id)
