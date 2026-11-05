// packages/syncMeta.ts
// packages/index.ts の各パッケージが読むプリセットJSONの meta を更新する
//   npm run sync:meta            … 更新する
//   npm run sync:meta -- --dry-run … 変更内容だけ表示する
import { syncPresetMeta } from '@tools/presetMeta/syncPresetMeta'
import packages from './index'

try {
  syncPresetMeta(packages, { dryRun: process.argv.includes('--dry-run') })
} catch (error) {
  console.error('❌ meta の更新に失敗しました:', error)
  process.exit(1)
}
