// build/2026-Q1/ValentineCoupling.ts
import { createPackageProject } from '@tools/webpackBuild/projectFactory'
import { PackageBuildTarget, ProjectPackageConfig, ProjectParams } from '@tools/types'

const PROJECT = {
  key: 'ValentineCoupling',
  title: 'バレンタイン・カップリング',
  description: 'test',
  banner: '',
  tags: ['バレンタイン・カップリング', 'ラッキーメンバーズ'],
  boothId: '7432682',
  category: '2026-Q1',
  licenseLabel: 'CC-BY 4.0',
  extraFiles: [],
} satisfies ProjectParams

// バリエーション定義
const COLOR_VARIANTS = [''] as const

// ビルドターゲット（推定）
const buildTargets: PackageBuildTarget[] = [
  { project: 'ValentineCoupling', type: 'FULL', sourceProject: 'OmikujiBot' },
  { project: 'ValentineCoupling', type: 'JSON' },
]

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectPackageConfig[] {
  return COLOR_VARIANTS.map((color) => createPackageProject(packageRoot, color, PROJECT))
}

export default { getProjects, buildTargets }
