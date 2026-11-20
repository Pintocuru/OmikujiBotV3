// packages/2026-Q4/GouseiSuika/build.ts
import { definePackage } from '@tools/viteBuild'
import { PackageProject, PackageVariant } from '@tools/types'

const PROJECT: PackageProject = {
  title: 'スイカジェネレーター +カボチャ&クジラ',
  description: 'コメントでスイカゲーム風のおみくじを楽しめるジェネレーター',
  tags: ['スイカジェネレーター', 'カボチャジェネレーター', 'クジラジェネレーター'],
  boothId: '5813323',
  licenseLabel: '利用規約に従う',
}

const VARIANTS: PackageVariant[] = [
  { variant: '', withEditor: false, jsonFileName: 'GouseiSuika.json' },
  { variant: 'Adv', withEditor: true, jsonFileName: 'GouseiSuika.json' },
]

export default definePackage(import.meta.url, PROJECT, VARIANTS)
