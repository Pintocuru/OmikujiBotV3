// src/ui/LiveClock/LiveClockRegistry.ts
import {
  getUiComponent,
  getUiComponentSets,
  hasUiComponent,
  registerUiComponents,
  type UiComponentDefinition,
  type UiComponentSets,
} from '@/ui/common/uiComponentRegistry'
import type { ClockComponent } from '@/types/ui'

const UI_NAME = 'liveClock'

/** この UI 固有のメタ。 */
type Meta = {
  isColor: boolean // カラー設定を使うか(TODO: 現状どこからも参照されていない)
}

// 登録に必要な共通型
export type LiveClockComponent = UiComponentDefinition<Meta>
export type LiveClockComponentSets = UiComponentSets<Meta>

// 共通 UI コンポーネント登録
export const registerLiveClockComponents = (sets: LiveClockComponentSets) => registerUiComponents(UI_NAME, sets)
export const getLiveClockComponentSets = () => getUiComponentSets<Meta>(UI_NAME)
export const getLiveClockComponent = (id: string) => getUiComponent<Meta>(UI_NAME, id)

/** 登録済みの ID かどうか */
export const isKnownClockComponent = (id: string): id is ClockComponent => hasUiComponent(UI_NAME, id)
