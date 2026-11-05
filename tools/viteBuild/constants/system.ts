// tools/viteBuild/constants/system.ts
import path from 'path'
import { fileURLToPath } from 'url'
import { SystemCommonData } from '@tools/types'
import { APP_VERSION, DATA_VERSION } from '@/version'
import { createViteAliases } from '../../viteConfig/CreateViteAliases'

/** リポジトリのルート (tools/viteBuild/constants から 3 つ上) */
export const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')

/** 全パッケージ共通のシステム情報 */
export const SYSTEM_COMMON_DATA: SystemCommonData = {
  alias: createViteAliases(PROJECT_ROOT),
  author: 'Pintocuru(せすじピンとしてます)',
  description: 'おみくじ付きBOTジェネレーター',
  generatorName: 'omikuji-bot',
  generatorVersion: APP_VERSION,
  dataVersion: DATA_VERSION,
}
