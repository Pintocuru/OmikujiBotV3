// tools/viteBuild/processors/template/ReadmeTxtProcessor.ts
import fs from 'fs'
import path from 'path'
import { PackageType, ResolvedPackageBuildConfig } from '@tools/viteBuild/types'

interface TemplateTxtOutput {
  packageName: string
  boothURL: string
  description: string
  readmeURL: string
}

/**
 * readme.txt の生成エントリポイント
 */
export async function generateReadmeTxt(distDir: string, config: ResolvedPackageBuildConfig): Promise<void> {
  const { json, template } = config

  if (!json || !template) return

  const templateTxt: TemplateTxtOutput = {
    packageName: `${template.name} ${config.version}`,
    boothURL: template.boothURL,
    description: template.description,
    readmeURL: template.readmeURL,
  }

  const txtPath = path.join(distDir, 'readme.txt')
  const content = generateReadmeContent(templateTxt, config.packageType)

  fs.writeFileSync(txtPath, content, 'utf-8')
  console.log(`[Post-Build] Generated readme.txt: ${txtPath}`)
}

/**
 * 日付文字列 (YYYY/MM/DD) を返す
 */
function formatToday(): string {
  const now = new Date()
  return `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`
}

/**
 * JSON-only セクションを生成
 * TODO:JSON は「dataPacks」用に出力するため、readme自体が不要
 */
function buildJsonOnlySection(packageType: PackageType | undefined, boothURL: string): string {
  if (packageType !== 'JSON') return ''

  return `---

このファイルには「おみくじテンプレートデータ」が含まれています。
これはジェネレーター本体の「テンプレート読み込み機能」で利用するデータです。

このファイル単体ではジェネレーターとして動作しません。
ジェネレーター本体をお持ちでない場合は、別途【通常版】をダウンロードしてください。
${boothURL}
`
}

/**
 * readme.txt の内容を生成する純粋関数
 */
export function generateReadmeContent(templateTxt: TemplateTxtOutput, packageType: PackageType | undefined): string {
  const today = formatToday()
  const { packageName, boothURL, description, readmeURL } = templateTxt

  const jsonOnlySection = buildJsonOnlySection(packageType, boothURL)

  return `# ${packageName}

最終更新日:${today}

[${packageName}](${boothURL})は、${description} です。
ダウンロードして頂きありがとうございます。

導入方法・使用方法については[こちら](${readmeURL})をご覧ください

${jsonOnlySection}

---

作成者:せすじピンとしてます [@pintocuru](https://twitter.com/pintocuru)
YouTube : [せすじピンとしてます](https://www.youtube.com/@pintocuru)
`
}
