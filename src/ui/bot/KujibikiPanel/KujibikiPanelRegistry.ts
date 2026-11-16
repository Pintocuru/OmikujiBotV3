// src/ui/KujibikiPanel/KujibikiPanelRegistry.ts
import {
  getUiComponent,
  getUiComponentSets,
  hasUiComponent,
  registerUiComponents,
  type UiComponentDefinition,
  type UiComponentSets,
} from '@/ui/common/uiComponentRegistry'
import type { KujibikiComponent } from '@/types/ui'

const UI_NAME = 'kujibikiPanel'

/** この UI 固有のメタ。 */
type Meta = { isVisual: boolean }

// 登録に必要な共通型
export type KujibikiPanelComponent = UiComponentDefinition<Meta>
export type KujibikiPanelComponentSets = UiComponentSets<Meta>

// 共通 UI コンポーネント登録
export const registerKujibikiPanelComponents = (sets: KujibikiPanelComponentSets) => registerUiComponents(UI_NAME, sets)
export const getKujibikiPanelComponentSets = () => getUiComponentSets<Meta>(UI_NAME)
export const getKujibikiPanelComponent = (id: string) => getUiComponent<Meta>(UI_NAME, id)

/** 登録済みの ID かどうか */
export const isKnownKujibikiComponent = (id: string): id is KujibikiComponent => hasUiComponent(UI_NAME, id)
