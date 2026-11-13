// src/ui/CookieCounter/CookieCounterRegistry.ts
import {
  getUiComponent,
  getUiComponentSets,
  hasUiComponent,
  registerUiComponents,
  type UiComponentDefinition,
  type UiComponentSets,
} from '@/ui/common/uiComponentRegistry'
import type { CookieComponent } from '@/types/ui'

const UI_NAME = 'cookieCounter'

/** この UI 固有のメタ。 */
type Meta = {
  maxCounters: number // 設定できるカウンターの最大数
  isColor: boolean // カラー設定を使うか(TODO: 現状どこからも参照されていない)
  maxCharacters: number // 設定できるキャラクターの数(0 ならキャラクターを使わない)
}

// 登録に必要な共通型
export type CookieCounterComponent = UiComponentDefinition<Meta>
export type CookieCounterComponentSets = UiComponentSets<Meta>

// 共通 UI コンポーネント登録
export const registerCookieCounterComponents = (sets: CookieCounterComponentSets) => registerUiComponents(UI_NAME, sets)
export const getCookieCounterComponentSets = () => getUiComponentSets<Meta>(UI_NAME)
export const getCookieCounterComponent = (id: string) => getUiComponent<Meta>(UI_NAME, id)

/** 登録済みの ID かどうか */
export const isKnownCookieComponent = (id: string): id is CookieComponent => hasUiComponent(UI_NAME, id)
