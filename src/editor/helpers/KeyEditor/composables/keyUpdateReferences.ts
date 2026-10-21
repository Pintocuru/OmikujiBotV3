// src/editor/helpers/KeyEditor/composables/keyUpdateReferences.ts
import type { PostFlowType, WeightValuesArrayType } from '@/types/OmikujiData/'
import { eventCategory, hasPostFlowMessage } from '@/types/OmikujiData/'
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import { useGetEventData } from '@/editor/stores/useGetEventData'
import { useGetAssetData } from '@/editor/stores/useGetAssetData'

type PostFlowUpdater = (flow: PostFlowType) => PostFlowType
type WeightValueItem = WeightValuesArrayType[number] // string | { weight, content }

const contentOf = (item: WeightValueItem): string => (typeof item === 'string' ? item : item.content)

// 元の形（string / object）を保ったまま content を差し替える
const withContent = (item: WeightValueItem, content: string): WeightValueItem =>
  typeof item === 'string' ? content : { ...item, content }

// map して、1つでも参照が変わっていれば新配列、変化なしなら null を返す
const mapIfChanged = <T>(items: readonly T[], fn: (item: T) => T): T[] | null => {
  const mapped = items.map(fn)
  return mapped.some((item, i) => item !== items[i]) ? mapped : null
}

const replaceAll = (text: string, from: string, to: string): string => text.split(from).join(to)

/**
 * mikuji（みくじ箱）内の postFlow アイテムの postFlows 更新
 */
function updateMikujiPostFlows(updateFn: PostFlowUpdater): void {
  const { updateAsset } = useOmikujiStore()
  const { getAssets } = useGetAssetData()

  Object.values(getAssets('mikuji')).forEach((box) => {
    const omikuji = mapIfChanged(box.omikuji, (item) => {
      if (item.kind !== 'postFlow') return item
      const postFlows = mapIfChanged(item.postFlows, updateFn)
      return postFlows ? { ...item, postFlows } : item
    })
    if (omikuji) updateAsset('mikuji', box.key, { omikuji })
  })
}

/**
 * actions（ActionSet）の postFlows 更新
 */
function updateActionAssetPostFlows(updateFn: PostFlowUpdater): void {
  const { updateAsset } = useOmikujiStore()
  const { getAssets } = useGetAssetData()

  Object.values(getAssets('actions')).forEach((actionSet) => {
    const postFlows = mapIfChanged(actionSet.postFlows, updateFn)
    if (postFlows) updateAsset('actions', actionSet.key, { postFlows })
  })
}

// postFlows を持つ全カテゴリへ適用
function updateAllPostFlows(updateFn: PostFlowUpdater): void {
  updateMikujiPostFlows(updateFn)
  updateActionAssetPostFlows(updateFn)
}

/**
 * mikuji 参照の更新（events の omikujiKey）
 */
export function updateMikujiReferences(oldKey: string, newKey: string): void {
  const { updateEvent } = useOmikujiStore()
  const { getEvents } = useGetEventData()

  eventCategory.forEach((category) => {
    getEvents(category).forEach((event) => {
      if (event.omikujiKey === oldKey) updateEvent(category, event.id, { omikujiKey: newKey })
    })
  })
}

/**
 * キャラクター参照の更新（message / gameScript が characterKey を持つ）
 */
export function updateCharacterReferences(oldKey: string, newKey: string): void {
  updateAllPostFlows((flow) =>
    (flow.kind === 'message' || flow.kind === 'gameScript') && flow.characterKey === oldKey
      ? { ...flow, characterKey: newKey }
      : flow
  )
}

/**
 * プレースホルダー参照の更新
 */
export function updatePlaceholderReferences(oldKey: string, newKey: string): void {
  const { updateAsset } = useOmikujiStore()
  const { getAssets } = useGetAssetData()
  const oldPlaceholder = `<<${oldKey}>>`
  const newPlaceholder = `<<${newKey}>>`

  // プレースホルダー自身の内容
  Object.values(getAssets('placeholders')).forEach((placeholder) => {
    const values = mapIfChanged(placeholder.values, (item) =>
      contentOf(item).includes(oldPlaceholder)
        ? withContent(item, replaceAll(contentOf(item), oldPlaceholder, newPlaceholder))
        : item
    )
    if (values) updateAsset('placeholders', placeholder.key, { values })
  })

  // postFlows 内の参照（message を持つのは message / variable / bot）
  updateAllPostFlows((flow) => {
    if (!hasPostFlowMessage(flow) || !flow.message.includes(oldPlaceholder)) return flow
    return { ...flow, message: replaceAll(flow.message, oldPlaceholder, newPlaceholder) }
  })
}

/**
 * actionSet（flowCall）参照の更新
 */
export function updateActionSetReferences(oldKey: string, newKey: string): void {
  updateAllPostFlows((flow) => {
    if (flow.kind !== 'flowCall') return flow

    const callKeys = mapIfChanged(flow.callKeys, (item) =>
      contentOf(item) === oldKey ? withContent(item, newKey) : item
    )
    return callKeys ? { ...flow, callKeys } : flow
  })
}
