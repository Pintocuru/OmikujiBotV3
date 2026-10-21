// build/2026-Q1/RunicOracle.ts
import { createPackageProject } from '@tools/webpackBuild/projectFactory'
import { PackageBuildTarget, ProjectPackageConfig, ProjectParams } from '@tools/types'

const PROJECT = {
  key: 'RunicOracle',
  title: 'ルーン占い',
  description: '24 個のルーンストーンで占う、気軽に使えるルーン占いジェネレーター',
  banner: '',
  tags: ['占い', 'ルーン占い'],
  boothId: '7919298',
  category: '2026-Q1',
  licenseLabel: '利用規約に従う',
  extraFiles: [],
} satisfies ProjectParams

// バリエーション定義
const COLOR_VARIANTS = [''] as const

// ビルドターゲット（adv を反映）
const buildTargets: PackageBuildTarget[] = [
  { project: 'RunicOracle', type: 'FULL', sourceProject: 'OmikujiBot' },
  { project: 'RunicOracle', type: 'JSON' },
]

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectPackageConfig[] {
  return COLOR_VARIANTS.map((color) => createPackageProject(packageRoot, color, PROJECT))
}

export default { getProjects, buildTargets }
