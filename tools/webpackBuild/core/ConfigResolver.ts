// tools/webpackBuild/core/ConfigResolver.ts
import {
  ProjectConfig,
  CoreBuildTarget,
  PackageBuildTarget,
  SystemCommonData,
  ResolvedCoreBuildConfig,
  ResolvedPackageBuildConfig,
  PackageType,
  AccessLevelConfig,
} from '../BuildTypes'
import { AccessLevelType } from '../../../types'

/**
 * コアビルド用の出力フォルダ名を生成
 */
function generateCoreOutputFolderName(projectName: string, version: string): string {
  const sanitizeName = (str: string) => str.replace(/[<>:"/\\|?*]/g, '_')
  const sanitizedName = sanitizeName(projectName)
  const sanitizedVersion = sanitizeName(version)

  return `${sanitizedName}_core_${sanitizedVersion}`
}

/**
 * パッケージビルド用の出力フォルダ名を生成
 */
function generatePackageOutputFolderName(
  projectName: string,
  version: string,
  packageType: PackageType,
  accessLevel: AccessLevelType
): string {
  const sanitizeName = (str: string) => str.replace(/[<>:"/\\|?*]/g, '_')
  const sanitizedName = sanitizeName(projectName)
  const sanitizedVersion = sanitizeName(version)

  if (packageType === 'JSON') {
    return `${sanitizedName}_json_${sanitizedVersion}`
  }

  const typeSuffix = packageType === 'PATCH' ? '_patch' : ''
  const accessName = accessLevel === 'basic' ? '' : `${accessLevel}_`

  return `${sanitizedName}_${accessName}${sanitizedVersion}${typeSuffix}`
}

/**
 * コアビルド設定の解決
 */
function resolveCoreConfig(
  target: CoreBuildTarget,
  project: ProjectConfig,
  commonData: SystemCommonData
): ResolvedCoreBuildConfig | null {
  // コアビルドでは entryPoints が必須
  if (!project.entryPoints) {
    console.warn(`[Build] entryPoints not defined for core project: ${project.key}`)
    return null
  }

  return {
    buildType: 'CORE',
    ...project,
    entryPoints: project.entryPoints, // null を除外して型安全に
    system: commonData,
    outputFolderName: generateCoreOutputFolderName(project.key, project.version),
  }
}

/**
 * パッケージビルド設定の解決
 */
function resolvePackageConfig(
  target: PackageBuildTarget,
  project: ProjectConfig,
  commonData: SystemCommonData,
  coreOutputPaths: Map<string, string>
): ResolvedPackageBuildConfig | null {
  if (target.type === 'JSON' && !project.json) {
    console.warn(`[Build] JSON build requested but no JSON config found for project: ${project.key}`)
    return null
  }

  let sourceCorePath: string | undefined

  // JSON タイプ以外の場合のみ、コアビルドのパスを取得
  if (target.type !== 'JSON') {
    if (!target.sourceProject) {
      console.warn(`[Build] sourceProject is required for '${target.type}' build type`)
      return null
    }

    // アクセスレベルなしでコアパスを取得
    const coreKey = target.sourceProject // 'OmikujiBotMain'
    sourceCorePath = coreOutputPaths.get(coreKey)

    if (!sourceCorePath) {
      console.warn(`[Build] Source core path not found for '${target.project}'. ` + `Looking for: ${coreKey}`)
      return null
    }
  }

  return {
    buildType: 'PACKAGE',
    ...project,
    system: commonData,
    packageType: target.type,
    targetAccessLevel: target.accessLevel,
    outputFolderName: generatePackageOutputFolderName(project.key, project.version, target.type, target.accessLevel),
    sourceCorePath,
  }
}

/**
 * コアビルドターゲット配列から設定を解決
 */
export function resolveCoreBuildConfigs(
  targets: CoreBuildTarget[],
  projects: Map<string, ProjectConfig>,
  commonData: SystemCommonData
): ResolvedCoreBuildConfig[] {
  const resolvedConfigs: ResolvedCoreBuildConfig[] = []

  for (const target of targets) {
    const project = projects.get(target.project)
    if (!project) {
      console.warn(`[Build] Project not found: ${target.project}`)
      continue
    }
    const resolved = resolveCoreConfig(target, project, commonData)
    if (resolved) resolvedConfigs.push(resolved)
  }

  return resolvedConfigs
}

/**
 * パッケージビルドターゲット配列から設定を解決
 */
export function resolvePackageBuildConfigs(
  targets: PackageBuildTarget[],
  projects: Map<string, ProjectConfig>,
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
