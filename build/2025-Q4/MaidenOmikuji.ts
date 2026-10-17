// build/2025-Q4/MaidenOmikuji.ts
import { createPackageProject } from '@tools/buildOptions/baseSettings'
import { PackageBuildTarget, ProjectPackageConfig, ProjectParams } from '@tools/types'

const PROJECT = {
  key: 'MaidenOmikujiNormal',
  series: 'MaidenOmikuji',
  title: '巫女さんのおみくじ',
  description: '巫女さん手製の、真面目なおみくじジェネレーター',
  banner: '',
  tags: ['おみくじ', '巫女さんのおみくじ'],
  boothId: '8109123',
  category: '2025-Q4',
  licenseLabel: 'CC-BY 4.0',
  extraFiles: [],
} satisfies ProjectParams

// バリエーション定義
const COLOR_VARIANTS = [''] as const

// ビルドターゲット（推定）
const buildTargets: PackageBuildTarget[] = [
  { project: 'MaidenOmikujiNormal', type: 'FULL', sourceProject: 'OmikujiBot' },
  { project: 'MaidenOmikujiNormal', type: 'JSON' },
]

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectPackageConfig[] {
  return COLOR_VARIANTS.map((color) => createPackageProject(packageRoot, color, PROJECT))
}

export default { getProjects, buildTargets }
