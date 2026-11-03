// src/editor/maps/category/CategoryContentMap.ts
import type { Component } from 'vue'
import type { CategoryType } from '@/types/OmikujiData'
import type { ItemContentDef } from '@/editor/types/apps'

import JsonMergeEditor from '@/editor/apps/JsonMerge/JsonMergeEditor.vue'
import DataPacks from '@/editor/apps/dataPacks/DataPacks.vue'
import AppInfoEditor from '@/editor/apps/appInfo/AppInfoEditor.vue'
import OrphanItemsEditor from '@/editor/apps/orphans/OrphanItemsEditor.vue'
import CooldownOverviewEditor from '@/editor/apps/cooldown/CooldownOverviewEditor.vue'
import UiEditor from '@/editor/ui/UiEditor.vue'

import ItemEditor from '@/editor/content/ItemEditor.vue'

import CommentTriggerEditor from '@/editor/events/comment/CommentTriggerEditor.vue'
import TimerIntervalEditor from '@/editor/events/timer/TimerIntervalEditor.vue'
import ServiceTrigger from '@/editor/events/service/ServiceTrigger.vue'
import ReactionTriggerEditor from '@/editor/events/reaction/ReactionTriggerEditor.vue'
import PadTriggerEditor from '@/editor/events/pad/PadTriggerEditor.vue'

import MikujiSettings from '@/editor/assets/mikuji/MikujiSettings.vue'
import ScenarioStepsEditor from '@/editor/assets/scenarios/ScenarioStepsEditor.vue'
import PlaceholderValuesEditor from '@/editor/assets/placeholders/PlaceholderValuesEditor.vue'
import CharacterEditor from '@/editor/assets/characters/CharacterEditor.vue'

/**
 * カテゴリごとの、ContentArea に出す内容の定義
 * - editor: 本体のエディター
 * - item: Events / Assets の 1 セクションの内容。あるカテゴリは editor が ItemEditor で、これを props(content)として受け取る
 *
 * Events / Assets は 1 画面 1 セクションなのでタブを持たない
 * (基本設定は ContentSummary のダイアログ、接続は ContentConnections の接続表示で扱う)。
 * 複数セクションの ui / appInfo は、タブ(SectionTabs)を各エディターが自分で持つ
 */
export type CategoryContentDef = {
  editor: Component
  item?: ItemContentDef
}

// 「発動条件」のセクション(timers 以外のイベントで共通)
const triggerSection: ItemContentDef['section'] = {
  icon: 'Filter',
  labelKey: 'categorySections.trigger.label',
  descriptionKey: 'categorySections.trigger.description',
}

// ???
const stepsSection: ItemContentDef['section'] = {
  icon: 'Box',
  labelKey: 'categorySections.mikuji.label',
  descriptionKey: 'categorySections.mikuji.description',
}

// ???
const scenariosSection: ItemContentDef['section'] = {
  icon: 'ListChecks', // TODO:「シナリオ編集」はこのアイコンではないと思う…
  labelKey: 'categorySections.scenarios.label',
  descriptionKey: 'categorySections.scenarios.description',
}

export const categoryContentMap: Record<CategoryType, CategoryContentDef> = {
  jsonMerge: { editor: JsonMergeEditor },

  // events
  comments: {
    editor: ItemEditor,
    item: {
      component: CommentTriggerEditor,
      section: triggerSection,
      modelField: 'trigger',
      keyProp: 'selectedItemKey',
    },
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
    item: { component: ScenarioStepsEditor, section: scenariosSection, modelField: 'steps', keyProp: 'currentKey' },
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
  orphans: { editor: OrphanItemsEditor },
  cooldown: { editor: CooldownOverviewEditor },
  appInfo: { editor: AppInfoEditor },
}
