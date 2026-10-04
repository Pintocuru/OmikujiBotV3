// src/common/sounds/AssetResolver.ts
// TODO: CORE_BASE は存在しないように扱いたい…
const CORE_BASE = 'http://localhost:11180/templates/custom/OmikujiBot/'
const TEMPLATE_BASE = './'

export function resolveAsset(path: string) {
  return CORE_BASE + path
}

export function resolveAssetFallback(path: string) {
  return [CORE_BASE + path, TEMPLATE_BASE + path]
}
