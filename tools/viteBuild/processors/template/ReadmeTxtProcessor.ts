// tools/viteBuild/processors/template/ReadmeTxtProcessor.ts
import fs from 'fs'
import path from 'path'
import { ResolvedPackageBuildConfig } from '@tools/types'

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
  const { template } = config

  const templateTxt: TemplateTxtOutput = {
    packageName: `${template.name} ${config.version}`,
    boothURL: template.boothURL,
    description: template.description,
    readmeURL: template.readmeURL,
  }

  const txtPath = path.join(distDir, 'readme.txt')
  const content = generateReadmeContent(templateTxt)

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
 * readme.txt の内容を生成する純粋関数
 */
export function generateReadmeContent(templateTxt: TemplateTxtOutput): string {
  const today = formatToday()
  const { packageName, boothURL, description, readmeURL } = templateTxt

  return `# ${packageName}

最終更新日:${today}

[${packageName}](${boothURL})は、${description} です。
ダウンロードして頂きありがとうございます。

導入方法・使用方法については[こちら](${readmeURL})をご覧ください

---

作成者:せすじピンとしてます [@pintocuru](https://twitter.com/pintocuru)
YouTube : [せすじピンとしてます](https://www.youtube.com/@pintocuru)
`
}
