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

  /**
   * この呼び出しに一致するオーバーロードはありません。
  2 中 1 のオーバーロード, '(getter: ComputedGetter<FlowTarget[]>, debugOptions?: DebuggerOptions | undefined): ComputedRef<FlowTarget[]>' により、次のエラーが発生しました。
    型 '() => FlowTarget[] | { category: "actions"; item: { id: string; key: string; name: string; description: string; createdAt: string; updatedAt: string; order: number; isEnabled: boolean; tagColor: $InferEnumOutput<...>; tags: string[]; postFlows: ({ ...; } | ... 5 more ... | { ...; })[]; } | undefined; }[] | { ...; }[]' の引数を型 'ComputedGetter<FlowTarget[]>' のパラメーターに割り当てることはできません。
      型 'FlowTarget[] | { category: "actions"; item: { id: string; key: string; name: string; description: string; createdAt: string; updatedAt: string; order: number; isEnabled: boolean; tagColor: $InferEnumOutput<...>; tags: string[]; postFlows: ({ ...; } | ... 5 more ... | { ...; })[]; } | undefined; }[] | { ...; }[]' を型 'FlowTarget[]' に割り当てることはできません。
        型 '{ category: "actions"; item: { id: string; key: string; name: string; description: string; createdAt: string; updatedAt: string; order: number; isEnabled: boolean; tagColor: $InferEnumOutput<{ error: "error"; primary: "primary"; ... 5 more ...; warning: "warning"; }>; tags: string[]; postFlows: ({ ...; } | ... 5 mor...' を型 'FlowTarget[]' に割り当てることはできません。
          型 '{ category: "actions"; item: { id: string; key: string; name: string; description: string; createdAt: string; updatedAt: string; order: number; isEnabled: boolean; tagColor: $InferEnumOutput<{ error: "error"; primary: "primary"; ... 5 more ...; warning: "warning"; }>; tags: string[]; postFlows: ({ ...; } | ... 5 mor...' を型 'FlowTarget' に割り当てることはできません。
            型 '{ category: "actions"; item: { id: string; key: string; name: string; description: string; createdAt: string; updatedAt: string; order: number; isEnabled: boolean; tagColor: import("c:/_root/_nodejs/OmikujiBotV3/node_modules/zod/v4/core/schemas").$InferEnumOutput<{ error: "error"; primary: "primary"; ... 5 more ...;...' は型 '{ category: "actions"; item: { id: string; key: string; name: string; description: string; createdAt: string; updatedAt: string; order: number; isEnabled: boolean; tagColor: import("c:/_root/_nodejs/OmikujiBotV3/node_modules/zod/v4/core/schemas").$InferEnumOutput<{ error: "error"; primary: "primary"; ... 5 more ...;...' に割り当てられません。同じ名前で 2 つの異なる型が存在しますが、これは関連していません。
              プロパティ 'item' の型に互換性がありません。
                型 '{ id: string; key: string; name: string; description: string; createdAt: string; updatedAt: string; order: number; isEnabled: boolean; tagColor: import("c:/_root/_nodejs/OmikujiBotV3/node_modules/zod/v4/core/schemas").$InferEnumOutput<{ error: "error"; primary: "primary"; secondary: "secondary"; ... 4 more ...; warn...' は型 '{ id: string; key: string; name: string; description: string; createdAt: string; updatedAt: string; order: number; isEnabled: boolean; tagColor: import("c:/_root/_nodejs/OmikujiBotV3/node_modules/zod/v4/core/schemas").$InferEnumOutput<{ error: "error"; primary: "primary"; secondary: "secondary"; ... 4 more ...; warn...' に割り当てられません。同じ名前で 2 つの異なる型が存在しますが、これは関連していません。
                  型 'undefined' を型 '{ id: string; key: string; name: string; description: string; createdAt: string; updatedAt: string; order: number; isEnabled: boolean; tagColor: $InferEnumOutput<{ error: "error"; primary: "primary"; secondary: "secondary"; ... 4 more ...; warning: "warning"; }>; tags: string[]; postFlows: ({ ...; } | ... 5 more ......' に割り当てることはできません。
  2 中 2 のオーバーロード, '(options: WritableComputedOptions<FlowTarget[], FlowTarget[]>, debugOptions?: DebuggerOptions | undefined): WritableComputedRef<...>' により、次のエラーが発生しました。
    型 '() => FlowTarget[] | { category: "actions"; item: { id: string; key: string; name: string; description: string; createdAt: string; updatedAt: string; order: number; isEnabled: boolean; tagColor: $InferEnumOutput<...>; tags: string[]; postFlows: ({ ...; } | ... 5 more ... | { ...; })[]; } | undefined; }[] | { ...; }[]' の引数を型 'WritableComputedOptions<FlowTarget[], FlowTarget[]>' のパラメーターに割り当てることはできません。ts(2769)
function(): FlowTarget[] | {
    category: "actions";
    item: {
        id: string;
        key: string;
        name: string;
        description: string;
        createdAt: string;
        updatedAt: string;
        order: number;
        isEnabled: boolean;
        tagColor: $InferEnumOutput<...>;
        tags: string[];
        postFlows: ({
            ...;
        } | ... 5 more ... | {
            ...;
        })[];
    } | undefined;
}[] | {
    ...;
}[]
   */
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
