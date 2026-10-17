// build/2026-Q2/VarietySlot.ts
import { createPackageProject } from '@tools/webpackBuild/projectFactory'
import { PackageBuildTarget, ProjectPackageConfig, ProjectParams } from '@tools/types'

const PROJECT = {
  key: 'VarietySlot',
  title: 'クイズせかいはバラエティスロット',
  description: 'リスナーが増えるほど回る!昭和バラエティ風スロットテンプレート',
  banner: '',
  tags: ['コメントスピン', 'クイズせかいはバラエティスロット'],
  boothId: '8188701',
  category: '2026-Q2',
  series: 'CommentSpin',
  licenseLabel: '利用規約に従う',
  extraFiles: [{ from: 'assets/Characters/VarietySlot/', to: 'Characters/VarietySlot/' }],
} satisfies ProjectParams

// バリエーション
const COLOR_VARIANTS = ['', 'Ranking'] as const

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectPackageConfig[] {
  return COLOR_VARIANTS.map((color) => createPackageProject(packageRoot, color, PROJECT))
}

// ビルドターゲット
const buildTargets: PackageBuildTarget[] = [
  { project: 'VarietySlot', type: 'FULL', sourceProject: 'OmikujiBot' },
  { project: 'VarietySlotRanking', type: 'FULL', sourceProject: 'OmikujiBot' },
]

export default { getProjects, buildTargets }
