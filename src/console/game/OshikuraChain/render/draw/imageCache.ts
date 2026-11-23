// src/console/game/OshikuraChain/render/draw/imageCache.ts
// アイコン画像の読み込みと保持 (読み込み中・失敗は null)

/** URL ごとに、画像を 1 回だけ読み込んで持つ */
export class ImageCache {
  private readonly cache = new Map<string, HTMLImageElement | null>()

  get(url: string): HTMLImageElement | null {
    if (!/^(https?:|data:image\/)/.test(url)) return null
    const cached = this.cache.get(url)
    if (cached === undefined) {
      const image = new Image()
      // CORS つきで読み込む (つけないと、描いた canvas が汚染されて、WebGL がテクスチャにできず Fatal になる)。
      // 相手のサーバーが CORS を許可していない画像は、読み込みに失敗して、頭文字の表示になる
      image.crossOrigin = 'anonymous'
      image.onerror = () => this.cache.set(url, null) // 読み込めなかった画像は、再試行しない
      image.src = url
      this.cache.set(url, image)
      return null
    }
    return cached && cached.complete && cached.naturalWidth > 0 ? cached : null
  }
}
