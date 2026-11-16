// src/ui/user/FlightSeat/FlightSeatRegistry.ts
import {
  getUiComponent,
  getUiComponentSets,
  hasUiComponent,
  registerUiComponents,
  type UiComponentDefinition,
  type UiComponentSets,
} from '@/ui/common/uiComponentRegistry'
// ID 型(スキーマ側)と名前が同じになるため、別名で import する
import type { FlightSeatComponent as FlightSeatComponentId } from '@/types/ui'

const UI_NAME = 'flightSeat'

/** 座席レイアウトのプリセット(layout は各行の座席数) */
export type FlightSeatPreset = {
  labelKey: string // uiSettings.flightSeat.presets.<キー>
  layout: number[]
}

/** この UI 固有のメタ。 */
type Meta = {
  /** number: 固定席数(customLayout は使わない) / string: 各行の座席数の JSON 配列文字列(customLayout で上書きできる) */
  defaultLayout: number | string
  presets: FlightSeatPreset[] | null // 適用できるプリセット(なければ null)
  framed: boolean // true: カード枠(背景色つき)で囲む / false: 枠なし
}

// 登録に必要な共通型
export type FlightSeatUiComponent = UiComponentDefinition<Meta>
export type FlightSeatUiComponentSets = UiComponentSets<Meta>

// 共通 UI コンポーネント登録
export const registerFlightSeatComponents = (sets: FlightSeatUiComponentSets) => registerUiComponents(UI_NAME, sets)
export const getFlightSeatComponentSets = () => getUiComponentSets<Meta>(UI_NAME)
export const getFlightSeatComponent = (id: string) => getUiComponent<Meta>(UI_NAME, id)

/** 登録済みの ID かどうか */
export const isKnownFlightSeatComponent = (id: string): id is FlightSeatComponentId => hasUiComponent(UI_NAME, id)
