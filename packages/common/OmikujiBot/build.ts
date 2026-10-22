// packages/common/OmikujiBot/build.ts
import { createPackageProject } from '@tools/webpackBuild/projectFactory'
import { PackageBuildTarget, ProjectPackageConfig, ProjectParams } from '@tools/types'

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

const buildTargets: PackageBuildTarget[] = [{ project: 'OmikujiBot', type: 'UPDATE' }]

function getProjects(packageRoot: string): ProjectPackageConfig[] {
  return [createPackageProject(packageRoot, '', PROJECT, { withEditor: true, update: true })]
}

export default { getProjects, buildTargets }
