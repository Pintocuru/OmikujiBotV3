// src/ui/ToastWidgets/ToastWidgetsRegistry.ts
import {
  getUiComponent,
  getUiComponentSets,
  hasUiComponent,
  registerUiComponents,
  type UiComponentDefinition,
  type UiComponentSets,
} from '@/ui/common/uiComponentRegistry'
import type { ToastComponent } from '@/types/ui'

const UI_NAME = 'toastWidgets'

/** この UI 固有のメタ。現状はなし。 */
type Meta = object

// 登録に必要な共通型
export type ToastWidgetsComponent = UiComponentDefinition<Meta>
export type ToastWidgetsComponentSets = UiComponentSets<Meta>

// 共通 UI コンポーネント登録
export const registerToastWidgetsComponents = (sets: ToastWidgetsComponentSets) => registerUiComponents(UI_NAME, sets)
export const getToastWidgetsComponentSets = () => getUiComponentSets<Meta>(UI_NAME)
export const getToastWidgetsComponent = (id: string) => getUiComponent<Meta>(UI_NAME, id)

/** 登録済みの ID かどうか */
export const isKnownToastComponent = (id: string): id is ToastComponent => hasUiComponent(UI_NAME, id)
