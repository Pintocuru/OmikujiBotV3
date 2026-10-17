// build/2026-Q2/CookieCounterSakura.ts
import { createPackageProject } from '@tools/buildOptions/baseSettings'
import { PackageBuildTarget, ProjectPackageConfig, ProjectParams } from '@tools/types'

const PROJECT = {
  key: 'SakuraCounter',
  title: '桜カウンター',
  description: '高評価も！コメント数も！いろいろカウントできる多機能カウンターテンプレート',
  banner: '',
  tags: ['クッキーカウンター', '桜カウンター'],
  boothId: '8162455',
  category: '2026-Q2',
  series: 'CookieCounter',
  licenseLabel: 'CC-BY 4.0',
  extraFiles: [{ from: 'assets/Characters/2026-Q2/CookieCounterSakura/', to: 'Characters/CookieCounterSakura/' }],
} satisfies ProjectParams

// バリエーション
const COLOR_VARIANTS = [''] as const

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectPackageConfig[] {
  return COLOR_VARIANTS.map((color) => createPackageProject(packageRoot, color, PROJECT))
}

// ビルドターゲット
const buildTargets: PackageBuildTarget[] = [
  { project: 'SakuraCounter', type: 'FULL', sourceProject: 'OmikujiBot' },
  { project: 'SakuraCounter', type: 'JSON' },
  { project: 'SakuraCounterOhayou', type: 'FULL', sourceProject: 'OmikujiBot' },
]

export default { getProjects, buildTargets }
