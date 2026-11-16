// src/ui/FlashBanner/components/standard/register.ts
import type { FlashBannerComponentOf } from '@/types/ui'
import { registerFlashBannerComponents, type FlashBannerComponentDefinition } from '../../FlashBannerRegistry'

/**
 * FlashBanner 標準セット
 * isScrollReturn: 往復スクロール(長文のときだけ動く)のタイプ。ループ型(scroll / ticker)は使わない
 */
const standardComponents = {
  standard: {
    labelKey: 'uiComponents.flashBanner.standard.label',
    isScrollReturn: true,
    loader: () => import('./Standard.vue'),
  },
  glass: {
    labelKey: 'uiComponents.flashBanner.glass.label',
    isScrollReturn: true,
    loader: () => import('./Glass.vue'),
  },
  clear: {
    labelKey: 'uiComponents.flashBanner.clear.label',
    isScrollReturn: true,
    loader: () => import('./Clear.vue'),
  },
  arcade: {
    labelKey: 'uiComponents.flashBanner.arcade.label',
    isScrollReturn: true,
    loader: () => import('./Arcade.vue'),
  },
  scroll: {
    labelKey: 'uiComponents.flashBanner.scroll.label',
    isScrollReturn: false,
    loader: () => import('./Scroll.vue'),
  },
  ticker: {
    labelKey: 'uiComponents.flashBanner.ticker.label',
    isScrollReturn: false,
    loader: () => import('./Ticker.vue'),
  },
} satisfies Record<FlashBannerComponentOf<'standard'>, FlashBannerComponentDefinition>

export const registerStandardFlashBannerComponents = () =>
  registerFlashBannerComponents({ standard: standardComponents })
