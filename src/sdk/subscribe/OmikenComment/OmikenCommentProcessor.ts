// src/sdk/subscribe/OmikenComment/OmikenCommentProcessor.ts
import type { z } from 'zod'
import { CommentMetaSchema, OmikenCommentSchema } from '@/types/OmikenComment'
import type { OmikenCommentType, UserAccessLevelType } from '@/types/OmikenComment'
import type { BaseCommentMeta, Comment } from '@onecomme.com/onesdk/types/Comment'
import { normalizeUserId } from './normalizeUserId'

// 検証前(スキーマの input)の型
type OmikenCommentInput = z.input<typeof OmikenCommentSchema>
type CommentMetaInput = z.input<typeof CommentMetaSchema>

// 定数
const DAY_7_MS = 7 * 24 * 60 * 60 * 1000

/**
 * 金額の円換算レート(1単位あたりの円)。為替の変動は追わず、「それらしい金額」で判定できればよい概算。
 * 通貨コード(YouTube の currency など)と通貨記号(unit)の両方を引ける。
 * 従来の仕様: ¥=1 / $=100 / NT$=5
 */
const YEN_RATES = new Map<string, number>([
  // 円
  ['JPY', 1], ['¥', 1], ['￥', 1], ['円', 1],
  // ドル系・ユーロ・ポンドなど
  ['USD', 100], ['$', 100], ['US$', 100],
  ['EUR', 110], ['€', 110],
  ['GBP', 130], ['£', 130],
  ['CHF', 115],
  ['CAD', 75], ['CA$', 75], ['CAD$', 75],
  ['AUD', 65], ['A$', 65], ['AU$', 65],
  ['NZD', 60], ['NZ$', 60],
  ['SGD', 75], ['S$', 75],
  ['HKD', 13], ['HK$', 13],
  ['TWD', 5], ['NT$', 5],
  ['CNY', 14], ['RMB', 14],
  ['KRW', 0.1], ['₩', 0.1],
  // 東南アジア・南アジア・中東
  ['THB', 3], ['฿', 3],
  ['PHP', 2], ['₱', 2],
  ['MYR', 22],
  ['IDR', 0.01],
  ['VND', 0.004], ['₫', 0.004],
  ['INR', 1.2], ['₹', 1.2],
  ['ILS', 28], ['₪', 28],
  ['AED', 27],
  ['SAR', 27],
  ['TRY', 3],
  // 中南米・ヨーロッパ・その他
  ['BRL', 20], ['R$', 20],
  ['MXN', 6], ['MX$', 6],
  ['ARS', 0.1],
  ['CLP', 0.1],
  ['COP', 0.03],
  ['PEN', 27],
  ['PLN', 25], ['ZŁ', 25],
  ['CZK', 5], ['KČ', 5],
  ['SEK', 10], ['NOK', 10], ['DKK', 15], ['KR', 10],
  ['HUF', 0.3],
  ['RON', 22],
  ['RUB', 1.2],
  ['UAH', 2.5],
  ['ZAR', 6],
])

const warnedUnits = new Set<string>()

/** 通貨コード(currency)か通貨記号(unit)から、円へのレートを求める。未知の単位は 1 倍(初回のみ警告) */
function resolveYenRate(currency?: string, unit?: string): number {
  for (const raw of [currency, unit]) {
    const key = raw?.trim()
    if (!key) continue
    const rate = YEN_RATES.get(key) ?? YEN_RATES.get(key.toUpperCase())
    if (rate !== undefined) return rate
  }

  const label = currency?.trim() || unit?.trim()
  if (label && !warnedUnits.has(label)) {
    warnedUnits.add(label)
    console.warn(`[OmikenCommentProcessor] 未知の金額単位です(等倍で扱います): ${label}`)
  }
  return 1
}

/**
 * 金額を円に換算する(小数は四捨五入)
 */
function convertToJPY(price: number | undefined, currency?: string, unit?: string): number {
  if (!price || price <= 0) return 0
  return Math.round(price * resolveYenRate(currency, unit))
}

/**
 * プラットフォームによって有無や型が異なるフィールドのうち、判定に使うもの。
 * Comment['data'] はプラットフォームごとのユニオンで、共通で持たないため、ここで任意項目として読む。
 */
type PlatformFields = {
  isOwner?: boolean
  isModerator?: boolean
  isMember?: boolean
  subscriber?: string // Twitch など('1' ならサブスク)
  premium?: boolean
  anonymity?: boolean // 多くのサービスの匿名
  isAnonymous?: boolean // Twicas の匿名
  hasGift?: boolean
  price?: number
  unit?: string // YouTube では非推奨。通貨記号
  currency?: string // YouTube の通貨コード(JPY / USD ...)
  giftType?: string
}

function platformFields(data: object): PlatformFields {
  return data as PlatformFields
}

