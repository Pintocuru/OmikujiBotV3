// packages/2026-Q4/LifeHourglass/build.ts
import { definePackage } from '@tools/viteBuild'
import { PackageProject, PackageVariant } from '@tools/types'

const PROJECT: PackageProject = {
  title: '命の砂時計 LifeHourglass',
  description: 'リスナーが配信を閲覧した時間を「砂粒」として表示する、砂時計ジェネレーター',
  tags: ['命の砂時計', 'LifeHourglass', 'カウントアップ', '閲覧数チェック', 'ギフト'],
  boothId: '9219010',
  licenseLabel: '利用規約に準拠',
}

// バリエーション定義
// - variant: パッケージ名に付ける識別子
// - withEditor: editor.ts (エディター) を同梱する
// - withConsole: console.ts (LiveConsole。ポン出し・ユーザー操作・ゲームの記録) を同梱する
// - jsonFileName: 読み込むプリセットJSON (既定: `${key}.json`。null ならJSONなし = アップデート用)
// - extraFiles: このバリエーションに追加でコピーするファイル/フォルダ
const VARIANTS: PackageVariant[] = [
  {
    variant: '',
    withEditor: false,
    jsonFileName: 'LifeHourglass.json',
    extraFiles: [{ from: 'packages/2026-Q4/LifeHourglass/thumb/LifeHourglass.gif', to: 'thumb.gif' }],
  },
  {
    variant: 'Adv',
    withEditor: true,
    jsonFileName: 'LifeHourglass.json',
    extraFiles: [{ from: 'packages/2026-Q4/LifeHourglass/thumb/LifeHourglassAdv.gif', to: 'thumb.gif' }],
  },
]

export default definePackage(import.meta.url, PROJECT, VARIANTS)
