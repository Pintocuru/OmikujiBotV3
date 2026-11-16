// src/ui/user/LabelMaker/LabelMakerRegistry.ts
import {
  getUiComponent,
  getUiComponentSets,
  hasUiComponent,
  registerUiComponents,
  type UiComponentDefinition,
  type UiComponentSets,
} from '@/ui/common/uiComponentRegistry'
import type { LabelMakerComponent } from '@/types/ui'

const UI_NAME = 'labelMaker'

/** この UI 固有のメタ。設定項目(表示件数など)は Schema 側に持ち、コンポーネントごとには持たない。 */
type Meta = {
  descriptionKey: string // エディターの選択肢に出す説明の i18n キー
}

// 登録に必要な共通型
export type LabelMakerUiComponent = UiComponentDefinition<Meta>
export type LabelMakerUiComponentSets = UiComponentSets<Meta>

// 共通 UI コンポーネント登録
export const registerLabelMakerComponents = (sets: LabelMakerUiComponentSets) => registerUiComponents(UI_NAME, sets)
export const getLabelMakerComponentSets = () => getUiComponentSets<Meta>(UI_NAME)
export const getLabelMakerComponent = (id: string) => getUiComponent<Meta>(UI_NAME, id)

/** 登録済みの ID かどうか */
export const isKnownLabelMakerComponent = (id: string): id is LabelMakerComponent => hasUiComponent(UI_NAME, id)
