// src/common/buildValidation/validateAgainstBuild.test.ts
import { afterEach, describe, expect, it } from 'vitest'
import i18n from '@/i18n/editorI18n'
import { formatBuildMismatchMessage, type BuildMismatchTranslate } from './validateAgainstBuild'

const originalLocale = i18n.global.locale.value
const translate: BuildMismatchTranslate = (key, values) => String(i18n.global.t(key, values ?? {}))

afterEach(() => {
  i18n.global.locale.value = originalLocale
})

describe('formatBuildMismatchMessage', () => {
  it.each([
    ['ja', 'このデータは、このビルドで未対応の機能(UI: missingUi)を含んでいます。対応するビルドで開いてください'],
    ['en', 'This data uses features unsupported by this build (UI: missingUi). Open it with a compatible build.'],
  ])('formats the %s locale', (locale, expected) => {
    i18n.global.locale.value = locale

    expect(formatBuildMismatchMessage([{ type: 'ui', key: 'missingUi' }], translate)).toBe(expected)
  })
})
