// build/2026-Q1/FlightSeatGraduation.ts
import { createPackageProject } from '@tools/webpackBuild/projectFactory'
import { PackageBuildTarget, ProjectPackageConfig, ProjectParams } from '@tools/types'

const PROJECT = {
  key: 'FlightSeatGraduation',
  title: 'あつめて！卒業写真メーカー',
  description: 'コメントしたユーザーをランダムに枠に入れるジェネレーター',
  banner: '',
  tags: ['卒業写真メーカー', 'フライトシート'],
  boothId: '8069882',
  category: '2026-Q1',
  series: 'FlightSeat',
  licenseLabel: '利用規約に従う',
} satisfies ProjectParams

// バリエーション
const COLOR_VARIANTS = ['', 'Pro'] as const

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectPackageConfig[] {
  return COLOR_VARIANTS.map((color) => createPackageProject(packageRoot, color, PROJECT))
}

// ビルドターゲット
const buildTargets: PackageBuildTarget[] = [
  { project: 'FlightSeatGraduation', type: 'FULL', sourceProject: 'OmikujiBot' },
  { project: 'FlightSeatGraduation', type: 'JSON' },
  { project: 'FlightSeatGraduationPro', type: 'FULL', sourceProject: 'OmikujiBot' },
]

export default { getProjects, buildTargets }
