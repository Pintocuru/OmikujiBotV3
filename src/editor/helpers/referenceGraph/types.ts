// src/editor/helpers/referenceGraph/types.ts
import type { CategoryType } from '@/types/OmikujiData'

/** 接続表示のチップ1つ分。クリックで category の key へ移動する(イベントは id を key として持つ) */
export type LinkItem = {
  category: CategoryType
  key: string
  name: string
  /** 参照先が存在しない(削除済み)。移動できず、警告表示になる */
  missing?: boolean
}
