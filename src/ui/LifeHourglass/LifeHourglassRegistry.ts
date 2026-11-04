// src/ui/LifeHourglass/LifeHourglassRegistry.ts
import {
  getUiComponent,
  getUiComponentSets,
  hasUiComponent,
  registerUiComponents,
  type UiComponentDefinition,
  type UiComponentSets,
} from '@/ui/common/uiComponentRegistry'
import type { LifeHourglassComponent } from '@/types/ui'

const UI_NAME = 'lifeHourglass'

/** この UI 固有のメタ。現状はなし。 */
type Meta = object

// 登録に必要な共通型
export type LifeHourglassComponent = UiComponentDefinition<Meta>
export type LifeHourglassComponentSets = UiComponentSets<Meta>

// 共通 UI コンポーネント登録
export const registerLifeHourglassComponents = (sets: LifeHourglassComponentSets) => registerUiComponents(UI_NAME, sets)
export const getLifeHourglassComponentSets = () => getUiComponentSets<Meta>(UI_NAME)
export const getLifeHourglassComponent = (id: string) => getUiComponent<Meta>(UI_NAME, id)

/** 登録済みの ID かどうか */
export const isKnownLifeHourglassComponent = (id: string): id is LifeHourglassComponent => hasUiComponent(UI_NAME, id)
