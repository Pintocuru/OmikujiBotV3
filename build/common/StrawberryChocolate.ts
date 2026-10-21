// build/common/StrawberryChocolate.ts
import { createPackageProject } from '@tools/webpackBuild/projectFactory'
import { PackageBuildTarget, ProjectPackageConfig, ProjectParams } from '@tools/types'

const PROJECT = {
  key: 'StrawberryChocolate',
  title: 'ストロベリーショコラ',
  description: '世話好きでお姉さんらしいオリキャラ「ストロベリーショコラ」が挨拶してくれるジェネレーター',
  banner: '',
  tags: [
    'ショコラ',
    '初見判定',
    '初見詐欺',
    'ギフト',
    'コメント数表示',
    'コメントチェック',
    '閲覧数チェック',
    '巫女さんのおみくじ',
    'タロット',
    'じゃんけん',
    '閲覧数チェック',
    '告知',
  ],
  boothId: '7733810',
  category: 'common',
  licenseLabel: 'CC-BY 4.0',
  extraFiles: [{ from: 'assets/Characters/common/chocolate/', to: 'Characters/chocolate/' }],
} satisfies ProjectParams

// バリエーション定義
const COLOR_VARIANTS = ['', 'Pro'] as const

// ビルドターゲット
const buildTargets: PackageBuildTarget[] = [
  { project: 'StrawberryChocolate', type: 'FULL', sourceProject: 'OmikujiBot' },
  { project: 'StrawberryChocolatePro', type: 'FULL', sourceProject: 'OmikujiBot' },
  { project: 'StrawberryChocolate', type: 'JSON' },
]

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectPackageConfig[] {
  return COLOR_VARIANTS.map((color) => createPackageProject(packageRoot, color, PROJECT))
}

export default { getProjects, buildTargets }
