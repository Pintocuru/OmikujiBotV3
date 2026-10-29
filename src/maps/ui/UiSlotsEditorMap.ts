// dddd
import { defineAsyncComponent, type Component } from 'vue'
import { UiKind } from '@/types/OmikujiData'

// UI 固有の slots 編集画面(無い UI は汎用の text 入力)
export const uiSlotsEditorMap: Partial<Record<UiKind, Component>> = {
  characterStage: defineAsyncComponent(() => import('@/ui/CharacterStage/editor/CharacterStageSlotsEditor.vue')),
}
