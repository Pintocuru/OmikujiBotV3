// src/engine/scripts/FeatureAccess/useAccessCheckerMain.ts
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/generator/stores/useAppStore'
import { useSettingModeFromHash } from '@/common/FeatureAccess/SettingMode'
import { useAccessCheckerCore, useVisibilityAccessCore } from '@/common/FeatureAccess/useAccessChecker'

/**
 * 各ライセンス状態を返す関数
 */
/** @deprecated isDev 以外のライセンス状態は削除されます */
export function useSettingMode() {
  const omikujiStore = useAppStore()
  const { data } = storeToRefs(omikujiStore)
  return useSettingModeFromHash(computed(() => data.value.settings.licenseKeyHash))
}

/**
 * アクセスレベルをチェックする関数
 */
/** @deprecated isDev 以外のライセンス状態は削除されます */
export function useAccessChecker() {
  const { accessMode } = useSettingMode()
  return useAccessCheckerCore(accessMode)
}

/**
 * FeatureUsage に基づいて機能の表示・実行可否を判定
 */
/** @deprecated isDev 以外のライセンス状態は削除されます */
export function useVisibilityAccess() {
  const omikujiStore = useAppStore()
  const { data } = storeToRefs(omikujiStore)

  return useVisibilityAccessCore(data)
}
