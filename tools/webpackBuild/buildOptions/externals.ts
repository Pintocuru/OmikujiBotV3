// shared/utils/webpackBuild/buildOptions/externals.ts
import webpack from 'webpack'

/**
 * 外部依存関係の設定を作成
 */
export function createExternals(): webpack.Configuration['externals'] {
  return {
    vue: 'Vue',
    '@onecomme.com/onesdk': 'OneSDK',
  }
}
