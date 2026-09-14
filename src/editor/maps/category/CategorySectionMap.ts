// src/editor/maps/category/CategorySectionMap.ts
import { CategoryType } from '@/types'
import { LucideIconName } from '@/common/LucideIcon/useLucideIcon'

/**
 * サイドバーのサブアイテム下に表示するセクション項目
 * クリックで activeSection.value を変更する
 */
export type SidebarSectionItem = {
  section: string
  icon: LucideIconName
  component?: string
}

// ─────────────────────────────────────────────────────────
// 静的マップ（Record カテゴリ / appInfo）
// ─────────────────────────────────────────────────────────

/**
 * Record カテゴリ・appInfo 用の固定セクション項目
 * UiEditor のような動的なものはここに含めない
 * staticSectionMap > categorySectionMap
 */
export const categorySectionMap: Record<CategoryType, SidebarSectionItem[]> = {
  // event
  comments: [
    { section: 'baseSettings', icon: 'SlidersHorizontal', component: 'baseSettings' },
    { section: 'threshold', icon: 'Filter', component: 'threshold' },
    { section: 'limits', icon: 'Timer', component: 'limits' },
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

  // assets
  box: [
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

  // ── appInfo（AppInfoEditor.vue の SectionCard#id から "section-" を除いたもの） ──
  appInfo: [
    { section: 'appSettings', icon: 'Settings' },
    { section: 'appFeatures', icon: 'Sparkles' },
    { section: 'packageBasic', icon: 'Info' },
    { section: 'packageDistribution', icon: 'Package' },
    { section: 'packageSystem', icon: 'Cpu' },
  ],

  // jsonMerge: サブアイテム単位でセクションなし（そのまま）
  jsonMerge: [],
  components: [],
  dataPacks: [],
}
