// src/common/AppEnv.ts

/**
 * アセットのフォルダ名 (ビルド後の root 直下: images/ と sounds/)
 * 開発時もビルド後も同じ名前で配信される (開発時は tools/viteConfig/*AssetsPlugin.ts が対応)
 */
export const IMAGE_DIR = 'images' as const
export const SOUND_DIR = 'sounds' as const

/**
 * image パスディレクトリ
 */
const imageBaseUrl = import.meta.env?.VITE_IMAGE_BASE_URL || `./${IMAGE_DIR}/`
export const getImagePath = (profileImage?: string) => {
  return profileImage ? `${imageBaseUrl}${profileImage}` : ''
}

/**
 * sound パス (ベースからの相対。実際の URL は playSound が assetBase を前置して作る)
 */
export const getSoundPath = (relativePath?: string) => {
  return relativePath ? `${SOUND_DIR}/${relativePath}` : ''
}

/**
 * developer mode
 */
export const isDev = import.meta.env?.VITE_IS_DEV === 'true'

/**
 * プラグイン
 */
export const PLUGIN_KEY = 'OmikujiBotPluginPlus'
export const PLUGIN_NAME = 'おみくじBOT エディタープラグイン'
export const SERVER_PLUGIN_URL = `http://localhost:11180/api/plugins/${PLUGIN_KEY}`
export const SERVER_EXPRESS_URL = 'http://localhost:3001/api'

