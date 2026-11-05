// packages/build.ts
import { buildPackages } from '@tools/viteBuild'
import packages from './index'

buildPackages(packages).catch((error) => {
  console.error('❌ ビルドが失敗しました:', error)
  process.exit(1)
})
