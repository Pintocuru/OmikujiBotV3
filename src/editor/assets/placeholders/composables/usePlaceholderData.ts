// src/editor/assets/placeholders/composables/usePlaceholderData.ts
// ! 使ってないかも
import { computed, Ref } from 'vue'
import { PlaceholderSchema, PlaceholderType, PostFlowType } from '@/types/OmikujiData/'
import { defaultPlaceholderMap, defaultPlaceholdersShortLabels } from '@/editor/maps/assets/DefaultPlaceholderMaps'
import { DefaultPlaceholders } from '@/generator/types/MainGenerator'
import { useGetAssetData } from '@/editor/stores/useGetAssetData'
import { daisyUIColor } from '@/types/core'

/**
 * プレースホルダーのデータ管理を担当するcomposable
 */
export function usePlaceholderData(actions: Ref<PostFlowType[]>) {
  const { getAssets } = useGetAssetData()

  // デフォルトプレースホルダーの設定
  const placeholderContentMap = new Map(Object.entries(defaultPlaceholdersShortLabels))

  // デフォルトプレースホルダーを生成
  const defaultPlaceholders = computed((): PlaceholderType[] => {
    return (Object.keys(defaultPlaceholderMap) as DefaultPlaceholders[]).map((key) => {
      const contentValue = placeholderContentMap.get(key) ?? ''

      return PlaceholderSchema.parse({
        key,
        name: defaultPlaceholderMap[key].label,
        editorColor: '#FEFEFE',
        values: [{ content: contentValue }],
      })
    })
  })

  // 使用されているプレースホルダーIDのセットを取得
  const usedPlaceholderIds = computed(() => {
    const usedIds = new Set<string>()

    // 早期リターンでパフォーマンス向上
    if (!actions.value.length) return usedIds

    // 全てのプレースホルダーパターンを一度に検索
    const allContent = actions.value
      .flatMap((action) => {
        if (action.kind === 'message') {
          return [action.message || '']
        } else if (action.kind === 'wordParty') {
          return [action.wordPartyId || '']
        }
      })
      .filter(Boolean)
      .join(' ')

    // プレースホルダーパターンのマッチングを効率化
    const placeholderRegex = /<<([^>]+)>>/g
    let match
    while ((match = placeholderRegex.exec(allContent)) !== null) {
      usedIds.add(match[1])
    }

    return usedIds
  })

  // 全プレースホルダーを取得してソート
  const allPlaceholders = computed(() => {
    const customPlaceholders = getAssets('placeholders')

    const placeholders = [...defaultPlaceholders.value, ...Object.values(customPlaceholders)]

    const colorOrder = new Map(daisyUIColor.map((color, index) => [color, index]))

    return placeholders.sort((a, b) => {
      const aUsed = usedPlaceholderIds.value.has(a.key)
      const bUsed = usedPlaceholderIds.value.has(b.key)

      if (aUsed !== bUsed) return aUsed ? -1 : 1

      const aColor = colorOrder.get(a.tagColor)!
      const bColor = colorOrder.get(b.tagColor)!

      if (aColor !== bColor) return aColor - bColor

      return a.key.localeCompare(b.key, 'ja')
    })
  })

  return {
    allPlaceholders,
    usedPlaceholderIds,
    defaultPlaceholders: computed(() => defaultPlaceholders.value.map((p) => p.key)),
  }
}
