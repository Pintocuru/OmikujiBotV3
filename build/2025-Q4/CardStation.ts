// build/2025-Q4/CardStation.ts
import { createPackageProject } from '@tools/buildOptions/baseSettings'
import { PackageBuildTarget, ProjectPackageConfig, ProjectParams } from '@tools/types'

const PROJECT = {
  key: 'CardStation',
  title: 'カード駅',
  description: '全国各地 (海外・地球外含む) でカード集めが楽しめるジェネレーター',
  banner: '',
  tags: ['カード駅'],
  boothId: '7412886',
  category: '2025-Q4',
  licenseLabel: '利用規約に従う',
  extraFiles: [],
} satisfies ProjectParams

// バリエーション定義
const COLOR_VARIANTS = [''] as const

// ビルドターゲット（推定）
const buildTargets: PackageBuildTarget[] = [
  { project: 'CardStation', type: 'FULL', sourceProject: 'OmikujiBot' },
  { project: 'CardStation', type: 'JSON' },
]

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectPackageConfig[] {
  return COLOR_VARIANTS.map((color) => createPackageProject(packageRoot, color, PROJECT))
}

export default { getProjects, buildTargets }
