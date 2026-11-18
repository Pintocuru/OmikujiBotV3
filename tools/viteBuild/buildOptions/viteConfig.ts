// tools/viteBuild/buildOptions/viteConfig.ts
import path from 'path'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import type { InlineConfig } from 'vite'
import { ViteBuildInput } from '@tools/types'
import { externalDynamicImportPlugin, failOnCircularDependency, sharedCssPlugin } from './plugins'

/**
 * 外部依存関係 (HTML 側で Vue / OneSDK をグローバル読み込みする)
 */
const EXTERNALS = ['vue', '@onecomme.com/onesdk']
const GLOBALS = { vue: 'Vue', '@onecomme.com/onesdk': 'OneSDK' }

/**
 * vendor.js (全 entry 共通) に束ねるライブラリ。各 entry からは external として扱う
 * 追加するときは tools/viteBuild/shared/vendor.ts にも同じものを足す
 */
const VENDOR_GLOBALS = {
  axios: 'OmikujiAxios',
  '@vueuse/motion': 'OmikujiMotion',
  'expr-eval-fork': 'OmikujiExprEval',
}

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
  outDir: string
): InlineConfig {
  return {
    configFile: false,
    root: config.packageRoot,
    mode: 'production',
    // .env / .env.development を読まない (開発用の VITE_IMAGE_BASE_URL や VITE_IS_DEV=true を製品に混ぜない)
    // → import.meta.env.VITE_* は undefined になり、コード側の既定値 './images/' と isDev=false が使われる
    envDir: false,
    logLevel: 'warn',
    plugins: [sharedCssPlugin(config.packageRoot), externalDynamicImportPlugin(), vue(), tailwindcss()],
    resolve: { alias: config.system.alias },
    define: DEFINE,
    build: {
      outDir: path.resolve(outDir),
      emptyOutDir: false, // vendor を先にビルドするため、entry は出力を消さない
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
        external: [...EXTERNALS, ...Object.keys(VENDOR_GLOBALS)],
        checks: { circularDependency: true },
        onLog: failOnCircularDependency,
        output: {
          globals: { ...GLOBALS, ...VENDOR_GLOBALS },
          minify: { compress: { dropConsole: true, dropDebugger: true }, mangle: true },
          codeSplitting: false,
        },
      },
    },
  }
}

/**
 * 共通ライブラリ + 共通 CSS (vendor.js / vendor.css) のビルド設定
 * 各 entry より先に 1 回だけビルドする
 */
export function createVendorBuildConfig(config: ViteBuildInput, outDir: string): InlineConfig {
  return {
    configFile: false,
    root: config.packageRoot,
    mode: 'production',
    envDir: false,
    logLevel: 'warn',
    plugins: [vue(), tailwindcss()],
    resolve: { alias: config.system.alias },
    define: DEFINE,
    build: {
      outDir: path.resolve(outDir),
      emptyOutDir: true,
      lib: {
        entry: path.resolve(config.packageRoot, 'tools/viteBuild/shared/vendor.ts'),
        formats: ['iife'],
        name: 'OmikujiBotVendor',
        fileName: () => 'scripts/vendor.js',
        cssFileName: 'scripts/vendor',
      },
      minify: 'oxc',
      sourcemap: false,
      rolldownOptions: {
        external: EXTERNALS,
        output: {
          globals: GLOBALS,
          minify: { compress: { dropConsole: true, dropDebugger: true }, mangle: true },
          codeSplitting: false,
        },
      },
    },
  }
}
