// tools/viteBuild/ViteBuilder.ts
import { ProjectPackageConfig, PackageBuildTarget, SystemCommonData } from '@tools/viteBuild/types'
import { resolvePackageBuildConfigs } from './core/ConfigResolver'
import { executePackageBuild } from './core/BuildExecutor'
import { buildZipFolders } from './utils/ZipBuilder'

interface ViteBuilderOptions {
  packageTargets: PackageBuildTarget[]
  onBeforeBuild?: () => void | Promise<void> // 最初の Vite ビルドの直前に1回だけ実行 (型チェックなど)
  zip?: boolean // 全ビルド後に dist 直下のフォルダを個別に ZIP 化する (既定: true = 配布用)
}

export class ViteBuilder {
  private packageProjects: Map<string, ProjectPackageConfig> = new Map()
  private beforeBuildDone = false

  constructor(private commonData: SystemCommonData) {}

  /**
   * パッケージプロジェクト設定を登録
   */
  registerPackageProject(configs: Map<string, ProjectPackageConfig>): void {
    this.packageProjects = new Map(configs)
  }

  /**
   * ビルドを実行
   */
  async build(options: ViteBuilderOptions): Promise<void> {
    const { packageTargets, onBeforeBuild, zip = true } = options

    if (packageTargets.length === 0) {
      console.warn('⚠️ ビルド対象が指定されていません')
      return
    }

    console.log('🚀 ビルド処理を開始します')
    console.log(`📦 パッケージビルド数: ${packageTargets.length}`)

    try {
      console.log('📦 パッケージビルドフェーズ 開始...')

      const resolvedConfigs = resolvePackageBuildConfigs(packageTargets, this.packageProjects, this.commonData)
      if (resolvedConfigs.length === 0) {
        console.warn('⚠️ 有効なビルド設定が生成されませんでした')
        return
      }

      // Vite を通す FULL / UPDATE がある場合のみ、最初に1回だけ実行 (JSON だけのビルドでは型チェックしない)
      if (resolvedConfigs.some((config) => config.packageType === 'FULL' || config.packageType === 'UPDATE')) {
        await this.runBeforeBuildOnce(onBeforeBuild)
      }

      for (const config of resolvedConfigs) {
        await executePackageBuild(config)
      }

      console.log('✅ パッケージビルドフェーズ 完了')

      // ZIP化 (先頭のパッケージの packageRoot を対象にする)
      if (zip) {
        await buildZipFolders(this.packageProjects.get(packageTargets[0].project)!.packageRoot)
      }

      console.log('🎉 すべてのビルドが正常に完了しました！')
    } catch (error) {
      console.error('❌ ビルド処理が失敗しました:', error)
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
