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

// アップデート用: プリセットJSONを持たない (jsonFileName: null)
const VARIANTS: PackageVariant[] = [{ variant: '', withEditor: true, jsonFileName: null }]

export default definePackage(import.meta.url, PROJECT, VARIANTS)
