// packages/common/StrawberryChocolate/build.ts
import { definePackage } from '@tools/viteBuild'
import { PackageProject, PackageVariant } from '@tools/types'

const PROJECT: PackageProject = {
  title: 'ストロベリーショコラ',
  description: '世話好きでお姉さんらしいオリキャラ「ストロベリーショコラ」が挨拶してくれるジェネレーター',
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
  licenseLabel: 'CC-BY 4.0',
  extraFiles: [{ from: 'assets/characters/common/chocolate/', to: 'images/chocolate/' }],
}

// バリエーション定義 (項目の意味は 2026-Q4/LifeHourglass/build.ts を参照)
const VARIANTS: PackageVariant[] = [{ variant: '', withEditor: true, withConsole: true }]

export default definePackage(import.meta.url, PROJECT, VARIANTS)
