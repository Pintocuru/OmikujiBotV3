// src/editor/stores/composables/useSettingsOperations.ts
import { Ref } from 'vue'
import { JsonMergeType, OmikujiDataType, SettingsSchema, SettingsType, UiType } from '@/types/OmikujiData'

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

  // settings のセクション(generator / editor / developer)単位で更新
  const updateSettingsSection = <S extends keyof SettingsType>(section: S, updates: Partial<SettingsType[S]>) => {
    data.value.settings[section] = { ...data.value.settings[section], ...updates }
    hasChanged.value = true
  }

  // settings の1項目をデフォルト値に戻す
  const resetSettingsField = <S extends keyof SettingsType, K extends keyof SettingsType[S]>(section: S, field: K) => {
    const defaults = SettingsSchema.parse({})
    updateSettingsSection(section, { [field]: defaults[section][field] } as unknown as Partial<SettingsType[S]>)
  }

  return {
    updateJsonMerge,
    updateItemSettings,
    removeItemSetting,
    updateUi,
    updateSettingsSection,
    resetSettingsField,
  }
}
