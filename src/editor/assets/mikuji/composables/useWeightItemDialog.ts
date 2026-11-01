// src/editor/assets/mikuji/composables/useWeightItemDialog.ts
import { ref } from 'vue'

/** WeightItem から開くダイアログの種類(同時に開くのは 1 つだけ) */
export type WeightDialogName = 'base' | 'condition' | 'run'

/**
 * 開いているダイアログの状態管理
 * @param onOpen ダイアログを開く直前に呼ぶ処理(編集中の行を選択状態にする等)
 */
export const useWeightItemDialog = (onOpen: () => void) => {
  const opened = ref<WeightDialogName | null>(null)

  const open = (name: WeightDialogName) => {
    onOpen()
    opened.value = name
  }
  const close = () => {
    opened.value = null
  }

  return { opened, open, close }
}
