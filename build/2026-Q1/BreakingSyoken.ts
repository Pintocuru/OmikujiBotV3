// build/2026-Q1/BreakingSyoken.ts
import { createPackageProject } from '@tools/webpackBuild/projectFactory'
import { PackageBuildTarget, ProjectPackageConfig, ProjectParams } from '@tools/types'

const PROJECT = {
  key: 'BreakingSyoken',
  title: '速報！初見さんいらっしゃい！',
  description: 'コメントしたリスナーに挨拶してくれる 速報風 BOT テンプレート',
  banner: '',
  tags: [
    'ニュースバナー',
    '速報初見さん',
    '初見判定',
    '初見詐欺',
    'ギフト',
    'コメント数表示',
    'コメントチェック',
    '閲覧数チェック',
    '告知',
  ],
  boothId: '8025815',
  category: '2026-Q1',
  licenseLabel: 'CC-BY 4.0',
} satisfies ProjectParams

// バリエーション
const COLOR_VARIANTS = ['', 'Red', 'Blue', 'Green', 'Yellow', 'Premium'] as const

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectPackageConfig[] {
  return COLOR_VARIANTS.map((color) => createPackageProject(packageRoot, color, PROJECT))
}

// ビルドターゲット
const buildTargets: PackageBuildTarget[] = [
  { project: 'BreakingSyoken', type: 'FULL', sourceProject: 'OmikujiBot' },
  { project: 'BreakingSyoken', type: 'JSON' },

  // { project: 'BreakingSyokenRed', type: 'FULL', sourceProject: 'OmikujiBot' },
  // { project: 'BreakingSyokenBlue', type: 'FULL', sourceProject: 'OmikujiBot' },
  // { project: 'BreakingSyokenGreen', type: 'FULL', sourceProject: 'OmikujiBot' },
  // { project: 'BreakingSyokenYellow', type: 'FULL', sourceProject: 'OmikujiBot' },
  // { project: 'BreakingSyokenPremium', type: 'FULL', sourceProject: 'OmikujiBot' },
]

export default { getProjects, buildTargets }
