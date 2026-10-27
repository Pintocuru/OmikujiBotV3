// src/i18n/editor/category/NavigationSidebarMessagesMap.ts
// 既存の navigationSidebarMessages 参照との互換性を維持する統合 export。
import { navigationSidebarNavigationMessages } from './NavigationSidebarNavigationMessages'
import { navigationSidebarPresetsMessages } from './NavigationSidebarPresetsMessages'
import { navigationSidebarCategoriesMessages } from './NavigationSidebarCategoriesMessages'

export const navigationSidebarMessages = {
  ja: {
    ...navigationSidebarNavigationMessages.ja,
    ...navigationSidebarPresetsMessages.ja,
    ...navigationSidebarCategoriesMessages.ja,
  },
  en: {
    ...navigationSidebarNavigationMessages.en,
    ...navigationSidebarPresetsMessages.en,
    ...navigationSidebarCategoriesMessages.en,
  },
} as const
