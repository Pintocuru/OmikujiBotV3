// src/editor/helpers/CharacterChanger/useDataExtractor.ts
import { computed } from 'vue'
import { EventCategoryType, ActionSetType, MikujiBoxType } from '@/types/OmikujiData/'
import { categoryMap } from '@/maps/OmikujiData'
import { useGetAssetData } from '@/editor/stores/useGetAssetData'
import { useGetEventData } from '@/editor/stores/useGetEventData'

/**
 * 対象カテゴリ（イベント系 / みくじ箱 / アクションセット）
 */
export type TargetCategoryType = EventCategoryType | 'mikuji' | 'actions'

/**
 * 変更スコープタイプ
 */
export type ChangeScope = 'category' | 'single'

/**
 * PostFlow を持つアセット（更新先の単位）
 */
export type FlowTarget = { category: 'actions'; item: ActionSetType } | { category: 'mikuji'; item: MikujiBoxType }

/**
 * 対象のアセット（アクションセット / みくじ箱）を抽出する
 * - actions / mikuji: selectedId はアセットの key
 * - イベント系: selectedId はイベントの id。イベントが参照する omikujiKey のみくじ箱を対象にする
 */
export function useDataExtractor(category: TargetCategoryType, selectedId?: string) {
  const { getAsset, getAssets } = useGetAssetData()
  const { getEvent, getEvents } = useGetEventData()

  // 変更スコープ（全体 or 単一）
  const changeScope = computed<ChangeScope>(() => (selectedId ? 'single' : 'category'))

  // スコープに応じたラベル
  const scopeLabel = computed(() => {
    if (changeScope.value === 'single') return 'このイベント'
    return `${categoryMap[category].label}全体`
  })

  const allTargets = computed<FlowTarget[]>(() => {
    if (category === 'actions') {
      const items = selectedId ? [getAsset('actions', selectedId)] : Object.values(getAssets('actions'))
      return items.filter((item) => !!item).map((item) => ({ category: 'actions', item }))
    }

    if (category === 'mikuji') {
      const items = selectedId ? [getAsset('mikuji', selectedId)] : Object.values(getAssets('mikuji'))
      return items.filter((item) => !!item).map((item) => ({ category: 'mikuji', item }))
    }

    // イベント系：omikujiKey からみくじ箱を引く（重複は除く）
    const events = selectedId ? [getEvent(category, selectedId)] : getEvents(category)
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
