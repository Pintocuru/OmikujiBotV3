// src/ui/KujibikiPanel/KujibikiPanelRegistry.ts
import {
  getUiComponent,
  getUiComponentSets,
  registerUiComponents,
  type UiComponentDefinition,
  type UiComponentSets,
} from '@/ui/common/uiComponentRegistry'
import type { KujibikiComponent } from '@/types/ui'

export type KujibikiPanelComponentMeta = { isVisual: boolean }
export type KujibikiPanelComponent = UiComponentDefinition<KujibikiPanelComponentMeta>
export type KujibikiPanelComponentSets = UiComponentSets<KujibikiPanelComponentMeta>

export const registerKujibikiPanelComponents = (sets: KujibikiPanelComponentSets) =>
  registerUiComponents('kujibikiPanel', sets)

export const getKujibikiPanelComponentSets = () =>
  getUiComponentSets<KujibikiPanelComponentMeta>('kujibikiPanel')

export const getKujibikiPanelComponent = (id: string) =>
  getUiComponent<KujibikiPanelComponentMeta>('kujibikiPanel', id)

export const isKnownKujibikiComponent = (id: string): id is KujibikiComponent =>
  Object.values(getKujibikiPanelComponentSets()).some((set) => id in set)
