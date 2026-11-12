// packages/2026-Q4/MaidenOmikuji/build.ts
import { definePackage } from '@tools/viteBuild'
import { PackageProject, PackageVariant } from '@tools/types'

const PROJECT: PackageProject = {
  title: '巫女さんのおみくじ',
  description: '巫女さん手製の、真面目なおみくじ。大凶の代わりに「残念賞」が入ってるよ。',
  tags: ['おみくじ', '巫女さんのおみくじ', '占い'],
  boothId: '5471598',
  licenseLabel: '利用規約に従う',
  extraFiles: [{ from: 'assets/characters/2026-Q4/MaidenOmikuji/', to: 'images/MaidenOmikuji/' }],
}

const VARIANTS: PackageVariant[] = [{ variant: '', withEditor: true, jsonFileName: 'MaidenOmikuji.json' }]

export default definePackage(import.meta.url, PROJECT, VARIANTS)
