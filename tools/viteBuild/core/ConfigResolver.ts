// tools/viteBuild/core/ConfigResolver.ts
import {
  ProjectPackageConfig,
  PackageBuildTarget,
  SystemCommonData,
  ResolvedPackageBuildConfig,
  PackageType,
} from '@tools/types'

const sanitizeName = (str: string) => str.replace(/[<>:"/\\|?*]/g, '_')

/**
 * パッケージビルド用の出力フォルダ名を生成
 */
function generatePackageOutputFolderName(projectName: string, version: string, packageType: PackageType): string {
  const sanitizedName = sanitizeName(projectName)
  const sanitizedVersion = sanitizeName(version)

  if (packageType === 'JSON') {
    return `${sanitizedName}_json_${sanitizedVersion}`
  }

  const typeSuffix = packageType === 'UPDATE' ? '_update' : ''

  return `${sanitizedName}_${sanitizedVersion}${typeSuffix}`
}

/**
 * パッケージビルドターゲット配列から設定を解決
 */
export function resolvePackageBuildConfigs(
  targets: PackageBuildTarget[],
  projects: Map<string, ProjectPackageConfig>,
  commonData: SystemCommonData
): ResolvedPackageBuildConfig[] {
  const resolvedConfigs: ResolvedPackageBuildConfig[] = []

  for (const target of targets) {
    const project = projects.get(target.project)
    if (!project) {
      console.warn(`[Build] Project not found: ${target.project}`)
      continue
    }
    resolvedConfigs.push({
      ...project,
      system: commonData,
      packageType: target.type,
      outputFolderName: generatePackageOutputFolderName(project.key, project.version, target.type),
    })
  }

  return resolvedConfigs
}