/**
 * コメントテスター判定
 */
const isCommentTester = (comment: Comment): boolean => comment.id === 'COMMENT_TESTER'

/**
 * 処理できる形のコメントか(data がオブジェクトであること)
 */
function isComment(value: unknown): value is Comment {
  if (typeof value !== 'object' || value === null) return false
  const data = (value as { data?: unknown }).data
  return typeof data === 'object' && data !== null
}

/**
 * 1件のコメントを加工する。失敗したら警告を出して null を返す(例外は投げない)
 */
function toOmikenComment(comment: unknown): OmikenCommentType | null {
  try {
    if (!isComment(comment)) {
      console.warn('[processOmikenComment] 不正な入力:', comment)
      return null
    }

    const result = OmikenCommentSchema.safeParse(buildCommentPayload(comment))
    if (!result.success) {
      console.warn('[processOmikenComment] パース失敗 (スキップ):', result.error.flatten(), '元データ:', comment)
      return null
    }
    return result.data
  } catch (error) {
    console.warn('[processOmikenComment] 処理中にエラー (スキップ):', error, '元データ:', comment)
    return null
  }
}

/**
 * わんコメのコメントをおみくじBOT用コメントに加工
 * コメントリストから処理可能なコメントをすべて返す(1件失敗しても他のコメントは処理を続ける)
 */
export function processOmikenComments(comments: Comment[]): OmikenCommentType[] {
  return comments.flatMap((comment) => {
    const result = toOmikenComment(comment)
    return result ? [result] : []
  })
}

/**
 * 単一のコメントを処理
 */
export function processOmikenComment(comment: unknown): OmikenCommentType | null {
  return toOmikenComment(comment)
}

/**
 * わんコメのコメントを、OmikenComment(検証前)に変換
 */
function buildCommentPayload(comment: Comment): OmikenCommentInput {
  const { data, meta } = comment
  const fields = platformFields(data)
  const isTester = isCommentTester(comment)
  // 各プラットフォームのコメントは external にならない(コメントテスターや外部APIからの投稿だけ)
  const isExternal = comment.service === 'external'

  return {
    id: data.id,
    userId: normalizeUserId(comment.service, data.userId),
    userName: data.displayName ?? data.nickname ?? data.name,
    timestamp: Date.parse(data.timestamp),
    profileImage: data.profileImage,
    accessLevel: isExternal ? determineTestAccessLevel(fields) : determineAccessLevel(fields),
    giftPrice: getGiftPrice(fields),
    comment: data.comment,
    meta: isTester ? createTestMeta(data.isFirstTime, meta) : createMeta(isExternal, meta),
  }
}

/**
 * アクセスレベルを判定(優先度順: 配信者 > モデレーター > メンバー > 匿名 > 一般)
 */
function determineAccessLevel(fields: PlatformFields): UserAccessLevelType {
  if (fields.isOwner) return 'owner'
  if (fields.isModerator) return 'moderator'
  if (fields.isMember || fields.subscriber === '1' || fields.premium) return 'member'
  if (fields.anonymity || fields.isAnonymous) return 'anonymous'
  return 'basic'
}

/**
 * 外部コメント(コメントテスター等)用のアクセスレベルを判定
 */
function determineTestAccessLevel(fields: PlatformFields): UserAccessLevelType {
  if (fields.isOwner) return 'owner'
  if (fields.isMember) return 'member'
  return 'basic'
}

/**
 * メタ情報を作成(検証は OmikenCommentSchema 側で行う)
 */
function createMeta(isExternal: boolean, meta?: BaseCommentMeta): CommentMetaInput {
  return {
    no: meta?.no,
    tc: meta?.tc,
    lc: meta?.lc,
    isAgain: (meta?.interval ?? 0) > DAY_7_MS,
    isExternal,
  }
}

/**
 * コメントテスター用のメタ情報を作成
 */
function createTestMeta(isFirstTime?: boolean, meta?: BaseCommentMeta): CommentMetaInput {
  return {
    no: !isFirstTime && meta?.tc === 2 ? 1 : randomInRange(3, 1000),
    tc: isFirstTime && meta?.tc === 1 ? 1 : randomInRange(6, 5000),
    lc: meta?.lc,
    isAgain: Boolean(isFirstTime) && meta?.tc === 2,
    isExternal: true,
  }
}

function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * ギフトの価格(円)を取得。ギフトでなければ null
 */
function getGiftPrice(fields: PlatformFields): number | null {
  if (!fields.hasGift) return null
  // YouTube のジュエル: price は金額ではなく消費ジュエル数の合計(通貨なし)。
  // TODO: 仕様未確定のため、仮に 1 ジュエル = 1 円として扱う(従来の挙動と同じ)
  if (fields.giftType === 'jewel') return convertToJPY(fields.price)
  return convertToJPY(fields.price, fields.currency, fields.unit)
}
