// src/ui/game/DeadAir/DeadAirRegistry.ts
import {
  getUiComponent,
  getUiComponentSets,
  hasUiComponent,
  registerUiComponents,
  type UiComponentDefinition,
  type UiComponentSets,
} from '@/ui/common/uiComponentRegistry'
// ID 型(スキーマ側)と名前が同じになるため、別名で import する
import type { DeadAirComponent as DeadAirComponentId } from '@/types/ui'

const UI_NAME = 'deadAir'

/** この UI 固有のメタ。現状はなし。 */
type Meta = object

export type DeadAirUiComponent = UiComponentDefinition<Meta>
export type DeadAirUiComponentSets = UiComponentSets<Meta>

// 共通 UI コンポーネント登録
export const registerDeadAirComponents = (sets: DeadAirUiComponentSets) => registerUiComponents(UI_NAME, sets)
export const getDeadAirComponentSets = () => getUiComponentSets<Meta>(UI_NAME)
export const getDeadAirComponent = (id: string) => getUiComponent<Meta>(UI_NAME, id)

/** 登録済みの ID かどうか */
export const isKnownDeadAirComponent = (id: string): id is DeadAirComponentId => hasUiComponent(UI_NAME, id)
