// src/ui/FlashBanner/composables/useBannerColorVars.ts
import { computed, type CSSProperties } from 'vue'
import type { CharacterColorType } from '@/types/OmikujiData'

/**
 * CharacterColor の 4 色を CSS 変数にする(--fb-name / --fb-text / --fb-bg / --fb-accent)
 * 各コンポーネントのルート要素の style に付ける
 */
export function useBannerColorVars(getColor: () => CharacterColorType) {
  return computed<CSSProperties>(() => {
    const color = getColor()
    return {
      '--fb-name': color.name,
      '--fb-text': color.text,
      '--fb-bg': color.background,
      '--fb-accent': color.accent,
    }
  })
}
