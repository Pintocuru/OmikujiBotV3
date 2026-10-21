// build/2026-Q1/FlightSeatCrowded300.ts
import { createPackageProject } from '@tools/webpackBuild/projectFactory'
import { PackageBuildTarget, ProjectPackageConfig, ProjectParams } from '@tools/types'

const PROJECT = {
  key: 'FlightSeatCrowded300',
  title: '300人埋めてみろよVTuber',
  description: 'コメントしたユーザーをランダムに枠に入れるジェネレーター',
  banner: '',
  tags: ['フライトシート', '300人埋めてみろよVTuber'],
  boothId: '8145288',
  category: '2026-Q1',
  series: 'FlightSeat',
  licenseLabel: 'CC-BY 4.0',
} satisfies ProjectParams

// バリエーション
const COLOR_VARIANTS = [''] as const

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectPackageConfig[] {
  return COLOR_VARIANTS.map((color) => createPackageProject(packageRoot, color, PROJECT))
}

// ビルドターゲット
const buildTargets: PackageBuildTarget[] = [
  { project: 'FlightSeatCrowded300', type: 'FULL', sourceProject: 'OmikujiBot' },
  { project: 'FlightSeatCrowded300', type: 'JSON' },
]

export default { getProjects, buildTargets }
