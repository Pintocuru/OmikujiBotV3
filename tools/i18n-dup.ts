// tools/i18n-dup.ts
import { globSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const flatten = (o: any, p = ''): [string, string][] =>
  Object.entries(o).flatMap(([k, v]) => (typeof v === 'string' ? [[p + k, v]] : flatten(v, `${p}${k}.`)))

const files = globSync('src/i18n/**/*Messages.ts')
const byLang: Record<string, Map<string, string[]>> = { ja: new Map(), en: new Map() }

for (const f of files) {
  const mod = await import(pathToFileURL(resolve(f)).href)
  for (const exp of Object.values<any>(mod)) {
    for (const lang of ['ja', 'en']) {
      for (const [key, val] of flatten(exp[lang] ?? {})) {
        const norm = val.replace(/\s+/g, '').toLowerCase()
        byLang[lang].set(norm, [...(byLang[lang].get(norm) ?? []), `${key} (${f})`])
      }
    }
  }
}

for (const [lang, map] of Object.entries(byLang)) {
  console.log(`\n== ${lang}: duplicates ==`)
  for (const [text, keys] of map) if (keys.length > 1) console.log(text, '\n  ', keys.join('\n   '))
}
