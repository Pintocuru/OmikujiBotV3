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
import { executeCoreBuild, executePackageBuild } from './core/BuildExecutor'
import { buildZipFolders } from './utils/ZipBuilder'
import { createCoreFingerprint } from './utils/BuildFingerprint'
import { loadBuildMeta } from './utils/BuildMetaStore'
import path from 'path'

export interface WebpackBuilderOptions {
  coreTargets: CoreBuildTarget[]
  packageTargets: PackageBuildTarget[]
  onBeforeCoreBuild?: () => void | Promise<void>
}

export class WebpackBuilder {
  private coreProjects: Map<string, ProjectCoreConfig> = new Map()
  private packageProjects: Map<string, ProjectPackageConfig> = new Map()
  private coreOutputPaths: Map<string, string> = new Map() // コアビルドの出力パスを記録

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
    const { coreTargets, packageTargets, onBeforeCoreBuild } = options

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
        await this.executeCoreBuildPhase(coreTargets, onBeforeCoreBuild)
      }

      // 2. パッケージビルドを実行
      if (packageTargets.length > 0) {
        await this.executePackageBuildPhase(packageTargets)
      }

      // 3. ZIP化 (先頭のコアの packageRoot を対象にする)
      if (coreTargets.length > 0) {
        const project = this.coreProjects.get(coreTargets[0].project)
        if (project) {
          const isMultipleBuilds = coreTargets.length + packageTargets.length > 1
          await buildZipFolders(project.packageRoot, isMultipleBuilds)
        }
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
    onBeforeCoreBuild?: () => void | Promise<void>
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

    if (onBeforeCoreBuild) await onBeforeCoreBuild()

    for (const config of configsToBuild) {
      await executeCoreBuild(config)
    }

    console.log('[Core Build Phase] Completed')
  }

  /**
   * パッケージビルドフェーズを実行
   */
  private async executePackageBuildPhase(targets: PackageBuildTarget[]): Promise<void> {
    console.log('\n[Package Build Phase] Starting...')

    const resolvedConfigs = resolvePackageBuildConfigs(
      targets,
      this.packageProjects,
      this.commonData,
      this.coreOutputPaths
    )

    if (resolvedConfigs.length === 0) {
      console.warn('[Package Build] No valid build configurations generated')
      return
    }

    for (const config of resolvedConfigs) {
      await executePackageBuild(config)
    }

    console.log('[Package Build Phase] Completed')
  }
}
