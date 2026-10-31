// src/editor/maps/category/CategoryContentMap.ts
import type { Component } from 'vue'
import type { CategoryType } from '@/types/OmikujiData'
import type { ContentTabDef } from '@/editor/types/apps'

import JsonMergeEditor from '@/editor/apps/JsonMerge/JsonMergeEditor.vue'
import DataPacks from '@/editor/apps/dataPacks/DataPacks.vue'
import AppInfoEditor from '@/editor/apps/appInfo/AppInfoEditor.vue'
import UiEditor from '@/editor/ui/UiEditor.vue'

import CommentEditor from '@/editor/events/comment/CommentEditor.vue'
import TimerEditor from '@/editor/events/timer/TimerEditor.vue'
import ServiceEditor from '@/editor/events/service/ServiceEditor.vue'
import ReactionEditor from '@/editor/events/reaction/ReactionEditor.vue'
import PadEditor from '@/editor/events/pad/PadEditor.vue'

import MikujiEditor from '@/editor/assets/mikuji/MikujiEditor.vue'
import ScenariosEditor from '@/editor/assets/scenarios/ScenariosEditor.vue'
import PlaceholderEditor from '@/editor/assets/placeholders/PlaceholderEditor.vue'
import CharacterEditor from '@/editor/assets/characters/CharacterEditor.vue'

/**
 * カテゴリごとの、ContentArea に出す内容の定義
 * - editor: 本体のエディター
 * - sections: 複数セクションを持つカテゴリだけ、タブにするセクション(左から順)。
 *   section は各エディターの SectionCard の sectionKey と一致させる。
 *   ui のタブは登録済みの UI から動的に作るので、ここには持たない。
 *
 * Events / Assets は 1 画面 1 セクションなのでタブを持たない
 * (基本設定は ContentHeader のダイアログ、接続は ContentHeader の接続表示で扱う)
 */
export type CategoryContentDef = {
  editor: Component
  sections?: ContentTabDef[]
}

export const categoryContentMap: Record<CategoryType, CategoryContentDef> = {
  jsonMerge: { editor: JsonMergeEditor },

  // events
  comments: { editor: CommentEditor },
  timers: { editor: TimerEditor },
  services: { editor: ServiceEditor },
  reactions: { editor: ReactionEditor },
  pads: { editor: PadEditor },

  // assets
  mikuji: { editor: MikujiEditor },
  scenarios: { editor: ScenariosEditor },
  placeholders: { editor: PlaceholderEditor },
  characters: { editor: CharacterEditor },

  // settings
  ui: { editor: UiEditor },
  dataPacks: { editor: DataPacks },
  appInfo: {
    editor: AppInfoEditor,
    sections: [
      { section: 'appSettings', icon: 'Settings' },
      { section: 'appFeatures', icon: 'Sparkles' },
      { section: 'packageBasic', icon: 'Info' },
      { section: 'packageDistribution', icon: 'Package' },
      { section: 'packageSystem', icon: 'Cpu' },
    ],
  },
}
