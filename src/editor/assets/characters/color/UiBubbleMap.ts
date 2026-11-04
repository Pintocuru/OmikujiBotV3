// src/ui/common/UiBubbleMap.ts
import type { CharacterColorType } from '@/types/OmikujiData'

type UiMapOptions = {
  color: CharacterColorType
  brightness?: string
  customClasses?: string
  customArrowClasses?: string
  arrowSide?: 'top' | 'left' | 'right' // 色を付ける border の辺(矢印の向きと逆側)
}

export function createUiMap({ color, brightness, customClasses, customArrowClasses, arrowSide = 'top' }: UiMapOptions) {
  return {
    bubble: {
      class: [customClasses, brightness],
      style: { backgroundColor: color.background, '--bubble-bg': color.background },
    },
    name: { class: '', style: { color: color.name } },
    text: { class: brightness, style: { color: color.text } },
    arrow: {
      class: [customArrowClasses, brightness],
      style: {
        borderTopColor: arrowSide === 'top' ? 'var(--bubble-bg)' : undefined,
        borderLeftColor: arrowSide === 'left' ? 'var(--bubble-bg)' : undefined,
        borderRightColor: arrowSide === 'right' ? 'var(--bubble-bg)' : undefined,
      },
    },
  }
}
