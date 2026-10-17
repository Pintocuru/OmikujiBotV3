// src/editor/ui/uiEditorRegistry.ts
import { defineAsyncComponent, type Component } from 'vue'
import { UiKind } from '@/types/OmikujiData'
import { uiKindMap } from '@/maps/OmikujiData'

type Loader = () => Promise<{ default: Component }>
type Entry = (typeof uiKindMap)[UiKind] & { component: Component }

const entries: Partial<Record<UiKind, Entry>> = {}

export const registerUiEditor = (loaders: Partial<Record<UiKind, Loader>>) => {
  for (const [kind, loader] of Object.entries(loaders) as [UiKind, Loader][]) {
    entries[kind] = { ...uiKindMap[kind], component: defineAsyncComponent(loader) }
  }
}
export const getUiEditorEntries = () => entries
