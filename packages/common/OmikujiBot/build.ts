// packages/common/OmikujiBot/build.ts
import { definePackage } from '@tools/viteBuild'
import { PackageProject, PackageVariant } from '@tools/types'

const PROJECT: PackageProject = {
  title: 'おみくじBOT',
  description: 'おみくじ付きBOTジェネレーターとエディター(アップデート用)',
  tags: [],
  boothId: '',
  licenseLabel: 'Apache-2.0',
}

const VARIANTS: PackageVariant[] = [{ variant: '', withEditor: true, type: 'UPDATE' }]

export default definePackage(import.meta.url, PROJECT, VARIANTS)
