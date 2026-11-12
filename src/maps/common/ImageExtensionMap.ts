// src/maps/common/ImageExtensionMap.ts

/** 並びは自動検出の優先順位 (既定パッケージが webp のため webp が先頭) */
export const imageExtensions = ['webp', 'png', 'gif', 'jpg', 'jpeg', 'svg', 'webm', 'mp4'] as const

export type ImageExtension = (typeof imageExtensions)[number]

/** imageExtensions のうち、動画として扱うもの */
export const videoExtensions = ['webm', 'mp4'] as const satisfies readonly ImageExtension[]

/** パスの拡張子 (ドットなし・小文字)。クエリ文字列 (?v= 等) は無視する。無ければ空文字 */
export const getPathExtension = (path: string): string => {
  const match = /\.([^./\\?#]+)(?:[?#].*)?$/.exec(path)
  return match ? match[1].toLowerCase() : ''
}

export const isImageExtension = (extension: string): extension is ImageExtension =>
  (imageExtensions as readonly string[]).includes(extension)

export const isVideoPath = (path: string): boolean =>
  (videoExtensions as readonly string[]).includes(getPathExtension(path))
