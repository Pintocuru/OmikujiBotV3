// src/editor/helpers/CharacterChanger/composables/useDataExtractor.ts
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { EventCategoryType, ScenarioType, MikujiBoxType } from '@/types/OmikujiData/'
import i18n from '@/editor/i18n'
import { useGetAssetData } from '@/editor/stores/useGetAssetData'
import { useGetEventData } from '@/editor/stores/useGetEventData'

/**
 * 対象カテゴリ（イベント系 / みくじ箱 / シナリオ）
 */
const t = (key: string, named?: Record<string, unknown>) => (named ? i18n.global.t(key, named) : i18n.global.t(key))

export type TargetCategoryType = EventCategoryType | 'mikuji' | 'scenarios'

/**
 * 変更スコープタイプ
 */
export type ChangeScope = 'category' | 'single'

/**
 * ???
 */
export type FlowTarget =
  { category: 'scenarios'; item: ScenarioType } | { category: 'mikuji'; item: MikujiBoxType; itemId?: string }

/**
 * 対象のアセット（シナリオ / みくじ箱）を抽出
 */
export function useDataExtractor(
  category: TargetCategoryType,
  selectedIdSource?: MaybeRefOrGetter<string | null | undefined>,
  itemIdSource?: MaybeRefOrGetter<string | null | undefined>
) {
  const { getAsset, getAssets } = useGetAssetData()
  const { getEvent, getEvents } = useGetEventData()

  const selectedId = computed(() => toValue(selectedIdSource) || undefined)
  const itemId = computed(() => toValue(itemIdSource) || undefined)

  // 変更スコープ（全体 or 単一）
  const changeScope = computed<ChangeScope>(() => (selectedId.value ? 'single' : 'category'))

  // スコープに応じたラベル
  const scopeLabel = computed(() => {
    if (changeScope.value === 'single') return t('mapText.scope.single')
    return t('mapText.scope.category', { category: t(`categories.${category}.label`) })
  })

  const allTargets = computed<FlowTarget[]>(() => {
    if (category === 'scenarios') {
      const items = selectedId.value ? [getAsset('scenarios', selectedId.value)] : Object.values(getAssets('scenarios'))
      return items.filter((item): item is ScenarioType => !!item).map((item) => ({ category: 'scenarios', item }))
    }

    if (category === 'mikuji') {
      const items = selectedId.value ? [getAsset('mikuji', selectedId.value)] : Object.values(getAssets('mikuji'))
      return items
        .filter((item): item is MikujiBoxType => !!item)
        .map((item): FlowTarget => ({ category: 'mikuji', item, itemId: itemId.value }))
    }

    // イベント系：omikujiKey からみくじ箱を引く（重複は除く）
    const events = selectedId.value ? [getEvent(category, selectedId.value)] : getEvents(category)
    const omikujiKeys = new Set(events.map((event) => event?.omikujiKey).filter((key): key is string => !!key))
    return Array.from(omikujiKeys).flatMap((key): FlowTarget[] => {
      const box = getAsset('mikuji', key)
      return box ? [{ category: 'mikuji', item: box }] : []
    })
  })

  // 対象アイテム数
  const totalItems = computed(() => allTargets.value.length)

  return {
    changeScope,
    scopeLabel,
    allTargets,
    totalItems,
  }
}
