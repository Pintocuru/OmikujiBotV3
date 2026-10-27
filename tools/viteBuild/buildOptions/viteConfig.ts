// tools/viteBuild/buildOptions/viteConfig.ts
import path from 'path'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import type { InlineConfig } from 'vite'
import { ViteBuildInput } from '../types'
import { externalDynamicImportPlugin, failOnCircularDependency } from './plugins'

/**
 * 外部依存関係 (HTML 側で Vue / OneSDK をグローバル読み込みする)
 */
const EXTERNALS = ['vue', '@onecomme.com/onesdk']
const GLOBALS = { vue: 'Vue', '@onecomme.com/onesdk': 'OneSDK' }

/**
 * ビルド時の define (vue-i18n / Vue の機能フラグ)
 */
const DEFINE = {
  'process.env.NODE_ENV': JSON.stringify('production'),
  __VUE_OPTIONS_API__: JSON.stringify(true),
  __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
  __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
  __VUE_I18N_FULL_INSTALL__: JSON.stringify(true),
  __VUE_I18N_LEGACY_API__: JSON.stringify(false), // createI18n<false> のみ使用
  __INTLIFY_PROD_DEVTOOLS__: JSON.stringify(false),
  __INTLIFY_JIT_COMPILATION__: JSON.stringify(true),
  __INTLIFY_DROP_MESSAGE_COMPILER__: JSON.stringify(false),
}

/**
 * 1 entry ぶんの Vite ビルド設定を作成
 * iife は 1 ビルド = 1 エントリのため、entry の数だけこの設定でビルドする
 * 出力: scripts/<name>.js / scripts/<name>.css
 */
export function createViteBuildConfig(
  config: ViteBuildInput,
  entry: { name: string; file: string },
  outDir: string,
  emptyOutDir: boolean
): InlineConfig {
  return {
    configFile: false,
    root: config.packageRoot,
    mode: 'production',
    // .env / .env.development を読まない (開発用の VITE_IMAGE_BASE_URL や VITE_IS_DEV=true を製品に混ぜない)
    // → import.meta.env.VITE_* は undefined になり、コード側の既定値 './Characters/' と isDev=false が使われる
    envDir: false,
    // packages/build.ts が dotenv で process.env に読み込んだ VITE_* も import.meta.env に入ってしまうため、公開プレフィックスを無効化
    envPrefix: '__NO_PUBLIC_ENV__',
    logLevel: 'warn',
    plugins: [externalDynamicImportPlugin(), vue(), tailwindcss()],
    resolve: { alias: config.system.alias },
    define: DEFINE,
    build: {
      outDir: path.resolve(outDir),
      emptyOutDir, // 2つ目以降の entry は前の出力を消さない
      lib: {
        entry: entry.file,
        formats: ['iife'],
        name: `OmikujiBotPackage_${entry.name}`,
        fileName: () => `scripts/${entry.name}.js`,
        cssFileName: `scripts/${entry.name}`,
      },
      // 配布物の圧縮は oxc (既定)。圧縮オプションは rolldownOptions.output.minify で指定する
      minify: 'oxc',
      sourcemap: false,
      rolldownOptions: {
        external: EXTERNALS,
        checks: { circularDependency: true },
        onLog: failOnCircularDependency,
        output: {
          globals: GLOBALS,
          // webpack 版 TerserPlugin と同じ: console / debugger を消して mangle する
          minify: { compress: { dropConsole: true, dropDebugger: true }, mangle: true },
          codeSplitting: false, // ローダー (script.js) が entry ごとに 1 js + 1 css を読むため分割しない
        },
      },
    },
  }
}
