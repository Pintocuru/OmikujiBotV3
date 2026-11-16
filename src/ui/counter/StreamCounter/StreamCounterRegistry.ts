// src/ui/StreamCounter/StreamCounterRegistry.ts
import {
  getUiComponent,
  getUiComponentSets,
  hasUiComponent,
  registerUiComponents,
  type UiComponentDefinition,
  type UiComponentSets,
} from '@/ui/common/uiComponentRegistry'
import type { StreamComponent } from '@/types/ui'

const UI_NAME = 'streamCounter'

/** この UI 固有のメタ。現状はなし(並べ方などは、コンポーネント側で決める)。 */
type Meta = object

// 登録に必要な共通型
export type StreamCounterComponent = UiComponentDefinition<Meta>
export type StreamCounterComponentSets = UiComponentSets<Meta>

// 共通 UI コンポーネント登録
export const registerStreamCounterComponents = (sets: StreamCounterComponentSets) => registerUiComponents(UI_NAME, sets)
export const getStreamCounterComponentSets = () => getUiComponentSets<Meta>(UI_NAME)
export const getStreamCounterComponent = (id: string) => getUiComponent<Meta>(UI_NAME, id)

/** 登録済みの ID かどうか */
export const isKnownStreamComponent = (id: string): id is StreamComponent => hasUiComponent(UI_NAME, id)
