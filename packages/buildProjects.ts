// packages/buildProjects.ts
import { PackageBuildTarget } from '@tools/types'
import Common from './common'
import Q42026 from './2026-Q4'

const packages = [Common, Q42026].flat()

export function getPackageProjects(packageRoot: string) {
  return packages.flatMap((p) => p.getProjects(packageRoot))
}

export const packageTargets: PackageBuildTarget[] = packages.flatMap((p) => p.buildTargets)
