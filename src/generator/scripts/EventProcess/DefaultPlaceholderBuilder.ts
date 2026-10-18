// src/generator/scripts/EventProcess/DefaultPlaceholderBuilder.ts
import { OmikenCommentType } from '@/types/OmikenComment'
import { DefaultPlaceholdersCommentSchema, DefaultPlaceholdersMetaSchema, ServiceMetaCondition } from '@/types/engine'
import type { useAppStore } from '@/generator/stores/useAppStore'

type AppStore = ReturnType<typeof useAppStore>

/**
 * 変数プレースホルダー用の userId 変換
 */
export function sanitizeKey(raw: string): string {
  let h = 0
  for (let i = 0; i < raw.length; i++) {
    h = (h * 31 + raw.charCodeAt(i)) >>> 0
  }
  return `v${h.toString(36)}`
}

/**
 * デフォルトのプレースホルダー情報 (配信全体の値)
 */
export function buildBasePlaceholders(store: AppStore): Record<ServiceMetaCondition, string | number> {
  const meta = store.serviceMetaStore.getCurrent()
  const { userSession, streamStats } = store

  const uniqueCount = userSession.stats.getUniqueCount()
  const { liveComments, syoken } = streamStats.getStats()
  const { winners } = userSession.stats.drawWinners(1)
  const firstWinner = winners[0]
  const now = new Date()
  const h = String(now.getHours()).padStart(2, '0')
  const m = String(now.getMinutes()).padStart(2, '0')

  return DefaultPlaceholdersMetaSchema.parse({
    viewer: meta?.viewer ?? 0,
    upVote: meta?.upVote ?? 0,
    follower: meta?.follower ?? 0,
    lc: liveComments,
    commenter: uniqueCount,
    syoken,
    winner: firstWinner ? `{{icon ${firstWinner.userId}}}${firstWinner.userName}` : 'Null',
    winnerId: firstWinner ? sanitizeKey(firstWinner.userId) : 'Null',
    clock: `${h}時${m}分`,
  })
}

/**
 * comment 用デフォルトのプレースホルダー情報。
 * おみくじ本文 (OmikujiProcessor) と判定式 (ExpressionChecker) で同じ値を使うための共通処理。
 */
export function buildDefaultPlaceholders(store: AppStore, omiken?: OmikenCommentType): Record<string, string | number> {
  const basePlaceholders = buildBasePlaceholders(store)

  if (!omiken) return basePlaceholders

  return DefaultPlaceholdersCommentSchema.parse({
    ...basePlaceholders,
    user: `{{icon ${omiken.userId}}}${omiken.userName}`,
    userId: sanitizeKey(omiken.userId),
    price: omiken.giftPrice,
    lc: omiken.meta.lc,
    tc: omiken.meta.tc,
    draws: omiken.omikuji?.draws,
  })
}
