// tools/viteBuild/buildOptions/plugins.ts
import type { BuildEnvironmentOptions, Plugin } from 'vite'

type OnLog = NonNullable<NonNullable<BuildEnvironmentOptions['rolldownOptions']>['onLog']>

/**
 * iife 形式では external の「動的 import()」がグローバル変数に置換されず、
 * ブラウザに素の import('@onecomme.com/onesdk') が残って落ちる。
 * (静的 import は output.globals で OneSDK に置換される)
 * そのため動的 import をグローバル参照に書き換える。
 */
export function externalDynamicImportPlugin(): Plugin {
  const re = /import\(\s*(['"])@onecomme\.com\/onesdk\1\s*\)/g
  return {
    name: 'external-dynamic-import-to-global',
    enforce: 'pre',
    transform(code, id) {
      if (id.includes('node_modules') || !code.includes('@onecomme.com/onesdk')) return null
      const replaced = code.replace(re, 'Promise.resolve({ ...window.OneSDK, default: window.OneSDK })')
      return replaced === code ? null : { code: replaced, map: null }
    },
  }
}

/**
 * 循環依存の検出 (webpack 版 CircularDependencyPlugin の failOnError 相当)
 * - 自前のコードで循環依存があればビルドを止める
 * - node_modules 内の循環 (zod など) は無視する
 * rolldownOptions.checks.circularDependency を true にした上で、onLog に渡して使う
 */
export const failOnCircularDependency: OnLog = (level, log, defaultHandler) => {
  if (log.code !== 'CIRCULAR_DEPENDENCY') return defaultHandler(level, log)
  if (log.ids?.some((id) => id.includes('node_modules'))) return
  throw new Error(`[Build] 循環依存を検出しました: ${log.message}`)
}
