// tools/viteBuild/ViteBuilder.ts
import { ProjectPackageConfig, PackageBuildTarget, SystemCommonData } from '@tools/viteBuild/types'
import { resolvePackageBuildConfigs } from './core/ConfigResolver'
import { executePackageBuild } from './core/BuildExecutor'
import { buildZipFolders } from './utils/ZipBuilder'

export interface ViteBuilderOptions {
  packageTargets: PackageBuildTarget[]
  /** 最初の Vite ビルドの直前に1回だけ実行 (型チェックなど) */
  onBeforeBuild?: () => void | Promise<void>
  /** 全ビルド後に dist 直下のフォルダを個別に ZIP 化する (既定: true = 配布用) */
  zip?: boolean
}

export class ViteBuilder {
  private packageProjects: Map<string, ProjectPackageConfig> = new Map()
  private beforeBuildDone = false

  constructor(private commonData: SystemCommonData) {}

  /**
   * パッケージプロジェクト設定を登録
   */
  registerPackageProject(configOrConfigs: ProjectPackageConfig | ProjectPackageConfig[]): void {
    const configs = Array.isArray(configOrConfigs) ? configOrConfigs : [configOrConfigs]
    configs.forEach((config) => this.packageProjects.set(config.key, config))
  }

  /**
   * ビルドを実行
   */
  async build(options: ViteBuilderOptions): Promise<void> {
    const { packageTargets, onBeforeBuild, zip = true } = options

    if (packageTargets.length === 0) {
      console.warn('[Build] No build targets provided')
      return
    }

    console.log('[Build] Starting build process')
    console.log(`  - Package builds: ${packageTargets.length}`)

    try {
      console.log('\n[Package Build Phase] Starting...')

      const resolvedConfigs = resolvePackageBuildConfigs(packageTargets, this.packageProjects, this.commonData)
      if (resolvedConfigs.length === 0) {
        console.warn('[Package Build] No valid build configurations generated')
        return
      }

      // Vite を通す FULL / UPDATE がある場合のみ、最初に1回だけ実行 (JSON だけのビルドでは型チェックしない)
      if (resolvedConfigs.some((config) => config.packageType === 'FULL' || config.packageType === 'UPDATE')) {
        await this.runBeforeBuildOnce(onBeforeBuild)
      }

      for (const config of resolvedConfigs) {
        await executePackageBuild(config)
      }

      console.log('[Package Build Phase] Completed')

      // ZIP化 (先頭のパッケージの packageRoot を対象にする)
      if (zip) {
        await buildZipFolders(this.packageProjects.get(packageTargets[0].project)!.packageRoot)
      }

      console.log('[Build] All builds completed successfully!')
    } catch (error) {
      console.error('[Build] Build process failed:', error)
      throw error
    }
  }

  /**
   * ビルド前フックを(まだ実行していなければ)実行
   */
  private async runBeforeBuildOnce(hook?: () => void | Promise<void>): Promise<void> {
    if (!hook || this.beforeBuildDone) return
    this.beforeBuildDone = true
    await hook()
  }
}
