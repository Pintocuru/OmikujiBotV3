// packages/buildProjects.ts
import { PackageBuildTarget } from '@tools/types'
import Common from './common'

const packages = [Common].flat()

export function getPackageProjects(packageRoot: string) {
  return packages.flatMap((p) => p.getProjects(packageRoot))
}

export const packageTargets: PackageBuildTarget[] = packages.flatMap((p) => p.buildTargets)
