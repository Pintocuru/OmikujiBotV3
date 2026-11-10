// src/i18n/editor/messageModules.ts
// 各フォルダの index.ts で翻訳モジュールを集約する。
import * as apps from './apps'
import * as assets from './assets'
import * as category from './category'
import * as content from './content'
import * as events from './events'
import * as helpers from './helpers'
import * as preview from './preview'
import * as shell from './shell'
import * as ui from './ui'
import * as maps from './OmikujiDataMaps'

export const messageModules: Record<string, Record<string, unknown>> = {
  maps,
  apps,
  assets,
  category,
  content,
  events,
  helpers,
  preview,
  shell,
  ui,
}
