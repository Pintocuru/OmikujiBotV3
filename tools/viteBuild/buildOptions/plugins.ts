// tools/viteBuild/buildOptions/plugins.ts
import path from 'path'
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
 * 循環依存の検出
 */
export const failOnCircularDependency: OnLog = (level, log, defaultHandler) => {
  if (log.code !== 'CIRCULAR_DEPENDENCY') return defaultHandler(level, log)
  if (log.ids?.some((id) => id.includes('node_modules'))) return
  throw new Error(`[Build] 循環依存を検出しました: ${log.message}`)
}

/**
 * 各 entry が import する DaisyUi*.css を差し替える
 * Tailwind / daisyUI 本体は vendor.css に 1 回だけ出すので、entry 側では重複させない
 * - DaisyUi.css    → 空
 * - DaisyUiObs.css → OBS 用の透明化ぶんだけ
 */
export function sharedCssPlugin(packageRoot: string): Plugin {
  const styles = path.resolve(packageRoot, 'assets/styles')
  return {
    name: 'shared-css-to-vendor',
    enforce: 'pre',
    resolveId(source) {
      const name = source.split('?')[0].split(/[\\/]/).pop()
      if (!source.includes('styles/') && !source.includes('assets/styles')) return null
      if (name === 'DaisyUi.css') return path.join(styles, 'Empty.css')
      if (name === 'DaisyUiObs.css') return path.join(styles, 'ObsOverride.css')
      return null
    },
  }
}
