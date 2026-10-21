// tools/webpackBuild/WebpackBuilder.ts
import {
  ProjectCoreConfig,
  ProjectPackageConfig,
  CoreBuildTarget,
  PackageBuildTarget,
  SystemCommonData,
  ResolvedCoreBuildConfig,
} from '@tools/types'
import { resolveCoreBuildConfigs, resolvePackageBuildConfigs } from './core/ConfigResolver'
import { executeCoreBuild, executePackageBuild, Bundler } from './core/BuildExecutor'
import { buildZipFolders } from './utils/ZipBuilder'
import { createCoreFingerprint } from './utils/BuildFingerprint'
import { loadBuildMeta } from './utils/BuildMetaStore'
import path from 'path'

export interface WebpackBuilderOptions {
  coreTargets: CoreBuildTarget[]
  packageTargets: PackageBuildTarget[]
  /** 最初の webpack ビルドの直前に1回だけ実行 (型チェックなど。コア/パッケージ問わず) */
  onBeforeBuild?: () => void | Promise<void>
  /**
   * パッケージ(FULL)のビルドに使うバンドラー。既定は webpack(配布用)。
   * vite は個人利用・試験用: 出力フォルダ名に _vite が付き、ZIP 化しない。コアは常に webpack
   */
  bundler?: Bundler
}

export class WebpackBuilder {
  private coreProjects: Map<string, ProjectCoreConfig> = new Map()
  private packageProjects: Map<string, ProjectPackageConfig> = new Map()
  private coreOutputPaths: Map<string, string> = new Map() // コアビルドの出力パスを記録
  private beforeBuildDone = false

  constructor(private commonData: SystemCommonData) {}

  /**
   * コアプロジェクト設定を登録
   */
  registerCoreProject(configOrConfigs: ProjectCoreConfig | ProjectCoreConfig[]): void {
    const configs = Array.isArray(configOrConfigs) ? configOrConfigs : [configOrConfigs]
    configs.forEach((config) => this.coreProjects.set(config.key, config))
  }

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
  async build(options: WebpackBuilderOptions): Promise<void> {
    const { coreTargets, packageTargets, onBeforeBuild, bundler = 'webpack' } = options

    if (coreTargets.length === 0 && packageTargets.length === 0) {
      console.warn('[Build] No build targets provided')
      return
    }

    console.log('[Build] Starting build process')
    console.log(`  - Core builds: ${coreTargets.length}`)
    console.log(`  - Package builds: ${packageTargets.length}`)

    try {
      // 1. コアビルドを実行
      if (coreTargets.length > 0) {
        await this.executeCoreBuildPhase(coreTargets, onBeforeBuild)
      }

      // 2. パッケージビルドを実行
      if (packageTargets.length > 0) {
        await this.executePackageBuildPhase(packageTargets, onBeforeBuild, bundler)
      }

      // 3. ZIP化 (先頭のコア、コアが無ければ先頭のパッケージの packageRoot を対象にする)
      const rootProject =
        (coreTargets.length > 0 && this.coreProjects.get(coreTargets[0].project)) ||
        (packageTargets.length > 0 && this.packageProjects.get(packageTargets[0].project))
      if (rootProject && bundler === 'webpack') {
        const isMultipleBuilds = coreTargets.length + packageTargets.length > 1
        await buildZipFolders(rootProject.packageRoot, isMultipleBuilds)
      }

      console.log('[Build] All builds completed successfully!')
    } catch (error) {
      console.error('[Build] Build process failed:', error)
      throw error
    }
  }

  /**
   * コアビルドフェーズを実行
   */
  private async executeCoreBuildPhase(
    targets: CoreBuildTarget[],
    onBeforeBuild?: () => void | Promise<void>
  ): Promise<void> {
    console.log('\n[Core Build Phase] Starting...')

    const resolvedConfigs = resolveCoreBuildConfigs(targets, this.coreProjects, this.commonData)
    if (resolvedConfigs.length === 0) {
      console.warn('[Core Build] No valid build configurations generated')
      return
    }

    const configsToBuild: ResolvedCoreBuildConfig[] = []

    for (const config of resolvedConfigs) {
      const fingerprint = createCoreFingerprint(config)
      const meta = loadBuildMeta(config.packageRoot, config.outputFolderName)

      // キャッシュヒット時もパッケージビルドが参照できるよう、出力パスを登録する
      this.coreOutputPaths.set(config.key, path.join(config.packageRoot, 'dist', config.outputFolderName))

      if (meta && meta.hash === fingerprint) {
        console.log(`[Core Build] Skip (cache hit): ${config.outputFolderName}`)
        continue
      }

      configsToBuild.push(config)
    }

    if (configsToBuild.length === 0) {
      console.log('[Core Build Phase] All targets cached. Skipping.')
      return
    }

    await this.runBeforeBuildOnce(onBeforeBuild)

    for (const config of configsToBuild) {
      await executeCoreBuild(config)
    }

    console.log('[Core Build Phase] Completed')
  }

  /**
   * パッケージビルドフェーズを実行
   */
  private async executePackageBuildPhase(
    targets: PackageBuildTarget[],
    onBeforeBuild?: () => void | Promise<void>,
    bundler: Bundler = 'webpack'
  ): Promise<void> {
    console.log('\n[Package Build Phase] Starting...')

    const resolvedConfigs = resolvePackageBuildConfigs(
      targets,
      this.packageProjects,
      this.commonData,
      this.coreOutputPaths
    ).map((config) =>
      // vite の試験ビルドは、配布用と取り違えないようフォルダ名で区別する
      bundler === 'vite' && config.packageType === 'FULL'
        ? { ...config, outputFolderName: `${config.outputFolderName}_vite` }
        : config
    )

    if (resolvedConfigs.length === 0) {
      console.warn('[Package Build] No valid build configurations generated')
      return
    }

    // webpack を通す FULL がある場合のみ、他の出力を消さないよう最初に1回だけ実行
    if (resolvedConfigs.some((config) => config.packageType === 'FULL')) {
      await this.runBeforeBuildOnce(onBeforeBuild)
    }

    for (const config of resolvedConfigs) {
      await executePackageBuild(config, bundler)
    }

    console.log('[Package Build Phase] Completed')
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
