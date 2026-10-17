// build/2025-Q4/5percent_Dora.ts
import { createPackageProject } from '@tools/buildOptions/baseSettings'
import { PackageBuildTarget, ProjectPackageConfig, ProjectParams } from '@tools/types'

const PROJECT = {
  key: '5percent_Dora',
  title: 'どこでもドラちゃんBot',
  description: '「ドラちゃん」を名乗るキャラクターが「ひみつ道具」をランダムに出してくれるジェネレーター',
  banner: '',
  tags: ['ドラちゃん', '#よくやった青狸', '#話が違うぞ青狸', 'https://www.tv-asahi.co.jp/doraemon/tool/'],
  boothId: '7291931',
  category: '2025-Q4',
  licenseLabel: '個人利用のみ',
  extraFiles: [{ from: 'assets/Characters/5percent_Dora/', to: 'Characters/5percent_Dora/' }],
} satisfies ProjectParams

// バリエーション定義
const COLOR_VARIANTS = [''] as const

// ビルドターゲット（推定）
const buildTargets: PackageBuildTarget[] = [{ project: '5percent_Dora', type: 'FULL', sourceProject: 'OmikujiBot' }]

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectPackageConfig[] {
  return COLOR_VARIANTS.map((color) => createPackageProject(packageRoot, color, PROJECT))
}

export default { getProjects, buildTargets }
