// src/common/MockUser/MockGenerators.ts
import { BotMessageRankingSchema, BotMessageRankingType } from '@/types/generator'
import { UserStatsRecord, UserStatsRecordSchema } from '@/types/generator'
import { LocaleType } from '@/types/OmikujiData/'
import { RANKING_POINTS_RANGE, SUFFIX_PROBABILITY, USER_STATS_RANGES } from './MockConstants'
import { MOCK_FAMILY_NAME_JA_LIST, MOCK_USER_GIVEN_JA_LIST } from './maps/MockUserJaMaps'
import { NAME_SUFFIXES } from './maps/MockUserMaps'

// ランキングプレビュー用の設定(GameRanking は ui 側で管理)
type DummyRankingSettings = { limit?: number; sortOrder?: 'high' | 'low' | 'new' }

// -------------------------------------------------------------------
// ロケール別マップの型定義
// -------------------------------------------------------------------

// ロケール別 given-name リスト
const GIVEN_NAME_LIST_MAP: Partial<Record<LocaleType, { label: string; avatarStyle: string }[]>> = {
  ja: MOCK_USER_GIVEN_JA_LIST,
  // en: MOCK_USER_GIVEN_EN_LIST,  // 追加予定
}

// ロケール別 family-name リスト */
const FAMILY_NAME_LIST_MAP: Partial<Record<LocaleType, string[]>> = {
  ja: MOCK_FAMILY_NAME_JA_LIST,
  // en: MOCK_FAMILY_NAME_EN_LIST,  // 追加予定
}

// フォールバック先ロケール */
const FALLBACK_LOCALE: LocaleType = 'ja'

// -------------------------------------------------------------------
// ユーティリティ
// -------------------------------------------------------------------

// [min, max] の整数乱数
const randInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min

// 配列からランダムに 1 件取得
const pickRandom = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)]

// ロケールに対応した given-name エントリをランダムに 1 件取得
const pickGivenName = (locale: LocaleType): { label: string; avatarStyle: string } => {
  const list = GIVEN_NAME_LIST_MAP[locale] ?? GIVEN_NAME_LIST_MAP[FALLBACK_LOCALE] ?? []
  return pickRandom(list)
}

// ロケールに対応した family-name をランダムに 1 件取得（存在しない場合は undefined）
const pickFamilyName = (locale: LocaleType): string | undefined => {
  const list = FAMILY_NAME_LIST_MAP[locale] ?? FAMILY_NAME_LIST_MAP[FALLBACK_LOCALE]
  if (!list || list.length === 0) return undefined
  return pickRandom(list)
}

/**
 * ロケールを受け取り、確率で family-name・suffix を付加したユーザー名を生成する。
 * - family-name : SUFFIX_PROBABILITY で付与（LocaleType の影響を受ける）
 * - NAME_SUFFIXES: SUFFIX_PROBABILITY で付与（LocaleType の影響を受けない）
 */
const buildUserName = (locale: LocaleType): string => {
  const { label: baseName } = pickGivenName(locale)

  // family-name を確率で先頭に付与
  const familyName = Math.random() < SUFFIX_PROBABILITY ? pickFamilyName(locale) : undefined
  const nameWithFamily = familyName ? `${familyName} ${baseName}` : baseName

  // NAME_SUFFIXES を確率で末尾に付与（ロケール非依存）
  if (Math.random() < SUFFIX_PROBABILITY) {
    const suffix = pickRandom(NAME_SUFFIXES)
    return nameWithFamily + suffix
  }

  return nameWithFamily
}

// ロケールに対応した given-name の総数（重複なし抽選の上限として使用）
const givenNameCount = (locale: LocaleType): number =>
  (GIVEN_NAME_LIST_MAP[locale] ?? GIVEN_NAME_LIST_MAP[FALLBACK_LOCALE] ?? []).length

/**
 * 生成関数
 */

// プレビュー用: tc / score / giftPrice などの統計付きユーザーリストを生成
export const generateDummyUserStats = (count: number, locale: LocaleType = 'ja'): UserStatsRecord[] => {
  const { tc, no, score, giftPrice } = USER_STATS_RANGES
  const maxCount = Math.min(count, 300)
  let previewIdCounter = 0

  return Array.from({ length: maxCount }, () => {
    const userName = buildUserName(locale)
    return UserStatsRecordSchema.parse({
      userName,
      userId: `${userName}-${previewIdCounter++}`,
      isSyoken: Math.random() < 0.05,
      tc: randInt(tc.min, tc.max),
      no: randInt(no.min, no.max),
      score: randInt(score.min, score.max),
      giftPrice: Math.random() < giftPrice.zeroProbability ? 0 : randInt(giftPrice.min, giftPrice.max),
    })
  })
}

// ランキング表示用のダミー BotMessage を生成
export const generateDummyMessages = (
  settings: DummyRankingSettings,
  locale: LocaleType = 'ja'
): BotMessageRankingType[] => {
  const count = settings.limit ?? 10
  const usedNames = new Set<string>()
  const { min, max } = RANKING_POINTS_RANGE
  const nameLimit = givenNameCount(locale)

  const messages: BotMessageRankingType[] = Array.from({ length: count }, () => {
    let listName: string
    do {
      listName = pickGivenName(locale).label
    } while (usedNames.has(listName) && usedNames.size < nameLimit)
    usedNames.add(listName)

    const points = randInt(min, max)
    return BotMessageRankingSchema.parse({
      user: { userName: listName, userId: listName },
      slots: { listName, label: String(points), score: points },
    })
  })

  switch (settings.sortOrder) {
    case 'high':
      return messages.sort((a, b) => b.slots.score - a.slots.score)
    case 'low':
      return messages.sort((a, b) => a.slots.score - b.slots.score)
    case 'new':
    default:
      return messages
  }
}
