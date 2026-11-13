// src/ui/SnipeTimer/SnipeTimerRegistry.ts
import {
  getUiComponent,
  getUiComponentSets,
  hasUiComponent,
  registerUiComponents,
  type UiComponentDefinition,
  type UiComponentSets,
} from '@/ui/common/uiComponentRegistry'
// ID 型(スキーマ側)と名前が同じになるため、別名で import する
import type { SnipeTimerComponent as SnipeTimerComponentId } from '@/types/ui'

const UI_NAME = 'snipeTimer'

/** この UI 固有のメタ。現状はなし。 */
type Meta = object

// 登録に必要な共通型
export type SnipeTimerUiComponent = UiComponentDefinition<Meta>
export type SnipeTimerUiComponentSets = UiComponentSets<Meta>

// 共通 UI コンポーネント登録
export const registerSnipeTimerComponents = (sets: SnipeTimerUiComponentSets) => registerUiComponents(UI_NAME, sets)
export const getSnipeTimerComponentSets = () => getUiComponentSets<Meta>(UI_NAME)
export const getSnipeTimerComponent = (id: string) => getUiComponent<Meta>(UI_NAME, id)

/** 登録済みの ID かどうか */
export const isKnownSnipeTimerComponent = (id: string): id is SnipeTimerComponentId => hasUiComponent(UI_NAME, id)
