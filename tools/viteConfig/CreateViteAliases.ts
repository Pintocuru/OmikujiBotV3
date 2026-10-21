// tools/viteConfig/CreateViteAliases.ts
import path from 'path'
import tsconfig from '../../tsconfig.json'

// tsconfig.json の paths めEVite の resolve.alias 形式に変換する関数
export function createViteAliases(baseDir: string): Record<string, string> {
  const aliases: Record<string, string> = {}
  const paths = tsconfig.compilerOptions.paths

  // paths が存在しなぁE��合�E空のオブジェクトを返す
  if (!paths) return aliases

  // tsconfig.json のパスめEVite の形式に変換
  type PathsType = typeof tsconfig.compilerOptions.paths
  for (const alias of Object.keys(paths) as (keyof PathsType)[]) {
    const value = paths[alias][0]
    const key = alias.replace('/*', '')
    // `/*` を取り除き、`path.resolve` で絶対パスに変換
    aliases[key] = path.resolve(baseDir, value.replace('/*', ''))
  }

  return aliases
}
