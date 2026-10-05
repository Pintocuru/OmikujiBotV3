// src/editor/stores/composables/useSettingsOperations.ts
import { Ref } from 'vue'
import { JsonMergeType, OmikujiDataType, SettingsType, UiType } from '@/types/OmikujiData'

/**
 * カテゴリに属さないプロパティの操作機能を提供するコンポーザブル
 */
export function useSettingsOperations(data: Ref<OmikujiDataType>, hasChanged: Ref<boolean>) {
  // jsonMerge を更新する関数
  const updateJsonMerge = (newMerge: JsonMergeType) => {
    data.value.jsonMerge = newMerge
    hasChanged.value = true
  }

  // ui を更新
  const updateUi = (updates: Partial<UiType>) => {
    data.value.ui = {
      ...data.value.ui,
      ...updates,
    }
    hasChanged.value = true
  }

  // アイテム設定を更新
  const updateItemSettings = <T extends keyof UiType['settings']>(key: T, updates: Partial<UiType['settings'][T]>) => {
    data.value.ui.settings[key] = {
      ...data.value.ui.settings[key],
      ...updates,
    } as UiType['settings'][T]
    hasChanged.value = true
  }

  // アイテム設定を削除
  const removeItemSetting = (key: keyof UiType['settings']) => {
    data.value.ui.settings[key] = undefined
    hasChanged.value = true
  }

  // settings を更新
  const updateSettings = (updates: Partial<SettingsType>) => {
    data.value.settings = { ...data.value.settings, ...updates }
    hasChanged.value = true
  }

  return {
    updateJsonMerge,
    updateItemSettings,
    removeItemSetting,
    updateUi,
    updateSettings,
  }
}
