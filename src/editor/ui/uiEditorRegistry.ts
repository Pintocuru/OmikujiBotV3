// src/editor/ui/uiEditorRegistry.ts
import type { Component } from 'vue'
import { UiKind } from '@/types/OmikujiData'
import { uiKindMap } from '@/maps/OmikujiData'
import { defineGuardedAsyncComponent } from '@/common/buildValidation/guardedAsyncComponent'

type Loader = () => Promise<{ default: Component }>
type Entry = (typeof uiKindMap)[UiKind] & { component: Component }

const entries: Partial<Record<UiKind, Entry>> = {}

export const registerUiEditor = (loaders: Partial<Record<UiKind, Loader>>) => {
  for (const [kind, loader] of Object.entries(loaders) as [UiKind, Loader][]) {
    entries[kind] = { ...uiKindMap[kind], component: defineGuardedAsyncComponent(loader, { type: 'ui', key: kind }) }
  }
}
export const getUiEditorEntries = () => entries
