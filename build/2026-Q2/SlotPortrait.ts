// build/2026-Q2/SlotPortrait.ts
import { createPackageProject } from '@tools/webpackBuild/projectFactory'
import { PackageBuildTarget, ProjectPackageConfig, ProjectParams } from '@tools/types'

const PROJECT = {
  key: 'SlotPortrait',
  title: 'イラストガチャメーカー',
  description: 'ガチャに！ゲームに！多彩に使えるスロット風テンプレート',
  banner: '',
  tags: ['コメントスピン', 'イラストガチャメーカー'],
  boothId: '8188701',
  category: '2026-Q2',
  series: 'CommentSpin',
  licenseLabel: 'CC-BY 4.0',
  extraFiles: [{ from: 'assets/Characters/SlotPortrait/', to: 'Characters/SlotPortrait/' }],
} satisfies ProjectParams

// バリエーション
const COLOR_VARIANTS = [''] as const

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectPackageConfig[] {
  return COLOR_VARIANTS.map((color) => createPackageProject(packageRoot, color, PROJECT))
}

// ビルドターゲット
const buildTargets: PackageBuildTarget[] = [
  { project: 'SlotPortrait', type: 'FULL', sourceProject: 'OmikujiBot' },
  { project: 'SlotPortrait', type: 'JSON' },
]

export default { getProjects, buildTargets }
