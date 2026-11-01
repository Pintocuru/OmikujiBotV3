// src/editor/maps/category/CategoryContentMap.ts
import type { Component } from 'vue'
import type { CategoryType } from '@/types/OmikujiData'
import type { ContentTabDef, ItemContentDef } from '@/editor/types/apps'

import JsonMergeEditor from '@/editor/apps/JsonMerge/JsonMergeEditor.vue'
import DataPacks from '@/editor/apps/dataPacks/DataPacks.vue'
import AppInfoEditor from '@/editor/apps/appInfo/AppInfoEditor.vue'
import UiEditor from '@/editor/ui/UiEditor.vue'

import ItemEditor from '@/editor/content/ItemEditor.vue'

import CommentTriggerEditor from '@/editor/events/comment/CommentTriggerEditor.vue'
import TimerIntervalEditor from '@/editor/events/timer/TimerIntervalEditor.vue'
import ServiceTrigger from '@/editor/events/service/ServiceTrigger.vue'
import ReactionTriggerEditor from '@/editor/events/reaction/ReactionTriggerEditor.vue'
import PadTriggerEditor from '@/editor/events/pad/PadTriggerEditor.vue'

import MikujiSettings from '@/editor/assets/mikuji/MikujiSettings.vue'
import ScenarioStepsEditor from '@/editor/assets/ScenarioStep/ScenarioStepsEditor.vue'
import PlaceholderValuesEditor from '@/editor/assets/placeholders/PlaceholderValuesEditor.vue'
import CharacterEditor from '@/editor/assets/characters/CharacterEditor.vue'

/**
 * カテゴリごとの、ContentArea に出す内容の定義
 * - editor: 本体のエディター
 * - item: Events / Assets の 1 セクションの内容。あるカテゴリは editor が ItemEditor で、これを props(content)として受け取る
 * - sections: 複数セクションを持つカテゴリだけ、タブにするセクション(左から順)。
 *   section は各エディターの SectionCard の sectionKey と一致させる。
 *   ui のタブは登録済みの UI から動的に作るので、ここには持たない。
 *
 * Events / Assets は 1 画面 1 セクションなのでタブを持たない
 * (基本設定は ContentSummary のダイアログ、接続は ContentConnections の接続表示で扱う)
 */
export type CategoryContentDef = {
  editor: Component
  item?: ItemContentDef
  sections?: ContentTabDef[]
}

// 「発動条件」のセクション(timers 以外のイベントで共通)
const triggerSection: ItemContentDef['section'] = {
  icon: 'Filter',
  labelKey: 'categorySections.trigger.label',
  descriptionKey: 'categorySections.trigger.description',
}

// 「ステップ設定」のセクション(mikuji / scenarios で共通)
const stepsSection: ItemContentDef['section'] = {
  icon: 'ListChecks',
  labelKey: 'categorySections.omikujiSet.label',
  descriptionKey: 'categorySections.omikujiSet.description',
}

export const categoryContentMap: Record<CategoryType, CategoryContentDef> = {
  jsonMerge: { editor: JsonMergeEditor },

  // events
  comments: {
    editor: ItemEditor,
    item: { component: CommentTriggerEditor, section: triggerSection, modelField: 'trigger', keyProp: 'selectedItemKey' },
  },
  timers: {
    editor: ItemEditor,
    item: {
      component: TimerIntervalEditor,
      section: {
        icon: 'Timer',
        labelKey: 'categorySections.timerInterval.label',
        descriptionKey: 'categorySections.timerInterval.description',
      },
    },
  },
  services: {
    editor: ItemEditor,
    item: { component: ServiceTrigger, section: triggerSection, modelField: 'trigger', keyProp: 'selectedItemKey' },
  },
  reactions: {
    editor: ItemEditor,
    item: {
      component: ReactionTriggerEditor,
      section: triggerSection,
      modelField: 'trigger',
      keyProp: 'selectedItemKey',
      noticeKey: 'reactionEditor.platformNotice',
    },
  },
  pads: {
    editor: ItemEditor,
    item: {
      component: PadTriggerEditor,
      section: triggerSection,
      modelField: 'trigger',
      keyProp: 'selectedItemKey',
      noticeKey: 'padEditor.notice',
    },
  },

  // assets
  mikuji: {
    editor: ItemEditor,
    item: { component: MikujiSettings, section: stepsSection, modelField: null, keyProp: 'omikujiKey' },
  },
  scenarios: {
    editor: ItemEditor,
    item: { component: ScenarioStepsEditor, section: stepsSection, modelField: 'steps', keyProp: 'currentKey' },
  },
  placeholders: {
    editor: ItemEditor,
    item: {
      component: PlaceholderValuesEditor,
      section: {
        icon: 'Brackets',
        labelKey: 'categorySections.placeholder.label',
        descriptionKey: 'categorySections.placeholder.description',
      },
    },
  },
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
