// src/editor/ui/uiEditorRegistry.ts
import { defineAsyncComponent, type Component } from 'vue'
import { UiKind } from '@/types/OmikujiData'
import { uiKindIcons } from '@/maps/OmikujiData'
import { defineGuardedAsyncComponent } from '@/common/buildValidation/guardedAsyncComponent'
import type { LucideIconName } from '@/common/LucideIcon/useLucideIcon'

type Loader = () => Promise<{ default: Component }>

/**
 * 登録の単位
 */
export type UiEditorDef = {
  editor: Loader
  slotsEditor?: Loader
  preview?: Loader
}

type Entry = { icon: LucideIconName; component: Component; slotsEditor?: Component; preview?: Component }

const entries: Partial<Record<UiKind, Entry>> = {}

export const registerUiEditor = (defs: Partial<Record<UiKind, Loader | UiEditorDef>>) => {
  for (const [kind, def] of Object.entries(defs) as [UiKind, Loader | UiEditorDef][]) {
    const { editor, slotsEditor, preview }: UiEditorDef = typeof def === 'function' ? { editor: def } : def
    entries[kind] = {
      icon: uiKindIcons[kind],
      component: defineGuardedAsyncComponent(editor, { type: 'ui', key: kind }),
      slotsEditor: slotsEditor && defineAsyncComponent(slotsEditor),
      preview: preview && defineAsyncComponent(preview),
    }
  }
}
export const getUiEditorEntries = () => entries
export const getUiSlotsEditor = (kind: UiKind) => entries[kind]?.slotsEditor
export const getUiPreview = (kind: UiKind) => entries[kind]?.preview
