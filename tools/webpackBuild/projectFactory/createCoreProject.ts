// tools/webpackBuild/projectFactory/createCoreProject.ts
import { ProjectCoreConfig } from '@tools/types'
import { APP_VERSION, BUILD_DATE } from '@/version'
import { HTML_SCRIPT_TAGS } from './defaults'

/** コアプロジェクト向けの共通ベース設定 */
export function createCoreBuildConfig(packageRoot: string) {
  return {
    version: `${BUILD_DATE}-${APP_VERSION}`,
    packageRoot,
    addHtmlTemplate: HTML_SCRIPT_TAGS,
  } satisfies Partial<ProjectCoreConfig>
}
