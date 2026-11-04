// packages/2026-Q4/LifeHourglass/build.ts
import { createPackageProject } from '@tools/viteBuild/projectFactory'
import { PackageBuildTarget, ProjectPackageConfig, ProjectParams } from '@tools/types'

const PROJECT = {
  key: 'LifeHourglass',
  title: '命の砂時計',
  description: 'リスナーが配信を閲覧した時間を「砂粒」として表示する、砂時計ジェネレーター',
  banner: '',
  tags: ['命の砂時計', 'カウントアップ', '閲覧数チェック', 'ギフト'],
  boothId: '7733810',
  category: '2026-Q4',
  licenseLabel: 'CC-BY 4.0',
  extraFiles: [{ from: 'assets/Characters/common/chocolate/', to: 'images/chocolate/' }],
} satisfies ProjectParams

// バリエーション定義
// - color: パッケージ名に付く色違いの名前 ('' = 色なし)
// - withEditor: editor.ts (エディター) を同梱する
// - withConsole: console.ts (LiveConsole。ポン出し・ユーザー操作・ゲームの記録) を同梱する
const VARIANTS = [{ color: '', withEditor: false, withConsole: false }] as const

// ビルドターゲット
const buildTargets: PackageBuildTarget[] = [
  { project: 'LifeHourglass', type: 'FULL' },
  // { project: 'StrawberryChocolate', type: 'JSON' },
]

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectPackageConfig[] {
  return VARIANTS.map(({ color, ...options }) => createPackageProject(packageRoot, color, PROJECT, options))
}

export default { getProjects, buildTargets }
