// packages/core/OmikujiBot.ts
import path from 'path'
import { createCoreBuildConfig, DEFAULT_FILES_TO_COPY } from '@tools/webpackBuild/projectFactory'
import { ProjectCoreConfig } from '@tools/types'
import { APP_VERSION } from '@/version'

/**
 * MainGenerator + ConfigMaker の両方をビルドするコアプロジェクト
 */
function project(packageRoot: string): ProjectCoreConfig {
  return {
    ...createCoreBuildConfig(packageRoot),

    key: 'OmikujiBot',
    version: APP_VERSION,

    // MainGenerator + ConfigMaker の両方をビルド
    entryPoints: {
      // TODO: エントリはpackages のそれぞれの main.ts を使うこと& エントリ名は generator.ts / editor.ts という名称にする
      generator: path.resolve(packageRoot, 'src/MainGenerator/main.ts'),
      editor: path.resolve(packageRoot, 'src/ConfigMaker/main.ts'),
    },

    filesToCopy: [...DEFAULT_FILES_TO_COPY, { from: 'assets/sounds/core/', to: 'assets/sounds/' }],
  }
}

export default {
  getProjects: (root: string) => [project(root)],
}
