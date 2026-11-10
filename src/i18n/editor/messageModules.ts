// src/i18n/editor/messageModules.ts
// i18n に取り込む翻訳ファイルの一覧。
// import.meta.glob (Vite 専用) の代わりに明示的に import している
// src/i18n/editor 配下に翻訳ファイルを追加したら、ここにも1行追加すること。
// (ナビゲーション用の Map など、翻訳ではないファイルは src/editor/maps に置き、ここには載せない)

import * as m_OmikujiDataMaps from './OmikujiDataMaps'
import * as m_apps_AppInfoEditor from './apps/AppInfoEditor'
import * as m_apps_AppItemsCharacters from './apps/AppItemsCharacters'
import * as m_apps_BaseSettingsEditor from './apps/BaseSettingsEditor'
import * as m_apps_DataPacksMessages from './apps/DataPacksMessages'
import * as m_apps_JsonMergeMessages from './apps/JsonMergeMessages'
import * as m_apps_PackageMetaMessages from './apps/PackageMetaMessages'
import * as m_assets_OmikujiItemMessages from './assets/OmikujiItemMessages'
import * as m_assets_PlaceholderMessages from './assets/PlaceholderMessages'
import * as m_assets_ScenarioStep from './assets/scenarios'
import * as m_category_CategorySectionMessagesMap from './category/CategorySectionMessagesMap'
import * as m_category_NavigationSidebarMessagesMap from './category/NavigationSidebarMessagesMap'
import * as m_events_CommentEditor from './events/CommentEditor'
import * as m_events_CommentTriggerEditor from './events/CommentTriggerEditor'
import * as m_events_EventTriggers from './events/EventTriggers'
import * as m_events_PadEditor from './events/PadEditor'
import * as m_events_ReactionEditor from './events/ReactionEditor'
import * as m_events_TriggerAccess from './events/TriggerAccess'
import * as m_events_TriggerComment from './events/TriggerComment'
import * as m_events_TriggerExpression from './events/TriggerExpression'
import * as m_events_TriggerGift from './events/TriggerGift'
import * as m_events_TriggerUsername from './events/TriggerUsername'
import * as m_helpers_clipboardMessages from './helpers/clipboardMessages'
import * as m_helpers_CharacterChangerMessages from './helpers/CharacterChangerMessages'
import * as m_helpers_DataOperationMessages from './helpers/DataOperationMessages'
import * as m_helpers_keyEditorMessages from './helpers/keyEditorMessages'
import * as m_helpers_PresetMessages from './helpers/PresetMessages'
import * as m_helpers_ReferenceGraphMessages from './helpers/ReferenceGraphMessages'
import * as m_content_ItemEditorMessages from './content/ItemEditorMessages'
import * as m_shell_ShellMessages from './shell/ShellMessages'
import * as m_ui_EditorUiMessages from './ui/EditorUiMessages'
import * as m_preview_EditorPreviewMessages from './preview/EditorPreviewMessages'
import * as m_ui_UiSettingsMessages from './ui/UiSettingsMessages'
import * as m_ui_UiComponentMessages from './ui/UiComponentMessages'
import * as m_content_ConnectionMessages from './content/ConnectionMessages'
import * as m_content_TopPageMessages from './content/TopPageMessages'
import * as m_apps_OrphanItemsMessages from './apps/OrphanItemsMessages'
import * as m_apps_CooldownOverviewMessages from './apps/CooldownOverviewMessages'

export const messageModules: Record<string, Record<string, unknown>> = {
  OmikujiDataMaps: m_OmikujiDataMaps,
  'apps/AppInfoEditor': m_apps_AppInfoEditor,
  'apps/AppItemsCharacters': m_apps_AppItemsCharacters,
  'apps/BaseSettingsEditor': m_apps_BaseSettingsEditor,
  'apps/DataPacksMessages': m_apps_DataPacksMessages,
  'apps/JsonMergeMessages': m_apps_JsonMergeMessages,
  'apps/OrphanItemsMessages': m_apps_OrphanItemsMessages,
  'apps/CooldownOverviewMessages': m_apps_CooldownOverviewMessages,
  'apps/PackageMetaMessages': m_apps_PackageMetaMessages,
  'assets/OmikujiItemMessages': m_assets_OmikujiItemMessages,
  'assets/PlaceholderMessages': m_assets_PlaceholderMessages,
  'assets/scenarios': m_assets_ScenarioStep,
  'category/CategorySectionMessagesMap': m_category_CategorySectionMessagesMap,
  'category/NavigationSidebarMessagesMap': m_category_NavigationSidebarMessagesMap,
  'content/ConnectionMessages': m_content_ConnectionMessages,
  'content/TopPageMessages': m_content_TopPageMessages,
  'events/CommentEditor': m_events_CommentEditor,
  'events/CommentTriggerEditor': m_events_CommentTriggerEditor,
  'events/EventTriggers': m_events_EventTriggers,
  'events/PadEditor': m_events_PadEditor,
  'events/ReactionEditor': m_events_ReactionEditor,
  'events/TriggerAccess': m_events_TriggerAccess,
  'events/TriggerComment': m_events_TriggerComment,
  'events/TriggerExpression': m_events_TriggerExpression,
  'events/TriggerGift': m_events_TriggerGift,
  'events/TriggerUsername': m_events_TriggerUsername,
  'helpers/clipboardMessages': m_helpers_clipboardMessages,
  'helpers/CharacterChangerMessages': m_helpers_CharacterChangerMessages,
  'helpers/DataOperationMessages': m_helpers_DataOperationMessages,
  'helpers/keyEditorMessages': m_helpers_keyEditorMessages,
  'helpers/PresetMessages': m_helpers_PresetMessages,
  'helpers/ReferenceGraphMessages': m_helpers_ReferenceGraphMessages,
  'content/ItemEditorMessages': m_content_ItemEditorMessages,
  'preview/EditorPreviewMessages': m_preview_EditorPreviewMessages,
  'shell/ShellMessages': m_shell_ShellMessages,
  'ui/EditorUiMessages': m_ui_EditorUiMessages,
  'ui/UiSettingsMessages': m_ui_UiSettingsMessages,
  'ui/UiComponentMessages': m_ui_UiComponentMessages,
}
