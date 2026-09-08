// tools/webpackBuild/WebpackBuilder.ts
import {
  ProjectConfig,
  CoreBuildTarget,
  PackageBuildTarget,
  SystemCommonData,
  ResolvedCoreBuildConfig,
} from './BuildTypes'
import { resolveCoreBuildConfigs, resolvePackageBuildConfigs } from './core/ConfigResolver'
import { executeCoreBuild, executePackageBuild } from './core/BuildExecutor'
import { buildZipFolders } from './utils/ZipBuilder'
import { createCoreFingerprint } from './utils/BuildFingerprint'
import { loadBuildMeta } from './utils/BuildMetaStore'
import path from 'path'

export interface BuildOptions {
  coreTargets: CoreBuildTarget[]
  packageTargets: PackageBuildTarget[]
  onBeforeCoreBuild?: () => void | Promise<void>
}

export class WebpackBuilder {
  private projects: Map<string, ProjectConfig> = new Map()
  private coreOutputPaths: Map<string, string> = new Map() // コアビルドの出力パスを記録

  constructor(private commonData: SystemCommonData) {}

  /**
   * プロジェクト設定を登録
   */
  registerProject(configOrConfigs: ProjectConfig | ProjectConfig[]): void {
    const configs = Array.isArray(configOrConfigs) ? configOrConfigs : [configOrConfigs]
    configs.forEach((config) => this.projects.set(config.key, config))
  }

  /**
   * ビルドを実行
   */
  async build(options: BuildOptions): Promise<void> {
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

      // 3. ZIP化
      const totalBuilds = coreTargets.length + packageTargets.length
      const isMultipleBuilds = totalBuilds > 1

      if (coreTargets.length > 0) {
        const firstCoreConfig = coreTargets[0]
        const project = this.projects.get(firstCoreConfig.project)
        if (project) {
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

    const resolvedConfigs = resolveCoreBuildConfigs(targets, this.projects, this.commonData)
    if (resolvedConfigs.length === 0) {
      console.warn('[Core Build] No valid build configurations generated')
      return
    }

    const configsToBuild: ResolvedCoreBuildConfig[] = []

    for (const config of resolvedConfigs) {
      const fingerprint = createCoreFingerprint(config)
      const meta = loadBuildMeta(config.packageRoot, config.outputFolderName)

      // ★ キャッシュヒット時も outputPath を登録する
      const distPath = path.join(config.packageRoot, 'dist', config.outputFolderName)
      const key = config.key
      this.coreOutputPaths.set(key, distPath)

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
      const outputPath = await executeCoreBuild(config)
      // executeCoreBuild の戻り値で上書き（念のため）
      this.coreOutputPaths.set(config.key, outputPath)
    }

    console.log('[Core Build Phase] Completed')
  }

  /**
   * パッケージビルドフェーズを実行
   */
  private async executePackageBuildPhase(targets: PackageBuildTarget[]): Promise<void> {
    console.log('\n[Package Build Phase] Starting...')

    const resolvedConfigs = resolvePackageBuildConfigs(targets, this.projects, this.commonData, this.coreOutputPaths)

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
