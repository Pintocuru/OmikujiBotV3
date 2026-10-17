// build/2025-Q4/BigBangFortune.ts
import { createPackageProject } from '@tools/buildOptions/baseSettings'
import { PackageBuildTarget, ProjectPackageConfig, ProjectParams } from '@tools/types'

const PROJECT = {
  key: 'BigBangFortune',
  title: '超おみくじ',
  description: '「桁違い」の数値で占う、クソデカおみくじジェネレーター',
  banner:
    'https://raw.githubusercontent.com/Pintocuru/OmikujiBot-Docs/refs/heads/main/solo/BigBangFortune/thumb_BigBangFortune.gif',
  tags: ['超おみくじ'],
  boothId: '7440428',
  category: '2025-Q4',
  licenseLabel: 'CC-BY 4.0',
  extraFiles: [],
} satisfies ProjectParams

// バリエーション定義
const COLOR_VARIANTS = [''] as const

// ビルドターゲット（必要なら追加）
const buildTargets: PackageBuildTarget[] = [
  { project: 'BigBangFortune', type: 'FULL', sourceProject: 'OmikujiBot' },
  { project: 'BigBangFortune', type: 'JSON' },
]

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectPackageConfig[] {
  return COLOR_VARIANTS.map((color) => createPackageProject(packageRoot, color, PROJECT))
}

export default { getProjects, buildTargets }
