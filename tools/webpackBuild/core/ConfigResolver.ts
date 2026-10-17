// tools/webpackBuild/core/ConfigResolver.ts
import {
  ProjectCoreConfig,
  ProjectPackageConfig,
  CoreBuildTarget,
  PackageBuildTarget,
  SystemCommonData,
  ResolvedCoreBuildConfig,
  ResolvedPackageBuildConfig,
  PackageType,
} from '@tools/types'

const sanitizeName = (str: string) => str.replace(/[<>:"/\\|?*]/g, '_')

/**
 * コアビルド用の出力フォルダ名を生成
 */
function generateCoreOutputFolderName(projectName: string, version: string): string {
  const sanitizedName = sanitizeName(projectName)
  const sanitizedVersion = sanitizeName(version)

  return `${sanitizedName}_core_${sanitizedVersion}`
}

/**
 * パッケージビルド用の出力フォルダ名を生成
 */
function generatePackageOutputFolderName(projectName: string, version: string, packageType: PackageType): string {
  const sanitizedName = sanitizeName(projectName)
  const sanitizedVersion = sanitizeName(version)

  if (packageType === 'JSON') {
    return `${sanitizedName}_json_${sanitizedVersion}`
  }

  const typeSuffix = packageType === 'PATCH' ? '_patch' : ''

  return `${sanitizedName}_${sanitizedVersion}${typeSuffix}`
}

/**
 * コアビルド設定の解決
 */
function resolveCoreConfig(project: ProjectCoreConfig, commonData: SystemCommonData): ResolvedCoreBuildConfig {
  return {
    ...project,
    system: commonData,
    outputFolderName: generateCoreOutputFolderName(project.key, project.version),
  }
}

/**
 * パッケージビルド設定の解決
 */
function resolvePackageConfig(
  target: PackageBuildTarget,
  project: ProjectPackageConfig,
  commonData: SystemCommonData,
  coreOutputPaths: Map<string, string>
): ResolvedPackageBuildConfig | null {
  let sourceCorePath: string | undefined

  // PATCH の場合のみ、コアビルドのパスを取得 (FULL は main.ts を webpack でビルドする)
  if (target.type === 'PATCH') {
    if (!target.sourceProject) {
      console.warn(`[Build] sourceProject is required for '${target.type}' build type`)
      return null
    }

    const coreKey = target.sourceProject
    sourceCorePath = coreOutputPaths.get(coreKey)

    if (!sourceCorePath) {
      console.warn(`[Build] Source core path not found for '${target.project}'. ` + `Looking for: ${coreKey}`)
      return null
    }
  }

  return {
    ...project,
    system: commonData,
    packageType: target.type,
    outputFolderName: generatePackageOutputFolderName(project.key, project.version, target.type),
    sourceCorePath,
  }
}

/**
 * コアビルドターゲット配列から設定を解決
 */
export function resolveCoreBuildConfigs(
  targets: CoreBuildTarget[],
  projects: Map<string, ProjectCoreConfig>,
  commonData: SystemCommonData
): ResolvedCoreBuildConfig[] {
  const resolvedConfigs: ResolvedCoreBuildConfig[] = []

  for (const target of targets) {
    const project = projects.get(target.project)
    if (!project) {
      console.warn(`[Build] Project not found: ${target.project}`)
      continue
    }
    resolvedConfigs.push(resolveCoreConfig(project, commonData))
  }

  return resolvedConfigs
}

/**
 * パッケージビルドターゲット配列から設定を解決
 */
export function resolvePackageBuildConfigs(
  targets: PackageBuildTarget[],
  projects: Map<string, ProjectPackageConfig>,
  commonData: SystemCommonData,
  coreOutputPaths: Map<string, string>
): ResolvedPackageBuildConfig[] {
  const resolvedConfigs: ResolvedPackageBuildConfig[] = []

  for (const target of targets) {
    const project = projects.get(target.project)
    if (!project) {
      console.warn(`[Build] Project not found: ${target.project}`)
      continue
    }
    const resolved = resolvePackageConfig(target, project, commonData, coreOutputPaths)
    if (resolved) resolvedConfigs.push(resolved)
  }

  return resolvedConfigs
}
