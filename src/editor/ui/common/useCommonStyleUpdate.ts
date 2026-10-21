// src/editor/ui/common/useCommonStyleUpdate.ts
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import { UiType } from '@/types/OmikujiData'

/**
 * ComponentsCommonStyleの更新用composable
 */
export function useCommonStyleUpdate() {
  const omikujiStore = useOmikujiStore()

  /**
   * commonStyleのフィールドを更新
   */
  const updateCommonStyleField = <K extends keyof UiType>(field: K, value: UiType[K]) => {
    omikujiStore.updateUi({
      ...omikujiStore.data.ui,
      [field]: value,
    })
  }

  return {
    updateCommonStyleField,
  }
}
