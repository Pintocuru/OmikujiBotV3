// packages/2026-Q4/LifeHourglass/build.ts
import { createPackageProject } from '@tools/viteBuild/projectFactory'
import { PackageBuildTarget, PackageVariant, ProjectPackageConfig, ProjectParams } from '@tools/types'

const PROJECT = {
  key: 'LifeHourglass',
  title: '命の砂時計',
  description: 'リスナーが配信を閲覧した時間を「砂粒」として表示する、砂時計ジェネレーター',
  banner: '',
  tags: ['命の砂時計', 'カウントアップ', '閲覧数チェック', 'ギフト'],
  boothId: '7733810',
  category: '2026-Q4',
  licenseLabel: 'CC-BY 4.0',
  extraFiles: [],
} satisfies ProjectParams

// バリエーション定義
// - variant: パッケージ名に付ける識別子
// - withEditor: editor.ts (エディター) を同梱する
// - withConsole: console.ts (LiveConsole。ポン出し・ユーザー操作・ゲームの記録) を同梱する
const VARIANTS: PackageVariant[] = [
  {
    variant: '',
    withEditor: false,
    withConsole: false,
    type: 'FULL',
    jsonFileName: 'LifeHourglass.json',
  },
  {
    variant: 'Adv',
    withEditor: true,
    withConsole: false,
    type: 'FULL',
    jsonFileName: 'LifeHourglass.json',
  },
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
