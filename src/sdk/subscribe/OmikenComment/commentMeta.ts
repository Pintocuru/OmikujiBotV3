// src/sdk/subscribe/OmikenComment/commentMeta.ts
import type { z } from 'zod'
import type { CommentMetaSchema } from '@/types/OmikenComment'
import type { BaseCommentMeta } from '@onecomme.com/onesdk/types/Comment'

// 検証前(スキーマの input)の型
type CommentMetaInput = z.input<typeof CommentMetaSchema>

// 定数
const DAY_7_MS = 7 * 24 * 60 * 60 * 1000

/**
 * メタ情報を作成(検証は OmikenCommentSchema 側で行う)
 */
export function createMeta(isExternal: boolean, meta?: BaseCommentMeta): CommentMetaInput {
  // わんコメが meta を付けないコメントは、回数が不明なので 0 として扱う
  return {
    no: meta?.no ?? 0,
    tc: meta?.tc ?? 0,
    lc: meta?.lc ?? 0,
    isAgain: (meta?.interval ?? 0) > DAY_7_MS,
    isExternal,
  }
}

/**
 * コメントテスター用のメタ情報を作成
 */
export function createTestMeta(isFirstTime?: boolean, meta?: BaseCommentMeta): CommentMetaInput {
  return {
    no: !isFirstTime && meta?.tc === 2 ? 1 : randomInRange(3, 1000),
    tc: isFirstTime && meta?.tc === 1 ? 1 : randomInRange(6, 5000),
    lc: meta?.lc ?? 0,
    isAgain: Boolean(isFirstTime) && meta?.tc === 2,
    isExternal: true,
  }
}

function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
