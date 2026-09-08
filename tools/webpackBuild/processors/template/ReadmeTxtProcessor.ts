// tools/webpackBuild/processors/template/ReadmeTxtProcessor.ts
import fs from 'fs'
import path from 'path'
import { PackageType, ProjectConfig, ResolvedCoreBuildConfig, ResolvedPackageBuildConfig } from '../../BuildTypes'
import { AccessLevelType } from '../../../../types'
import { getAccessSuffix, getLicenseInfo } from '../../utils/AccessLevelUtils'

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

  const accessSuffix = getAccessSuffix(config.targetAccessLevel)

  const templateTxt: TemplateTxtOutput = {
    packageName: `${template.name}${accessSuffix} ${config.version}`,
    boothURL: template.boothURL,
    description: template.description,
    readmeURL: template.readmeURL,
  }

  const txtPath = path.join(distDir, 'readme.txt')
  const content = generateReadmeContent(templateTxt, config.targetAccessLevel, config.packageType, config.licenseKey)

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
 * ライセンスセクションを生成
 */
function buildLicenseSection(licenseInfo: { key: string; label: string } | null): string {
  if (!licenseInfo) return ''

  return `
★★★★★★★★★★★★★★★★★

${licenseInfo.label}版 ライセンスキーはこちら♡

${licenseInfo.key}

★★★★★★★★★★★★★★★★★
`
}

/**
 * JSON-only セクションを生成
 */
function buildJsonOnlySection(packageType: PackageType | undefined, boothURL: string): string {
  if (packageType !== 'JSON') return ''

  return `---

このファイルには「おみくじテンプレートデータ」が含まれています。
これはジェネレーター本体の「テンプレート読み込み機能」で利用するデータです。

テンプレートの読み込み方法については [【PRO 版】 テンプレート読み込み (json)](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/core/ConfigEditor/README.md#pro-%E7%89%88-%E3%83%86%E3%83%B3%E3%83%97%E3%83%AC%E3%83%BC%E3%83%88%E8%AA%AD%E3%81%BF%E8%BE%BC%E3%81%BF-json) をご覧ください。
(注: この機能はPRO版(有料)限定です)

このファイル単体ではジェネレーターとして動作しません。
ジェネレーター本体をお持ちでない場合は、別途【通常版】をダウンロードしてください。
${boothURL}
`
}

/**
 * readme.txt の内容を生成する純粋関数
 */
export function generateReadmeContent(
  templateTxt: TemplateTxtOutput,
  accessLevel: AccessLevelType,
  packageType: PackageType | undefined,
  license?: ResolvedPackageBuildConfig['licenseKey']
): string {
  const today = formatToday()
  const { packageName, boothURL, description, readmeURL } = templateTxt

  const licenseInfo = getLicenseInfo(accessLevel, license)
  const licenseSection = buildLicenseSection(licenseInfo)
  const jsonOnlySection = buildJsonOnlySection(packageType, boothURL)

  return `# ${packageName}

最終更新日:${today}

[${packageName}](${boothURL})は、${description} です。
ダウンロードして頂きありがとうございます。

導入方法・使用方法については[こちら](${readmeURL})をご覧ください

${licenseSection}${jsonOnlySection}

---

作成者:せすじピンとしてます [@pintocuru](https://twitter.com/pintocuru)
YouTube : [せすじピンとしてます](https://www.youtube.com/@pintocuru)
`
}
