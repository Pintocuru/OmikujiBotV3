// build/2025-Q4/HondaJanken.ts
import { createProject } from '@tools/buildOptions/baseSettings'
import { PackageBuildTarget, ProjectConfig, ProjectParams } from '@tools/webpackBuild/BuildTypes'

const PROJECT = {
  key: 'HondaJanken',
  title: 'じゃんけん',
  description: '「じゃんけん」ミニゲームが楽しめるジェネレーター',
  banner: '',
  tags: ['じゃんけん'],
  boothId: '7383088',
  category: '2025-Q4',
  licenseLabel: '利用規約に従う',
  extraFiles: [],
} satisfies ProjectParams

// バリエーション定義
const COLOR_VARIANTS = [''] as const

// ビルドターゲット（推定）
const buildTargets: PackageBuildTarget[] = [
  { project: 'HondaJanken', type: 'FULL', sourceProject: 'OmikujiBot' },
  { project: 'HondaJanken', type: 'JSON' },
]

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectConfig[] {
  return COLOR_VARIANTS.map((color) => createProject(packageRoot, color, PROJECT))
}

export default { getProjects, buildTargets }
