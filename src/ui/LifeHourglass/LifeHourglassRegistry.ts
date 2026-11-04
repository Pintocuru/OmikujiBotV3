// src/ui/LifeHourglass/LifeHourglassRegistry.ts
import {
  getUiComponent,
  getUiComponentSets,
  hasUiComponent,
  registerUiComponents,
  type UiComponentDefinition,
  type UiComponentSets,
} from '@/ui/common/uiComponentRegistry'
// ID 型(スキーマ側)と名前が同じになるため、別名で import する
import type { LifeHourglassComponent as LifeHourglassComponentId } from '@/types/ui'

const UI_NAME = 'lifeHourglass'

/** この UI 固有のメタ。現状はなし。 */
type Meta = object

// 登録に必要な共通型(Registry 側の型は「Ui」を挟んで ID 型と区別する)
export type LifeHourglassUiComponent = UiComponentDefinition<Meta>
export type LifeHourglassUiComponentSets = UiComponentSets<Meta>

// 共通 UI コンポーネント登録
export const registerLifeHourglassComponents = (sets: LifeHourglassUiComponentSets) => registerUiComponents(UI_NAME, sets)
export const getLifeHourglassComponentSets = () => getUiComponentSets<Meta>(UI_NAME)
export const getLifeHourglassComponent = (id: string) => getUiComponent<Meta>(UI_NAME, id)

/** 登録済みの ID かどうか */
export const isKnownLifeHourglassComponent = (id: string): id is LifeHourglassComponentId => hasUiComponent(UI_NAME, id)
