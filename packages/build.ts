// packages/build.ts
import { buildPackages } from '@tools/viteBuild'
import packages from './index'
import { syncPresetMeta } from '@tools/presetMeta/syncPresetMeta'

// ビルド前に meta を同期
syncPresetMeta(packages)

// ビルド実行
buildPackages(packages).catch((error) => {
  console.error('❌ ビルドが失敗しました:', error)
  process.exit(1)
})
