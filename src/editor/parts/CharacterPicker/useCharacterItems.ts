// src/editor/parts/CharacterPicker/useCharacterItems.ts
import { computed } from 'vue'
import { useCharacterLookup } from '@/editor/helpers/CharacterChanger/composables/useCharacterLookup'
import type { CharacterItem, IconItem } from './types'

const hasSrc = (src?: string[]) => (src ?? []).some((p) => p && p.trim() !== '')

export const useCharacterItems = () => {
  const { characterMap } = useCharacterLookup()

  const items = computed<CharacterItem[]>(() =>
    Object.entries(characterMap.value).map(([key, c]) => {
      const icons: IconItem[] = Object.entries(c.image ?? {})
        .filter(([, v]) => hasSrc(v.src))
        .map(([k, v]) => ({ key: k, label: v.label, layers: v.src }))
      // default を優先。無ければ最初に画像のある表情
      const def = icons.find((i) => i.key === 'default') ?? icons[0]
      return {
        key,
        name: c.name,
        icons,
        defaultKey: def?.key ?? 'default',
        defaultLayers: def?.layers ?? [],
      }
    })
  )

  return { items }
}
