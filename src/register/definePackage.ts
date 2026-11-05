// src/register/definePackage.ts
import { type Component } from 'vue'
import type { UiKind, UiLayoutType } from '@/types/OmikujiData'
import { registerUi, registerLayout, type UiLoader } from '@/ui/uiRegistry'
import { registerUiEditor } from '@/editor/ui/uiEditorRegistry'

type PackageDef = {
  /** UI 種別 */
  kind: UiKind
  /** UI 本体の loader */
  loader: UiLoader
  /** ui.layout に使うキー */
  layout: NonNullable<UiLayoutType>
  /** 表示コンポーネント(standard セットなど)の登録関数。必須 */
  registerComponents: () => void
  /** エディター */
  editor?: () => Promise<{ default: Component }>
}

export const definePackage = ({ kind, loader, layout, registerComponents, editor }: PackageDef) => {
  registerUi({ [kind]: loader })
  if (layout) registerLayout({ [layout]: loader })
  registerComponents()
  if (editor) registerUiEditor({ [kind]: editor })
}
