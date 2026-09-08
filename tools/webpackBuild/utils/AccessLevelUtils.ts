// tools/webpackBuild/utils/AccessLevelUtils.ts
import { AccessLevelType } from '../../../types'
import { ProjectConfig, ResolvedPackageBuildConfig } from '../BuildTypes'

/**
 * アクセスレベルに応じた表示名サフィックスを返す
 */
export function getAccessSuffix(level: AccessLevelType): string {
  switch (level) {
    case 'basic':
      return ''
    case 'pro':
      return '-PRO'
    case 'godMode':
      return '-GOD-MODE'
    case 'adv':
      return '-ADV'
    case 'none':
    default:
      return ''
  }
}

/**
 * アクセスレベルに応じたライセンス情報を返す
 */
export function getLicenseInfo(
  level: AccessLevelType,
  license?: ResolvedPackageBuildConfig['licenseKey']
): { key: string; label: string } | null {
  switch (level) {
    case 'pro':
      return license?.pro ? { key: license.pro, label: 'PRO' } : null

    case 'godMode':
      return license?.godMode ? { key: license.godMode, label: 'GOD-MODE' } : null

    case 'basic':
    case 'adv':
    case 'none':
    default:
      return null
  }
}
