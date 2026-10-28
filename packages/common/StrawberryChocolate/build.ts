// packages/common/StrawberryChocolate/build.ts
import { createPackageProject } from '@tools/viteBuild/projectFactory'
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
    'じゃんけん',
    '告知',
  ],
  boothId: '7733810',
  category: 'common',
  licenseLabel: 'CC-BY 4.0',
  extraFiles: [{ from: 'assets/Characters/common/chocolate/', to: 'Characters/chocolate/' }],
} satisfies ProjectParams

// バリエーション定義
// - color: パッケージ名に付く色違いの名前 ('' = 色なし)
// - withEditor: editor.ts (エディター) を同梱する
// - withConsole: console.ts (LiveConsole。ポン出し・ユーザー操作・ゲームの記録) を同梱する
const VARIANTS = [
  { color: '', withEditor: true, withConsole: true },
  // { color: 'Pro', withEditor: true, withConsole: true },
] as const

// ビルドターゲット
const buildTargets: PackageBuildTarget[] = [
  { project: 'StrawberryChocolate', type: 'FULL' },
  // { project: 'StrawberryChocolate', type: 'JSON' },
]

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectPackageConfig[] {
  return VARIANTS.map(({ color, ...options }) => createPackageProject(packageRoot, color, PROJECT, options))
}

export default { getProjects, buildTargets }
