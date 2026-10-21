// build/2026-Q1/FlightSeatNine.ts
import { createPackageProject } from '@tools/webpackBuild/projectFactory'
import { PackageBuildTarget, ProjectPackageConfig, ProjectParams } from '@tools/types'

const PROJECT = {
  key: 'FlightSeatNine',
  title: '私を構成する 9 人のユーザー。',
  description: 'コメントしたユーザーをランダムに枠に入れるジェネレーター',
  banner: '',
  tags: ['私を構成する9人のユーザー。', 'フライトシート'],
  boothId: '8060471',
  category: '2026-Q1',
  series: 'FlightSeat',
  licenseLabel: '利用規約に従う',
} satisfies ProjectParams

// バリエーション
const COLOR_VARIANTS = [''] as const

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectPackageConfig[] {
  return COLOR_VARIANTS.map((color) => createPackageProject(packageRoot, color, PROJECT))
}

// ビルドターゲット
const buildTargets: PackageBuildTarget[] = [
  { project: 'FlightSeatNine', type: 'FULL', sourceProject: 'OmikujiBot' },
  { project: 'FlightSeatNine', type: 'JSON' },
]

export default { getProjects, buildTargets }
