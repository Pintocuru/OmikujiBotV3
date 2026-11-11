// script.js - index.html / editor.html / console.html 共通ローダー

window.OmikujiLoader = {
  loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script')
      s.src = src
      s.onload = resolve
      s.onerror = () => reject(new Error(`スクリプト読み込み失敗: ${src}`))
      document.head.appendChild(s)
    })
  },

  loadCSS(href) {
    return new Promise((resolve, reject) => {
      const l = document.createElement('link')
      l.rel = 'stylesheet'
      l.href = href
      l.onload = resolve
      l.onerror = () => reject(new Error(`CSS読み込み失敗: ${href}`))
      document.head.appendChild(l)
    })
  },

  async loadFrom(base, cssFiles, jsFiles) {
    await Promise.all(cssFiles.map((css) => this.loadCSS(base + css)))
    for (const js of jsFiles) await this.loadScript(base + js)
  },

  showOneCommeError() {
    document.body.innerHTML = `
      <div style="padding:40px;font-family:sans-serif;text-align:center">
        <p style="font-size:48px;margin:0 0 16px">🐕</p>
        <h1 style="color:#d33;margin:0 0 12px">わんコメが起動していません</h1>
        <p style="color:#666;margin:0">わんコメを起動してから、このページを再読み込みしてください。</p>
      </div>
    `
  },

  // わんコメ(Vue / onesdk)を読み込めなかったときの共通表示
  // わんコメ経由 (http://localhost:...) で開いているのに失敗 = 未起動
  // それ以外 (file:// や OBS の http://absolute/ など) = ローカル読み込み
  showConnectionError() {
    const host = location.hostname
    if (host === 'localhost' || host === '127.0.0.1') {
      this.showOneCommeError()
      return
    }
    document.body.innerHTML = `
      <div style="padding:24px;font-family:sans-serif;text-align:center;color:#333">
        <p style="font-size:40px;margin:0 0 8px">🐕</p>
        <h1 style="color:#d33;margin:0 0 12px;font-size:22px">わんコメと通信できません</h1>
        <p style="margin:0 0 12px">次のどちらかが原因です。</p>
        <p style="margin:0 0 8px">① わんコメが起動していない<br>→ 起動してから、再読み込みしてください。</p>
        <p style="margin:0 0 16px">
          ② 「ここをドラッグしてOBSに入れる」を使った<br>
          →「ブラウザで開く」を OBS のソースにドラッグして入れ直してください。
        </p>
        <img
          src="https://github.com/Pintocuru/OmikujiBotV3/raw/main/docs/images/installation-1792992840724.webp"
          alt="わんコメでの導入方法"
          style="max-width:100%;height:auto"
        />
      </div>
    `
  },

  showLoadError(detail = '') {
    document.body.innerHTML = `
      <div style="padding:40px;font-family:sans-serif;color:#d33;text-align:center">
        <h1>読み込みエラー</h1>
        <p>必要なファイルを読み込めませんでした。</p>
        <p style="font-size:13px;color:#888">わんコメの custom フォルダに入れてから起動してください</p>
        ${detail ? `<pre style="font-size:11px;color:#aaa;margin-top:12px">${detail}</pre>` : ''}
      </div>
    `
  },

  // Vue の読み込みを待つ（onesdk チェックは requireOneComme 時のみ）
  _waitForVue(timeout = 5000) {
    return new Promise((resolve, reject) => {
      if (typeof window.Vue !== 'undefined') return resolve()
      const interval = 50
      let elapsed = 0
      const timer = setInterval(() => {
        elapsed += interval
        if (typeof window.Vue !== 'undefined') {
          clearInterval(timer)
          resolve()
        } else if (elapsed >= timeout) {
          clearInterval(timer)
          reject(new Error('タイムアウト: Vue の読み込みを待機中'))
        }
      }, interval)
    })
  },

  // entry が読み込むべきファイル一覧を取得する (webpack が scripts/entrypoints.js に書き出す)
  async getEntryFiles(entry) {
    await this.loadScript('./scripts/entrypoints.js')
    const files = window.OmikujiEntrypoints && window.OmikujiEntrypoints[entry]
    if (!files) throw new Error(`entry が見つかりません: ${entry}`)
    return files
  },

  // entry: 'main'(ジェネレーター) / 'editor'(エディター) / 'console'(LiveConsole)
  async run({ entry, mountFn, requireOneComme = false }) {
    // 配布フォルダ直下が基準。ファイル名は entrypoints.js の一覧 (scripts/xxx) をそのまま使う
    const BASE = './'

    try {
      await this._waitForVue()
    } catch {
      // Vue は わんコメ(localhost:11180) から読むため、失敗 = 未起動 or ローカル遮断
      this.showConnectionError()
      return
    }

    if (requireOneComme) {
      if (window.__onesdkLoaded === false) {
        this.showConnectionError()
        return
      }
      // onesdk の読み込み完了を最大3秒待つ
      const sdkReady = await new Promise((resolve) => {
        if (window.__onesdkLoaded === true) return resolve(true)
        let elapsed = 0
        const timer = setInterval(() => {
          elapsed += 50
          if (window.__onesdkLoaded === true) {
            clearInterval(timer)
            resolve(true)
          } else if (window.__onesdkLoaded === false || elapsed >= 3000) {
            clearInterval(timer)
            resolve(false)
          }
        }, 50)
      })
      if (!sdkReady) {
        this.showConnectionError()
        return
      }
    }

    try {
      const files = await this.getEntryFiles(entry)
      await this.loadFrom(BASE, files.css, files.js)
    } catch (e) {
      this.showLoadError(e.message)
      return
    }

    window.OmikujiBot = window.OmikujiBot || {}
    window.OmikujiBot.assetBase = BASE

    try {
      mountFn()
    } catch (e) {
      console.error('mount 失敗:', e)
    }
  },
}
