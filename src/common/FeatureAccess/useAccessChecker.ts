// src/common/FeatureAccess/useAccessChecker.ts
import { computed, type Ref } from 'vue'
import { AccessLevelType, OmikujiDataType, UiKind, UiSlotType } from '@/types'
import { useSettingModeFromHash } from './SettingMode'

/**
 * アクセスレベルをチェックする関数
 */
/** @deprecated isDev 以外のライセンス状態は削除されます */
const AccessLevelPriority: Record<AccessLevelType, number> = {
  none: 0,
  basic: 1,
  adv: 2,
  pro: 3,
  godMode: 4,
}

/** @deprecated isDev 以外のライセンス状態は削除されます */
export function hasAccessPure(level: AccessLevelType, accessMode: AccessLevelType): boolean {
  // none なら必ず非表示
  if (level === 'none') return false
  return AccessLevelPriority[accessMode] >= AccessLevelPriority[level]
}

/** @deprecated isDev 以外のライセンス状態は削除されます */
export function useAccessCheckerCore(accessMode: Ref<AccessLevelType>) {
  const hasAccess = (level: AccessLevelType) => hasAccessPure(level, accessMode.value)
  return { hasAccess }
}

/**
 * FeatureUsage に基づいて機能の表示・実行可否を判定
 */
/** @deprecated isDev 以外のライセンス状態は削除されます */
export function useVisibilityAccessCore(data: Ref<OmikujiDataType>) {
  // setting mode
  const { accessMode } = useSettingModeFromHash(computed(() => data.value.settings.licenseKeyHash))
  const { hasAccess } = useAccessCheckerCore(accessMode)

  // featureUsage
  /** @deprecated isDev 以外のライセンス状態は削除されます */
  const usage = computed(() => data.value.featureUsage.usage)
  /** @deprecated isDev 以外のライセンス状態は削除されます */
  const developer = computed(() => data.value.featureUsage.developer)

  const canShowUsage = (key: keyof typeof usage.value): boolean => hasAccess(usage.value[key])
  const canShowDeveloper = (key: keyof typeof developer.value): boolean => hasAccess(developer.value[key])

  // Events
  /** @deprecated isDev 以外のライセンス状態は削除されます */
  const isComment = computed(() => hasAccess(usage.value.comments))
  /** @deprecated isDev 以外のライセンス状態は削除されます */
  const isTimer = computed(() => hasAccess(usage.value.timers))
  /** @deprecated isDev 以外のライセンス状態は削除されます */
  const isRules = computed(() => isComment.value || isTimer.value)

  // assets
  /** @deprecated isDev 以外のライセンス状態は削除されます */
  const isActionSet = computed(() => hasAccess(usage.value.actionSets))
  /** @deprecated isDev 以外のライセンス状態は削除されます */
  const isPlaceholder = computed(() => hasAccess(usage.value.placeholders))
  /** @deprecated isDev 以外のライセンス状態は削除されます */
  const isCharacter = computed(() => hasAccess(usage.value.characters) && Object.keys(data.value.characters).length > 0)

  // itemSlot
  /** @deprecated isDev 以外のライセンス状態は削除されます */
  const hasSlot = (slot: UiSlotType) => data.value.components.conditions.some((c) => c.slot === slot)
  function hasCondition(slot: UiSlotType, kind: UiKind): boolean {
    return data.value.components.conditions.some((c) => c.slot === slot && c.kind === kind)
  }
  /** @deprecated isDev 以外のライセンス状態は削除されます */
  const isPrimarySlot = computed(() => hasSlot('primary'))
  /** @deprecated isDev 以外のライセンス状態は削除されます */
  const isSecondarySlot = computed(() => hasSlot('secondary'))
  /** @deprecated isDev 以外のライセンス状態は削除されます */
  const isExtraSlot = computed(() => hasSlot('extra'))
  /** @deprecated isDev 以外のライセンス状態は削除されます */
  const isAllSlot = computed(() => isPrimarySlot.value || isSecondarySlot.value || isExtraSlot.value)

  return {
    canShowUsage,
    canShowDeveloper,
    isComment,
    isTimer,
    isRules,
    isActionSet,
    isPlaceholder,
    isCharacter,

    // 別に移すかも
    hasCondition,
    isPrimarySlot,
    isSecondarySlot,
    isExtraSlot,
    isAllSlot,
  }
}
