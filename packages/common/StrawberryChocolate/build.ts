// packages/common/StrawberryChocolate/build.ts
import { definePackage } from '@tools/viteBuild'
import { PackageProject, PackageVariant } from '@tools/types'

const PROJECT: PackageProject = {
  title: 'ストロベリーショコラ',
  description: '世話好きなお姉さん「ストロベリーショコラ」が挨拶してくれるジェネレーター',
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
}

// バリエーション定義
const extraFiles = [{ from: 'assets/images/common/chocolate/', to: 'images/chocolate/' }]

const VARIANTS: PackageVariant[] = [
  {
    variant: '',
    withEditor: true,
    withConsole: true,
    extraFiles,
  },
]

export default definePackage(import.meta.url, PROJECT, VARIANTS)
