// src/i18n/editor/messageModules.ts
// i18n に取り込む翻訳ファイルの一覧。
// import.meta.glob (Vite 専用) の代わりに明示的に import している (Vite / webpack の両方で動かすため)。
// src/i18n/editor 配下に翻訳ファイルを追加したら、ここにも1行追加すること。
// (ナビゲーション用の Map など、翻訳ではないファイルは src/editor/maps に置き、ここには載せない)

import * as m_OmikujiDataMaps from './OmikujiDataMaps'
import * as m_apps_AppInfoEditor from './apps/AppInfoEditor'
import * as m_apps_AppItemsCharacters from './apps/AppItemsCharacters'
import * as m_apps_BaseSettingsEditor from './apps/BaseSettingsEditor'
import * as m_assets_PlaceholderMessages from './assets/PlaceholderMessages'
import * as m_assets_ScenarioStep from './assets/ScenarioStep'
import * as m_category_CategorySectionMessagesMap from './category/CategorySectionMessagesMap'
import * as m_category_NavigationSidebarMessagesMap from './category/NavigationSidebarMessagesMap'
import * as m_events_CommentEditor from './events/CommentEditor'
import * as m_events_CommentTriggerEditor from './events/CommentTriggerEditor'
import * as m_events_EventCore from './events/EventCore'
import * as m_events_EventTriggers from './events/EventTriggers'
import * as m_events_PadEditor from './events/PadEditor'
import * as m_events_ReactionEditor from './events/ReactionEditor'
import * as m_events_TriggerAccess from './events/TriggerAccess'
import * as m_events_TriggerComment from './events/TriggerComment'
import * as m_events_TriggerExpression from './events/TriggerExpression'
import * as m_events_TriggerGift from './events/TriggerGift'
import * as m_events_TriggerUsername from './events/TriggerUsername'
import * as m_helpers_keyEditorMessages from './helpers/keyEditorMessages'
import * as m_shell_ShellMessages from './shell/ShellMessages'

export const messageModules: Record<string, Record<string, unknown>> = {
  'OmikujiDataMaps': m_OmikujiDataMaps,
  'apps/AppInfoEditor': m_apps_AppInfoEditor,
  'apps/AppItemsCharacters': m_apps_AppItemsCharacters,
  'apps/BaseSettingsEditor': m_apps_BaseSettingsEditor,
  'assets/PlaceholderMessages': m_assets_PlaceholderMessages,
  'assets/ScenarioStep': m_assets_ScenarioStep,
  'category/CategorySectionMessagesMap': m_category_CategorySectionMessagesMap,
  'category/NavigationSidebarMessagesMap': m_category_NavigationSidebarMessagesMap,
  'events/CommentEditor': m_events_CommentEditor,
  'events/CommentTriggerEditor': m_events_CommentTriggerEditor,
  'events/EventCore': m_events_EventCore,
  'events/EventTriggers': m_events_EventTriggers,
  'events/PadEditor': m_events_PadEditor,
  'events/ReactionEditor': m_events_ReactionEditor,
  'events/TriggerAccess': m_events_TriggerAccess,
  'events/TriggerComment': m_events_TriggerComment,
  'events/TriggerExpression': m_events_TriggerExpression,
  'events/TriggerGift': m_events_TriggerGift,
  'events/TriggerUsername': m_events_TriggerUsername,
  'helpers/keyEditorMessages': m_helpers_keyEditorMessages,
  'shell/ShellMessages': m_shell_ShellMessages,
}
