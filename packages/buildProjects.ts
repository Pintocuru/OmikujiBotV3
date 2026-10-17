// packages/buildProjects.ts
import { CoreBuildTarget, PackageBuildTarget } from '@tools/types'
import OmikujiBot from './core'
import Common from './common'

/**
 * コアビルド設定リスト
 * エディターを更新したら必ずビルドする基盤部分
 */
export const coreTargets: CoreBuildTarget[] = [
  { project: 'OmikujiBot' }, // MainGenerator + ConfigMaker
]

const corePackages = [OmikujiBot].flat()
const packages = [Common].flat()

export function getCoreProjects(packageRoot: string) {
  return corePackages.flatMap((p) => p.getProjects(packageRoot))
}

export function getPackageProjects(packageRoot: string) {
  return packages.flatMap((p) => p.getProjects(packageRoot))
}

export const packageTargets: PackageBuildTarget[] = packages.flatMap((p) => p.buildTargets)
