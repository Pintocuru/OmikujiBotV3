// build/core/OmikujiBot.ts
import path from 'path'
import { createCoreBuildConfig, DEFAULT_FILES_TO_COPY } from '@tools/buildOptions/baseSettings'
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
      MainGenerator: path.resolve(packageRoot, 'src/MainGenerator/main.ts'),
      ConfigMaker: path.resolve(packageRoot, 'src/ConfigMaker/main.ts'),
    },

    filesToCopy: [...DEFAULT_FILES_TO_COPY, { from: 'assets/sounds/core/', to: 'assets/sounds/' }],
  }
}

export default {
  getProjects: (root: string) => [project(root)],
}
