// src/generator/scripts/EventProcess/DefaultPlaceholderBuilder.ts
import { OmikenCommentType } from '@/types/OmikenComment'
import { DefaultPlaceholdersCommentSchema, DefaultPlaceholdersMetaSchema } from '@/types/engine'
import type { useAppStore } from '@/generator/stores/useAppStore'
import { createUserIconMarkup } from '@/common/UserIconMarkup/userIconMarkup'

type AppStore = ReturnType<typeof useAppStore>

/**
 * デフォルトのプレースホルダー情報 (配信全体の値)
 */
function buildBasePlaceholders(store: AppStore): Record<string, string | number> {
  const meta = store.serviceMetaStore.getCurrent()
  const { userStats, streamStats } = store

  return DefaultPlaceholdersMetaSchema.parse({
    viewer: meta?.viewer ?? 0,
    upVote: meta?.upVote ?? 0,
    follower: meta?.follower ?? 0,
    commenter: userStats.getUniqueCount(),
    syoken: streamStats.getStats().syoken,
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
    user: `${createUserIconMarkup(omiken.userId)}${omiken.userName}`,
    userId: omiken.userId,
    price: omiken.giftPrice,
    giftCount: omiken.giftCount,
    lc: omiken.meta.lc,
    tc: omiken.meta.tc,
  })
}
