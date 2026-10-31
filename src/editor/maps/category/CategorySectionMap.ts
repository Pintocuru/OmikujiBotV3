// src/editor/maps/category/CategorySectionMap.ts
import { DataCategoryType } from '@/types/OmikujiData'
import { ContentTabDef } from '@/editor/types/apps'

/**
 * Events / Assets カテゴリの、ContentArea に出すタブ(左から順)
 * section は各エディターの SectionCard の sectionKey と一致させる
 */
export const categorySectionMap: Record<DataCategoryType, ContentTabDef[]> = {
  // event
  comments: [{ section: 'threshold', icon: 'Filter' }],
  timers: [{ section: 'timerInterval', icon: 'Clock' }],
  services: [{ section: 'trigger', icon: 'Filter' }],
  reactions: [{ section: 'trigger', icon: 'Filter' }],
  pads: [{ section: 'trigger', icon: 'Filter' }],

  // assets
  mikuji: [{ section: 'omikujiSet', icon: 'ListChecks' }],

  scenarios: [{ section: 'scenario', icon: 'Box' }],
  placeholders: [{ section: 'placeholder', icon: 'Brackets' }],
  characters: [
    { section: 'imageSettings', icon: 'Image' },
    { section: 'colorSettings', icon: 'Palette' },
    { section: 'commentVoice', icon: 'MessageSquare' },
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
