// src/editor/maps/category/CategorySectionMap.ts
import { DataCategoryType } from '@/types/OmikujiData'
import { SidebarSectionItem } from '@/editor/types/apps'

/**
 * Events / Assets カテゴリのセクション項目
 */
export const categorySectionMap: Record<DataCategoryType, SidebarSectionItem[]> = {
  // event
  comments: [
    { section: 'baseSettings', icon: 'SlidersHorizontal', component: 'baseSettings' },
    { section: 'threshold', icon: 'Filter', component: 'threshold' },
    { section: 'omikujiSet', icon: 'ListChecks', component: 'omikujiSet' },
  ],
  timers: [
    { section: 'baseSettings', icon: 'SlidersHorizontal', component: 'baseSettings' },
    { section: 'timerInterval', icon: 'Clock', component: 'timerInterval' },
    { section: 'omikujiSet', icon: 'ListChecks', component: 'omikujiSet' },
  ],
  services: [
    { section: 'baseSettings', icon: 'SlidersHorizontal', component: 'baseSettings' },
    { section: 'trigger', icon: 'Filter', component: 'trigger' },
    { section: 'omikujiSet', icon: 'ListChecks', component: 'omikujiSet' },
  ],
  reactions: [
    { section: 'baseSettings', icon: 'SlidersHorizontal', component: 'baseSettings' },
    { section: 'trigger', icon: 'Filter', component: 'trigger' },
    { section: 'omikujiSet', icon: 'ListChecks', component: 'omikujiSet' },
  ],
  pads: [
    { section: 'baseSettings', icon: 'SlidersHorizontal', component: 'baseSettings' },
    { section: 'trigger', icon: 'Filter', component: 'padTrigger' },
    { section: 'omikujiSet', icon: 'ListChecks', component: 'omikujiSet' },
  ],

  // assets
  mikuji: [
    { section: 'baseSettings', icon: 'SlidersHorizontal', component: 'baseSettings' },
    { section: 'omikujiSet', icon: 'ListChecks', component: 'actionSet' },
  ],

  actions: [
    { section: 'baseSettings', icon: 'SlidersHorizontal', component: 'baseSettings' },
    { section: 'omikujiSet', icon: 'ListChecks', component: 'actionSet' },
  ],
  placeholders: [
    { section: 'baseSettings', icon: 'SlidersHorizontal', component: 'baseSettings' },
    { section: 'placeholder', icon: 'Brackets', component: 'placeholder' },
  ],
  characters: [
    { section: 'baseSettings', icon: 'SlidersHorizontal', component: 'baseSettings' },
    { section: 'colorSettings', icon: 'Palette', component: 'colorSettings' },
    { section: 'commentVoice', icon: 'MessageSquare', component: 'commentVoice' },
    { section: 'imageSettings', icon: 'Image', component: 'imageSettings' },
  ],
}

/**
 * appInfo のセクション項目
 * （AppInfoEditor.vue の SectionCard#id から "section-" を除いたもの）
 */
export const appInfoSections: SidebarSectionItem[] = [
  { section: 'appSettings', icon: 'Settings' },
  { section: 'appFeatures', icon: 'Sparkles' },
  { section: 'packageBasic', icon: 'Info' },
  { section: 'packageDistribution', icon: 'Package' },
  { section: 'packageSystem', icon: 'Cpu' },
]
