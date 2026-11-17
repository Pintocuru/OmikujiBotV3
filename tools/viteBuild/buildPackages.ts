// tools/viteBuild/buildPackages.ts
import fs from 'fs'
import path from 'path'
import { PackageDefinition } from '@tools/types'
import { PROJECT_ROOT } from './constants/system'
import { resolvePackageBuildConfigs } from './core/ConfigResolver'
import { executePackageBuild } from './core/BuildExecutor'
import { buildZipFolders } from './utils/ZipBuilder'
import { runPreBuildChecks } from './utils/CheckRunner'

interface BuildPackagesOptions {
  /** 全ビルド後に dist 直下のフォルダを個別に ZIP 化する (既定: true = 配布用) */
  zip?: boolean
}

/**
 * パッケージをビルドする (失敗時は throw。呼び出し側で終了処理をする)
 */
export async function buildPackages(definitions: PackageDefinition[], options: BuildPackagesOptions = {}) {
  const { zip = true } = options

  if (definitions.length === 0) {
    console.warn('⚠️ ビルド対象が指定されていません')
    return
  }

  // 先に解決する (main.ts や JSON が無ければ、dist を消す前に失敗する)
  const configs = resolvePackageBuildConfigs(definitions)
  console.log(`🚀 ビルドを開始します (${configs.length} パッケージ)`)

  // 古いフォルダが ZIP に混ざらないよう、dist をまとめて消す
  const distPath = path.join(PROJECT_ROOT, 'dist')
  fs.rmSync(distPath, { recursive: true, force: true })

  // 型チェックと依存関係チェックは全体で1回だけ (ソースが前回成功時と同じなら飛ばす)
  runPreBuildChecks(PROJECT_ROOT)

  for (const config of configs) {
    await executePackageBuild(config)
  }

  if (zip) await buildZipFolders(PROJECT_ROOT)

  console.log('🎉 すべてのビルドが正常に完了しました！')
}
