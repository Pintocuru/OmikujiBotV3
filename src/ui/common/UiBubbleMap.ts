// src/ui/common/UiBubbleMap.ts
import type { CharacterColorType } from '@/types/OmikujiData'

type UiMapOptions = {
  color: CharacterColorType
  brightness?: string
  customClasses?: string
  customArrowClasses?: string
}

export function createUiMap({ color, brightness, customClasses, customArrowClasses }: UiMapOptions) {
  return {
    bubble: {
      class: [customClasses, brightness],
      style: { backgroundColor: color.background, '--bubble-bg': color.background },
    },
    name: { class: '', style: { color: color.name } },
    text: { class: brightness, style: { color: color.text } },
    arrow: {
      class: [customArrowClasses, brightness],
      style: { borderTopColor: 'var(--bubble-bg)' },
    },
  }
}
