// src/editor/maps/category/CategoryContentMap.ts
import type { Component } from 'vue'
import type { CategoryType } from '@/types/OmikujiData'
import type { ItemContentDef } from '@/editor/types/apps'
import { LucideIconName } from '@/common/LucideIcon/useLucideIcon'

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
 */
export type CategoryContentDef = {
  /** カテゴリのアイコン(旧 categoryMap から統合) */
  icon: LucideIconName
  editor: Component
  item?: ItemContentDef
}

// 「発動条件」のセクション(timers 以外のイベントで共通)
const triggerSection: ItemContentDef['section'] = {
  icon: 'Filter',
  labelKey: 'categorySections.trigger.label',
  descriptionKey: 'categorySections.trigger.description',
}

// おみくじのセクション
const stepsSection: ItemContentDef['section'] = {
  icon: 'Box',
  labelKey: 'categorySections.mikuji.label',
  descriptionKey: 'categorySections.mikuji.description',
}

// シナリオのセクション
const scenariosSection: ItemContentDef['section'] = {
  icon: 'FilePen',
  labelKey: 'categorySections.scenarios.label',
  descriptionKey: 'categorySections.scenarios.description',
}

export const categoryContentMap: Record<CategoryType, CategoryContentDef> = {
  jsonMerge: { icon: 'Layers', editor: JsonMergeEditor },

  // events
  comments: {
    icon: 'MessageSquare',
    editor: ItemEditor,
    item: {
      component: CommentTriggerEditor,
      section: triggerSection,
      modelField: 'trigger',
      keyProp: 'selectedItemKey',
    },
  },
  timers: {
    icon: 'Timer',
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
    icon: 'ThumbsUp',
    editor: ItemEditor,
    item: { component: ServiceTrigger, section: triggerSection, modelField: 'trigger', keyProp: 'selectedItemKey' },
  },
  reactions: {
    icon: 'Smile',
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
    icon: 'LayoutGrid',
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
    icon: 'Package',
    editor: ItemEditor,
    item: { component: MikujiSettings, section: stepsSection, modelField: null, keyProp: 'mikujiKey' },
  },
  scenarios: {
    icon: 'Zap',
    editor: ItemEditor,
    item: { component: ScenarioStepsEditor, section: scenariosSection, modelField: 'steps', keyProp: 'currentKey' },
  },
  placeholders: {
    icon: 'Brackets',
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
  characters: { icon: 'Users', editor: CharacterEditor },

  // UI
  ui: { icon: 'LayoutGrid', editor: UiEditor },

  // settings
  dataPacks: { icon: 'Download', editor: DataPacks },
  orphans: { icon: 'Search', editor: OrphanItemsEditor },
  cooldown: { icon: 'Timer', editor: CooldownOverviewEditor },
  appInfo: { icon: 'Settings', editor: AppInfoEditor },
}
