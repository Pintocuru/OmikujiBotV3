// src/obsidianScripts/expandEmbeds.js
// README テンプレートの埋め込みを展開して README を生成する Templater ユーザースクリプト
//
// 呼び出し方（テンプレートの末尾）:
//   <%* await tp.user.expandEmbeds(tp) %>        … ファイル名（README.template.<lang>.md）から言語を判定
//   <%* await tp.user.expandEmbeds(tp, 'ja') %>  … 言語を明示（こちらが優先）
//
// 出力: en → README.md / それ以外 → README.<lang>.md（テンプレートと同じフォルダ）
//
// ルール:
//   - 画像は IMAGE_DIR（docs/images）直下のものだけを許可し、README から見た相対パスに変換する
//   - 次のものはエラーとして一覧表示し、生成を中止する（既存の README は書き換えない）
//       ・ウィキリンク形式の画像（![[...png]]）
//       ・IMAGE_DIR 以外を指す画像
//       ・見つからない画像、見つからない部品、Markdown 以外の埋め込み
//       ・循環参照、入れ子が深すぎる埋め込み、日付タグの書式エラー

module.exports = async (tp, lang) => {
  // ─── 設定 ───────────────────────────────────────────
  const CONFIG = {
    MAX_DEPTH: 5,
    EXT: '.md',
    DEFAULT_LANG: 'en',
    // 画像の保存先（vault のルートからのパス）。上から順に探し、最初に見つかったフォルダを使う
    IMAGE_DIR_CANDIDATES: ['docs/images', 'images'],
    IMAGE_EXTENSIONS: ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.avif', '.bmp', '.ico'],
    MAX_ERRORS_IN_NOTICE: 8,
  }

  // ─── パスユーティリティ ─────────────────────────────
  const PathUtils = {
    dirname(path) {
      const i = path.lastIndexOf('/')
      return i === -1 ? '' : path.slice(0, i)
    },

    basename(path) {
      return path.slice(path.lastIndexOf('/') + 1)
    },

    /** '.' と '..' を解決して vault 内のパスに正規化する */
    normalize(path) {
      const out = []
      for (const part of path.split('/')) {
        if (!part || part === '.') continue
        if (part === '..') out.pop()
        else out.push(part)
      }
      return out.join('/')
    },

    /** baseDir を基準に rel を解決する（先頭が '/' なら vault のルート基準） */
    resolve(baseDir, rel) {
      if (rel.startsWith('/')) return this.normalize(rel)
      return this.normalize(`${baseDir}/${rel}`)
    },

    /** fromDir から見た toDir の相対パス（同じフォルダなら空文字） */
    relative(fromDir, toDir) {
      const from = fromDir.split('/').filter(Boolean)
      const to = toDir.split('/').filter(Boolean)
      let i = 0
      while (i < from.length && i < to.length && from[i] === to[i]) i++
      return [...Array(from.length - i).fill('..'), ...to.slice(i)].join('/')
    },

    decode(path) {
      try {
        return decodeURIComponent(path)
      } catch {
        return path
      }
    },

    /** Markdown のリンクとして安全になるようにエンコードする（丸括弧も対象） */
    encodeSegment(segment) {
      return encodeURIComponent(segment).replace(/[()]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`)
    },

    /** http: / https: / data: / mailto: / // など */
    isExternal(path) {
      return /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(path)
    },

    isImage(path) {
      const lower = path.toLowerCase()
      return CONFIG.IMAGE_EXTENSIONS.some((ext) => lower.endsWith(ext))
    },
  }

  // ─── 実行環境の取得 ─────────────────────────────────
  const app = tp?.app
  const vault = app?.vault
  const activeFile = app?.workspace?.getActiveFile()
  if (!vault || !activeFile) {
    new Notice('❌ expandEmbeds: アクティブなファイルが取得できません', 5000)
    return ''
  }

  // ─── エラー・統計 ───────────────────────────────────
  const errors = []
  const errorKeys = new Set()
  const stats = { parts: 0, images: 0 }

  const addError = (source, target, reason) => {
    const key = `${source}\n${target}\n${reason}`
    if (errorKeys.has(key)) return
    errorKeys.add(key)
    errors.push({ source, target, reason })
  }

  const reportErrors = (outputName) => {
    console.error(`❌ ${outputName} の生成を中止しました`, errors)
    const list = errors
      .slice(0, CONFIG.MAX_ERRORS_IN_NOTICE)
      .map((e) => `• ${e.source}\n   ${e.target}\n   → ${e.reason}`)
      .join('\n')
    const more =
      errors.length > CONFIG.MAX_ERRORS_IN_NOTICE
        ? `\n…ほか ${errors.length - CONFIG.MAX_ERRORS_IN_NOTICE} 件（コンソールに全件を出力）`
        : ''
    new Notice(
      `❌ ${outputName} の生成を中止しました（エラー ${errors.length} 件）\n既存のファイルは変更していません\n\n${list}${more}`,
      20000
    )
  }

  // ─── 言語・出力先の決定 ─────────────────────────────
  const inferLang = (path) => {
    const m = PathUtils.basename(path).match(/^README\.template\.([A-Za-z]{2,3}(?:-[A-Za-z0-9]+)?)\.md$/)
    return m ? m[1] : null
  }

  const outputLang = lang || inferLang(activeFile.path) || CONFIG.DEFAULT_LANG
  const outputName = outputLang === CONFIG.DEFAULT_LANG ? 'README.md' : `README.${outputLang}.md`
  const outputDir = PathUtils.dirname(activeFile.path)
  const outputPath = outputDir ? `${outputDir}/${outputName}` : outputName

  if (outputPath === activeFile.path) {
    new Notice(`❌ ${outputName} 自身で実行されています。テンプレートのファイルで実行してください`, 6000)
    return ''
  }

  // ─── 画像フォルダの特定 ─────────────────────────────
  const isFolder = (f) => !!f && Array.isArray(f.children)
  const imageDir = CONFIG.IMAGE_DIR_CANDIDATES.map((p) => PathUtils.normalize(p)).find((p) =>
    isFolder(vault.getAbstractFileByPath(p))
  )
  if (!imageDir) {
    new Notice(`❌ 画像フォルダが見つかりません（探した場所: ${CONFIG.IMAGE_DIR_CANDIDATES.join(', ')}）`, 8000)
    return ''
  }
  // README から画像フォルダへの相対パス（エンコード済み。同じ階層なら空文字）
  const imageLinkPrefix = PathUtils.relative(outputDir, imageDir)
    .split('/')
    .filter(Boolean)
    .map((p) => (p === '..' ? p : PathUtils.encodeSegment(p)))
    .join('/')

  // ─── リンクの解析 ───────────────────────────────────
  /** `path` / `path "title"` / `<path>` からパスとタイトルを取り出す */
  const parseLinkTarget = (raw) => {
    let text = raw.trim()
    let title = ''
    const t = text.match(/^(\S+)\s+("[^"]*"|'[^']*')$/)
    if (t) {
      text = t[1]
      title = t[2]
    }
    if (text.startsWith('<') && text.endsWith('>')) text = text.slice(1, -1)
    return { path: text, title }
  }

  // ─── 画像の変換 ─────────────────────────────────────
  const convertImage = (alt, rawPath, title, raw, basePath) => {
    const resolved = PathUtils.resolve(PathUtils.dirname(basePath), PathUtils.decode(rawPath))

    if (PathUtils.dirname(resolved) !== imageDir) {
      addError(basePath, raw, `${imageDir}/ 以外の画像は使えません（解決先: ${resolved}）。画像を貼り直してください`)
      return raw
    }
    const file = vault.getAbstractFileByPath(resolved)
    if (!file || isFolder(file)) {
      addError(basePath, raw, `画像ファイルが見つかりません（${resolved}）`)
      return raw
    }

    stats.images++
    const link = `${imageLinkPrefix ? `${imageLinkPrefix}/` : ''}${PathUtils.encodeSegment(PathUtils.basename(resolved))}`
    return `![${alt}](${link}${title ? ` ${title}` : ''})`
  }

  // ─── 部品（Markdown）の検索 ─────────────────────────
  const findPart = (target, basePath, isWiki) => {
    const decoded = PathUtils.decode(target)
    const relative = PathUtils.resolve(PathUtils.dirname(basePath), decoded)
    const rooted = PathUtils.normalize(decoded)

    const candidates = new Set()
    for (const p of [relative, rooted]) {
      candidates.add(p)
      if (!p.endsWith(CONFIG.EXT)) candidates.add(p + CONFIG.EXT)
    }
    for (const p of candidates) {
      const f = vault.getAbstractFileByPath(p)
      if (f && typeof f.extension === 'string') return f
    }
    // ウィキリンクの名前だけ指定（最短パス）にも対応
    if (isWiki && app.metadataCache?.getFirstLinkpathDest) {
      return app.metadataCache.getFirstLinkpathDest(decoded, basePath) || null
    }
    return null
  }

  // ─── 埋め込みの展開 ─────────────────────────────────
  const embedPart = async (target, raw, basePath, stack, isWiki) => {
    const file = findPart(target, basePath, isWiki)
    if (!file) {
      addError(basePath, raw, 'ファイルが見つかりません')
      return raw
    }
    if (file.extension !== 'md') {
      addError(basePath, raw, 'Markdown 以外のファイルは埋め込めません')
      return raw
    }
    if (stack.includes(file.path)) {
      addError(basePath, raw, `循環参照です（${[...stack, file.path].join(' → ')}）`)
      return raw
    }
    const text = await vault.read(file)
    stats.parts++
    return await expand(text, file.path, [...stack, file.path])
  }

  const replaceEmbed = async (match, basePath, stack) => {
    const raw = match[0]

    // ![[...]] 形式
    if (match[1] !== undefined) {
      const target = match[1].split('|')[0].split('#')[0].trim()
      if (PathUtils.isImage(target)) {
        addError(basePath, raw, 'ウィキリンク形式の画像は使えません。![](...) 形式で貼り直してください')
        return raw
      }
      return await embedPart(target, raw, basePath, stack, true)
    }

    // ![alt](path) 形式
    const { path, title } = parseLinkTarget(match[3])
    if (!path || PathUtils.isExternal(path)) return raw
    if (PathUtils.isImage(path)) return convertImage(match[2], path, title, raw, basePath)
    return await embedPart(path, raw, basePath, stack, false)
  }

  const expand = async (content, basePath, stack) => {
    if (stack.length - 1 > CONFIG.MAX_DEPTH) {
      addError(basePath, '(入れ子)', `埋め込みが ${CONFIG.MAX_DEPTH} 階層を超えています`)
      return content
    }

    const embedRegex = /!\[\[([^\]]+)\]\]|!\[([^\]]*)\]\(([^)]+)\)/g
    let result = ''
    let lastIndex = 0
    for (const match of content.matchAll(embedRegex)) {
      result += content.slice(lastIndex, match.index)
      lastIndex = match.index + match[0].length
      result += await replaceEmbed(match, basePath, stack)
    }
    return result + content.slice(lastIndex)
  }

  // ─── Templater タグの処理 ───────────────────────────
  /** 呼び出しタグ（引数があっても可）を除去する */
  const removeExpandTag = (content) =>
    content.replace(/<%\*\s*await\s+tp\.user\.expandEmbeds\s*\([^)]*\)\s*;?\s*%>/g, '').trim()

  /** <% tp.date.now('YYYY/MM/DD') %> を展開する */
  const processDateTags = (content) =>
    content.replace(/<%\s*tp\.date\.now\s*\(\s*(['"`])(.*?)\1\s*\)\s*%>/g, (whole, _quote, format) => {
      try {
        return tp.date.now(format)
      } catch (e) {
        addError(activeFile.path, whole, `日付の書式が不正です: ${e.message}`)
        return whole
      }
    })

  // ─── 出力（上書き） ─────────────────────────────────
  const writeOutput = async (content) => {
    const existing = vault.getAbstractFileByPath(outputPath)
    if (isFolder(existing)) throw new Error(`${outputPath} はフォルダです`)
    if (existing) {
      if ((await vault.read(existing)) === content) return '変更なし'
      await vault.modify(existing, content)
      return '更新'
    }
    await vault.create(outputPath, content)
    return '新規作成'
  }

  // ─── メイン処理 ─────────────────────────────────────
  try {
    const raw = await vault.read(activeFile)
    const expanded = await expand(removeExpandTag(raw), activeFile.path, [activeFile.path])
    const finalContent = processDateTags(expanded)

    if (errors.length > 0) {
      reportErrors(outputName)
      return ''
    }

    const output = `${finalContent.trim()}\n`
    const status = await writeOutput(output)

    // 展開されずに残った Templater タグがあれば知らせる（生成は成功扱い）
    const leftovers = output.match(/<%[\s\S]*?%>/g) || []
    const warning = leftovers.length > 0 ? `\n⚠️ 未処理の Templater タグが ${leftovers.length} 件残っています` : ''
    if (leftovers.length > 0) console.warn('未処理の Templater タグ:', leftovers)

    console.log(`✅ ${outputPath}（${status}） 部品: ${stats.parts} / 画像: ${stats.images}`)
    new Notice(
      `✅ ${outputName} を生成しました（${status}）\n📄 部品 ${stats.parts} 件 / 🖼️ 画像 ${stats.images} 件${warning}`,
      4000
    )
    return ''
  } catch (error) {
    console.error('❌ expandEmbeds:', error)
    new Notice(`❌ エラーが発生しました: ${error.message}`, 8000)
    return ''
  }
}
