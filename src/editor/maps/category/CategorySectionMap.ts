// src/editor/maps/category/CategorySectionMap.ts
import { DataCategoryType } from '@/types/OmikujiData'
import { ContentTabDef } from '@/editor/types/apps'

/**
 * Events / Assets カテゴリの、ContentArea に出すタブ(左から順)
 * section は各エディターの SectionCard の sectionKey と一致させる
 */
export const categorySectionMap: Record<DataCategoryType, ContentTabDef[]> = {
  // event
  comments: [
    { section: 'baseSettings', icon: 'SlidersHorizontal' },
    { section: 'threshold', icon: 'Filter' },
    { section: 'omikujiSet', icon: 'ListChecks' },
    { section: 'scenario', icon: 'Box' },
  ],
  timers: [
    { section: 'baseSettings', icon: 'SlidersHorizontal' },
    { section: 'timerInterval', icon: 'Clock' },
    { section: 'omikujiSet', icon: 'ListChecks' },
    { section: 'scenario', icon: 'Box' },
  ],
  services: [
    { section: 'baseSettings', icon: 'SlidersHorizontal' },
    { section: 'trigger', icon: 'Filter' },
    { section: 'omikujiSet', icon: 'ListChecks' },
    { section: 'scenario', icon: 'Box' },
  ],
  reactions: [
    { section: 'baseSettings', icon: 'SlidersHorizontal' },
    { section: 'trigger', icon: 'Filter' },
    { section: 'omikujiSet', icon: 'ListChecks' },
    { section: 'scenario', icon: 'Box' },
  ],
  pads: [
    { section: 'baseSettings', icon: 'SlidersHorizontal' },
    { section: 'trigger', icon: 'Filter' },
    { section: 'omikujiSet', icon: 'ListChecks' },
    { section: 'scenario', icon: 'Box' },
  ],

  // assets
  mikuji: [
    { section: 'baseSettings', icon: 'SlidersHorizontal' },
    { section: 'omikujiSet', icon: 'ListChecks' },
    { section: 'scenario', icon: 'Box' },
  ],

  scenarios: [
    { section: 'baseSettings', icon: 'SlidersHorizontal' },
    { section: 'scenario', icon: 'Box' },
  ],
  placeholders: [
    { section: 'baseSettings', icon: 'SlidersHorizontal' },
    { section: 'placeholder', icon: 'Brackets' },
  ],
  characters: [
    { section: 'baseSettings', icon: 'SlidersHorizontal' },
    { section: 'colorSettings', icon: 'Palette' },
    { section: 'commentVoice', icon: 'MessageSquare' },
    { section: 'imageSettings', icon: 'Image' },
  ],
}

/**
 * appInfo のタブ
 * （AppInfoEditor.vue の SectionCard の sectionKey と一致させる）
 */
export const appInfoSections: ContentTabDef[] = [
  { section: 'appSettings', icon: 'Settings' },
  { section: 'appFeatures', icon: 'Sparkles' },
  { section: 'packageBasic', icon: 'Info' },
  { section: 'packageDistribution', icon: 'Package' },
  { section: 'packageSystem', icon: 'Cpu' },
]
