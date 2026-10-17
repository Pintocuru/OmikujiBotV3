// build/2025-Q4/FlowerFortune.ts
import { createPackageProject } from '@tools/buildOptions/baseSettings'
import { PackageBuildTarget, ProjectPackageConfig, ProjectParams } from '@tools/types'

const PROJECT = {
  key: 'FlowerFortune',
  title: 'フラワー占い',
  description: '花の色(+キノコ)で占う、真面目な占いジェネレーター',
  banner: '',
  tags: ['占い', 'フラワー占い'],
  boothId: '8109149',
  category: '2025-Q4',
  licenseLabel: 'CC-BY 4.0',
  extraFiles: [],
} satisfies ProjectParams

// バリエーション定義
const COLOR_VARIANTS = [''] as const

// ビルドターゲット（推定）
const buildTargets: PackageBuildTarget[] = [
  { project: 'FlowerFortune', type: 'FULL', sourceProject: 'OmikujiBot' },
  { project: 'FlowerFortune', type: 'JSON' },
]

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectPackageConfig[] {
  return COLOR_VARIANTS.map((color) => createPackageProject(packageRoot, color, PROJECT))
}

export default { getProjects, buildTargets }
