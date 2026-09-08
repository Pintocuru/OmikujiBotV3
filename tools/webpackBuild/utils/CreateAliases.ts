// tools/webpackBuild/utils/CreateAliases.ts
import path from 'path'

// tsconfig.json の paths を Vite の resolve.alias 形式に変換する関数
export function createAliases(baseDir: string, tsconfig: any): Record<string, string> {
  const aliases: Record<string, string> = {}
  const paths = tsconfig.compilerOptions?.paths as Record<string, string[]> | undefined

  if (!paths) return aliases

  for (const [alias, targetArr] of Object.entries(paths)) {
    const key = alias.replace('/*', '')
    const target = targetArr[0].replace('/*', '')
    aliases[key] = path.resolve(baseDir, target)
  }

  return aliases
}
