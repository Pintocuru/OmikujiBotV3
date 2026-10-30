// src/editor/ui/uiEditorRegistry.ts
import { defineAsyncComponent, type Component } from 'vue'
import { UiKind } from '@/types/OmikujiData'
import { uiKindMap } from '@/maps/OmikujiData'
import { defineGuardedAsyncComponent } from '@/common/buildValidation/guardedAsyncComponent'

type Loader = () => Promise<{ default: Component }>

/**
 * 登録の単位。Loader だけを渡した場合は editor のみ(従来どおり)
 * - slotsEditor: ScenarioStep の message で、その UI 固有の slots 編集画面(無い UI は汎用の text 入力)
 * - preview: ScenarioStep の message で、その UI 固有のプレビュー(無い UI は CommentBubblePreview)
 * 登録した UI の分だけ import が残るので、パッケージ単体のエントリでは必要な UI だけ渡す
 */
export type UiEditorDef = {
  editor: Loader
  slotsEditor?: Loader
  preview?: Loader
}

type Entry = (typeof uiKindMap)[UiKind] & { component: Component; slotsEditor?: Component; preview?: Component }

const entries: Partial<Record<UiKind, Entry>> = {}

export const registerUiEditor = (defs: Partial<Record<UiKind, Loader | UiEditorDef>>) => {
  for (const [kind, def] of Object.entries(defs) as [UiKind, Loader | UiEditorDef][]) {
    const { editor, slotsEditor, preview }: UiEditorDef = typeof def === 'function' ? { editor: def } : def
    entries[kind] = {
      ...uiKindMap[kind],
      component: defineGuardedAsyncComponent(editor, { type: 'ui', key: kind }),
      slotsEditor: slotsEditor && defineAsyncComponent(slotsEditor),
      preview: preview && defineAsyncComponent(preview),
    }
  }
}
export const getUiEditorEntries = () => entries
export const getUiSlotsEditor = (kind: UiKind) => entries[kind]?.slotsEditor
export const getUiPreview = (kind: UiKind) => entries[kind]?.preview
