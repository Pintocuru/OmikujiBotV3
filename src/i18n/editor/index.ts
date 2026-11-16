// src/i18n/editor/index.ts
import * as apps from './apps'
import * as assets from './assets'
import * as category from './category'
import * as content from './content'
import * as events from './events'
import * as helpers from './helpers'
import * as preview from './preview'
import * as shell from './shell'
import * as maps from './OmikujiDataMaps'

// 各インポート
import * as manager from '../manager'
import * as ui from '../ui'

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
  manager,
}
