// packages/common/OmikujiBot/build.ts
import { createPackageProject } from '@tools/viteBuild/projectFactory'
import { PackageBuildTarget, PackageVariant, ProjectPackageConfig, ProjectParams } from '@tools/types'

const PROJECT = {
  key: 'OmikujiBot',
  title: 'おみくじBOT',
  description: 'おみくじ付きBOTジェネレーターとエディター(アップデート用)',
  banner: '',
  tags: [],
  boothId: '',
  category: 'common',
  licenseLabel: 'Apache-2.0',
} satisfies ProjectParams

const VARIANTS: PackageVariant[] = [
  {
    variant: '',
    withEditor: true,
    withConsole: false,
    type: 'UPDATE',
    jsonFileName: 'OmikujiBot.json',
    update: true,
  },
]

function getProjects(packageRoot: string): ProjectPackageConfig[] {
  return VARIANTS.map(({ variant, withEditor, withConsole, jsonFileName, update }) =>
    createPackageProject(packageRoot, variant, PROJECT, { withEditor, withConsole, jsonFileName, update })
  )
}

const buildTargets: PackageBuildTarget[] = VARIANTS.map(({ variant, type }) => ({
  project: `${PROJECT.key}${variant}`,
  type,
}))

export default { getProjects, buildTargets }
