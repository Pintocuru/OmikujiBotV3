// packages/2026-Q4/HondaJanken/build.ts
import { definePackage } from '@tools/viteBuild'
import { PackageProject, PackageVariant } from '@tools/types'

const PROJECT: PackageProject = {
  title: 'じゃんけん HondaJanken',
  description: '「じゃんけん」ミニゲームが楽しめるジェネレーター',
  tags: ['じゃんけん'],
  boothId: '7383088',
  licenseLabel: '利用規約に従う',
  extraFiles: [{ from: 'assets/characters/2026-Q4/HondaJanken/', to: 'Characters/HondaJanken/' }],
}

const VARIANTS: PackageVariant[] = [{ variant: '', withEditor: true, jsonFileName: 'HondaJanken.json' }]

export default definePackage(import.meta.url, PROJECT, VARIANTS)
