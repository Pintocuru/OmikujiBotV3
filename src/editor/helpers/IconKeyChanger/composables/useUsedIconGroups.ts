// src/editor/helpers/IconKeyChanger/composables/useUsedIconGroups.ts
import { computed, type Ref } from 'vue'
import { parseCompositeKey, toCompositeKey } from '../compositeKey'

export type UsedIcon = { iconKey: string; count: number; invalid: boolean }
export type UsedIconGroup = { characterKey: string; icons: UsedIcon[] }

/**
 * 使用中のアイコンをキャラクターごとにまとめる(不正なものを先頭に)
 */
export function useUsedIconGroups(
  iconKeyUsageCount: Ref<Record<string, number>>,
  invalidIconKeyPairs: Ref<{ characterKey: string; iconKey: string }[]>
) {
  const usedIconGroups = computed<UsedIconGroup[]>(() => {
    const invalidSet = new Set(invalidIconKeyPairs.value.map((p) => toCompositeKey(p.characterKey, p.iconKey)))
    const groups = new Map<string, UsedIcon[]>()

    Object.entries(iconKeyUsageCount.value).forEach(([compositeKey, count]) => {
      const { characterKey, iconKey } = parseCompositeKey(compositeKey)
      const list = groups.get(characterKey) ?? []
      list.push({ iconKey, count, invalid: invalidSet.has(compositeKey) })
      groups.set(characterKey, list)
    })

    return Array.from(groups, ([characterKey, icons]) => ({
      characterKey,
      icons: [...icons.filter((v) => v.invalid), ...icons.filter((v) => !v.invalid)],
    })).sort((a, b) => Number(b.icons.some((v) => v.invalid)) - Number(a.icons.some((v) => v.invalid)))
  })

  // 使用中のアイコンの種類数(ボタンのバッジ用)
  const usedIconCount = computed(() => usedIconGroups.value.reduce((n, group) => n + group.icons.length, 0))

  return { usedIconGroups, usedIconCount }
}
