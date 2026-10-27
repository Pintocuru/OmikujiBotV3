// packages/build.ts
import { SystemCommonData } from '@tools/types'
import { CreateShimsVue, RemoveShimsVue } from '@tools/viteBuild/utils/CreateShimsVue'
import { ViteBuilder } from '@tools/viteBuild/ViteBuilder'
import { APP_VERSION, DATA_VERSION } from '@/version'
// import { alias } from '../vite.config'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

import { getPackageProjects, packageTargets } from './buildProjects'
import { execSync } from 'child_process'
import { createViteAliases } from '@tools/viteConfig/CreateViteAliases'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../.env.development') })
if (!process.env.PACKAGE_ROOT) throw new Error('⚠️ .envファイルが読めないみたい')
const packageRoot = process.env.PACKAGE_ROOT

/**
 * 型チェック + ESLint を本番前チェックとして実行
 */
async function runPreBuildChecks() {
  // dist削除
  cleanDist(packageRoot)

  // vue-tsc
  console.log('🔍 vue-tsc を実行中...')
  execSync('npx vue-tsc --noEmit', {
    stdio: 'inherit',
  })
  console.log('✅ すべてのチェックに合格しました')

  // shims-vue.d.ts を生成
  await CreateShimsVue(packageRoot)
}

const projectRoot = path.resolve(__dirname, '..') // packages/ の一つ上 = リポジトリ直下
const alias = { ...createViteAliases(projectRoot) }

;(async () => {
  try {
    const systemCommonData: SystemCommonData = {
      alias,
      author: 'Pintocuru(せすじピンとしてます)',
      description: 'おみくじ付きBOTジェネレーター',
      generatorName: 'omikuji-bot',
      generatorVersion: APP_VERSION,
      dataVersion: DATA_VERSION,
    }

    const builder = new ViteBuilder(systemCommonData)
    builder.registerPackageProject(getPackageProjects(packageRoot))

    // 型チェック + ESLint
    await builder.build({
      packageTargets,
      onBeforeBuild: runPreBuildChecks,
    })

    // shims-vue.d.ts を削除
    RemoveShimsVue(packageRoot)

    console.log('🎉 すべてのビルドが正常に完了しました！')
  } catch (error) {
    console.error('❌ ビルドが失敗しました:', error)
    process.exit(1)
  }
})()

// 新しいバージョンをビルドする場合、dist フォルダをクリーンアップ
function cleanDist(root: string) {
  const distPath = path.join(root, 'dist')

  if (fs.existsSync(distPath)) {
    console.log(`🧹 dist を削除します: ${distPath}`)
    fs.rmSync(distPath, { recursive: true, force: true })
  }
}
