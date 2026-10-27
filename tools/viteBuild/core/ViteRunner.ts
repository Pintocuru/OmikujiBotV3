// tools/viteBuild/core/ViteRunner.ts
import path from 'path'
import fs from 'fs'
import { build } from 'vite'
import { ViteBuildInput } from '@tools/types'
import { createViteBuildConfig } from '../buildOptions/viteConfig'

/**
 * Vite でビルドを実行 (entryPoints を entry ごとに iife でバンドルする)
 * 出力: scripts/<name>.js / scripts/<name>.css / scripts/entrypoints.js
 * ※ index.html / editor.html / script.js は assets/TemplateEntry からコピーされるため、ここでは作らない
 */
export async function runVite(config: ViteBuildInput, outputSubDir: string): Promise<void> {
  const outDir = path.join(config.packageRoot, 'dist', outputSubDir)
  const manifest: Record<string, { css: string[]; js: string[] }> = {}

  let isFirst = true
  for (const [name, file] of Object.entries(config.entryPoints)) {
    await build(createViteBuildConfig(config, { name, file }, outDir, isFirst))
    isFirst = false

    // CSS が無い entry もあり得るので、存在確認してから manifest に載せる
    const cssExists = fs.existsSync(path.join(outDir, 'scripts', `${name}.css`))
    manifest[name] = { css: cssExists ? [`scripts/${name}.css`] : [], js: [`scripts/${name}.js`] }
  }

  // ローダー (script.js) が読む entry 一覧
  fs.writeFileSync(
    path.join(outDir, 'scripts', 'entrypoints.js'),
    `window.OmikujiEntrypoints=${JSON.stringify(manifest)};`,
    'utf-8'
  )

  console.log('[Build] Vite completed successfully')
}
