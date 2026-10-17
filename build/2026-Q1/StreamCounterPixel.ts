// build/2026-Q1/StreamCounterPixel.ts
import { createPackageProject } from '@tools/buildOptions/baseSettings'
import { PackageBuildTarget, ProjectPackageConfig, ProjectParams } from '@tools/types'

const PROJECT = {
  key: 'StreamCounterPixel',
  series: 'StreamCounter',
  title: 'ライバーカウンター ピクセル',
  description: '高評価も！コメント数も！いろいろカウントできる多機能カウンターテンプレート',
  banner: '',
  tags: ['ライバーカウンター', 'おはようカウンター', 'ワロタカウンター', 'ナイスカウンター'],
  boothId: '8078267',
  category: '2026-Q1',
  licenseLabel: '利用規約に従う',
} satisfies ProjectParams

// バリエーション
const COLOR_VARIANTS = ['Ohayou', 'UpVote', 'Black', 'Eva'] as const

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectPackageConfig[] {
  return COLOR_VARIANTS.map((color) => createPackageProject(packageRoot, color, PROJECT))
}

// ビルドターゲット
const buildTargets: PackageBuildTarget[] = [
  { project: 'StreamCounterPixelOhayou', type: 'FULL', sourceProject: 'OmikujiBot' },
  { project: 'StreamCounterPixelOhayou', type: 'JSON' },

  // { project: 'StreamCounterPixelUpVote', type: 'FULL', sourceProject: 'OmikujiBot' },
  // { project: 'StreamCounterPixelBlack', type: 'FULL', sourceProject: 'OmikujiBot' },
  // { project: 'StreamCounterPixelEva', type: 'FULL', sourceProject: 'OmikujiBot' },
]

export default { getProjects, buildTargets }
