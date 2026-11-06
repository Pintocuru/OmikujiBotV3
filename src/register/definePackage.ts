// src/register/definePackage.ts
import { type Component } from 'vue'
import type { UiKind, UiLayoutType } from '@/types/OmikujiData'
import { registerUi, registerLayout, type UiLoader } from '@/ui/uiRegistry'
import { registerUiEditor } from '@/editor/ui/uiEditorRegistry'

type PackageDef = {
  kind: UiKind // UI 種別
  loader: UiLoader // UI 本体の loader
  layout: NonNullable<UiLayoutType> // ui.layout に使うキー
  registerComponents: () => void // 表示コンポーネント(standard セットなど)の登録関数
  editor?: () => Promise<{ default: Component }> // エディター
}

export const definePackage = ({ kind, loader, layout, registerComponents, editor }: PackageDef) => {
  registerUi({ [kind]: loader })
  if (layout) registerLayout({ [layout]: loader })
  registerComponents()
  if (editor) registerUiEditor({ [kind]: editor })
}
