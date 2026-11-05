// packages/common/StrawberryChocolate/build.ts
import { createPackageProject } from '@tools/viteBuild/projectFactory'
import { PackageBuildTarget, PackageVariant, ProjectPackageConfig, ProjectParams } from '@tools/types'

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
  extraFiles: [{ from: 'assets/Characters/common/chocolate/', to: 'images/chocolate/' }],
} satisfies ProjectParams

// バリエーション定義
// - variant: パッケージ名に付ける識別子
// - withEditor: editor.ts (エディター) を同梱する
// - withConsole: console.ts (LiveConsole。ポン出し・ユーザー操作・ゲームの記録) を同梱する
const VARIANTS: PackageVariant[] = [
  {
    variant: '',
    withEditor: true,
    withConsole: true,
    type: 'FULL',
    jsonFileName: 'StrawberryChocolate.json',
  },
  // {
  //   variant: 'Pro',
  //   withEditor: true,
  //   withConsole: true,
  //   type: 'JSON',
  //   jsonFileName: 'StrawberryChocolate.json',
  // },
]

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectPackageConfig[] {
  return VARIANTS.map(({ variant, withEditor, withConsole, jsonFileName, update }) =>
    createPackageProject(packageRoot, variant, PROJECT, { withEditor, withConsole, jsonFileName, update })
  )
}

// ビルドターゲット
const buildTargets: PackageBuildTarget[] = VARIANTS.map(({ variant, type }) => ({
  project: `${PROJECT.key}${variant}`,
  type,
}))

export default { getProjects, buildTargets }
