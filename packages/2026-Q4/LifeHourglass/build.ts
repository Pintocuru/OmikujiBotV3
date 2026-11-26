// packages/2026-Q4/LifeHourglass/build.ts
import { definePackage } from '@tools/viteBuild'
import { PackageProject, PackageVariant } from '@tools/types'

const PROJECT: PackageProject = {
  title: '命の砂時計 LifeHourglass',
  description: 'リスナーの視聴時間を「砂粒」として結晶化し、ギフトによる加算にも対応した砂時計ジェネレーター',
  tags: ['命の砂時計', 'LifeHourglass', 'カウントアップ', '閲覧数チェック', 'ギフト'],
  boothId: '9219010',
  licenseLabel: '利用規約に準拠',
}

// バリエーション定義
const extraFiles = [{ from: 'packages/2026-Q4/LifeHourglass/LifeHourglass.gif', to: 'thumb.gif' }]

const VARIANTS: PackageVariant[] = [
  {
    variant: '',
    withEditor: false,
    jsonFileName: 'LifeHourglass.json',
    extraFiles,
  },
  {
    variant: 'Adv',
    withEditor: true,
    jsonFileName: 'LifeHourglass.json',
    extraFiles,
  },
]

export default definePackage(import.meta.url, PROJECT, VARIANTS)
