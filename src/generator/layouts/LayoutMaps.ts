// src/generator/layouts/LayoutMaps.ts

export const SPECIAL_SET_LAYOUT_LOADER: Record<UiSpecialSetType, () => Promise<any>> = {
  OmikujiBot: () => import('./OmikujiBot/OmikujiBot.vue'),
}
