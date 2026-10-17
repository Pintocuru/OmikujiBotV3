// build/2026-Q1/StreamCounterCircle.ts
import { createPackageProject } from '@tools/webpackBuild/projectFactory'
import { PackageBuildTarget, ProjectPackageConfig, ProjectParams } from '@tools/types'

const PROJECT = {
  key: 'StreamCounterCircle',
  series: 'StreamCounter',
  title: 'ライバーカウンター サークル',
  description: '高評価も！コメント数も！いろいろカウントできる多機能カウンターテンプレート',
  banner: '',
  tags: ['ライバーカウンター'],
  boothId: '8078258',
  category: '2026-Q1',
  licenseLabel: '利用規約に従う',
} satisfies ProjectParams

// バリエーション
const COLOR_VARIANTS = ['', 'UpVote', 'Black', 'Color'] as const

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectPackageConfig[] {
  return COLOR_VARIANTS.map((color) => createPackageProject(packageRoot, color, PROJECT))
}

// ビルドターゲット
const buildTargets: PackageBuildTarget[] = [
  { project: 'StreamCounterCircle', type: 'FULL', sourceProject: 'OmikujiBot' },
  { project: 'StreamCounterCircle', type: 'JSON' },

  // { project: 'StreamCounterCircleUpVote', type: 'FULL', sourceProject: 'OmikujiBot' },
  // { project: 'StreamCounterCircleBlack', type: 'FULL', sourceProject: 'OmikujiBot' },
  // { project: 'StreamCounterCircleColor', type: 'FULL', sourceProject: 'OmikujiBot' },
]

export default { getProjects, buildTargets }
