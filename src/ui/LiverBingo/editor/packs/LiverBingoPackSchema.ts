// src/ui/LiverBingo/editor/packs/LiverBingoPackSchema.ts
import { z } from 'zod'
import { REPO_BASE } from '@/editor/constants'
import { LiverBingoItemSchema } from '@/types/ui'

/**
 * お題パックの置き場所(GitHub の Raw File)
 * - index.json: パックの一覧
 * - <file>: パック本体
 */
export const LIVER_BINGO_PACK_BASE = `${REPO_BASE}/liver-bingo`
export const LIVER_BINGO_PACK_INDEX_URL = `${LIVER_BINGO_PACK_BASE}/index.json`

/** パック本体のファイル名(URL に組み込むので、英数字・_・- の .json だけ許す) */
const packFileSchema = z.string().regex(/^[A-Za-z0-9_-]+\.json$/)

/** 一覧の 1 件(本体を読み込む前に、選ぶための情報) */
export const LiverBingoPackInfoSchema = z.object({
  file: packFileSchema,
  name: z.string().min(1),
  description: z.string().default(''),
  tags: z.array(z.string()).default([]),
})
export type LiverBingoPackInfoType = z.infer<typeof LiverBingoPackInfoSchema>

export const LiverBingoPackIndexSchema = z.object({
  packs: z.array(LiverBingoPackInfoSchema),
})

/**
 * パック本体
 * - items: ランダム項目に入れるお題(20〜40 個ほど)
 * - fixed: 固定項目に入れるお題(任意。FREE など。中央に近い空きマスから順に入る)
 */
export const LiverBingoPackSchema = z.object({
  items: z.array(LiverBingoItemSchema).min(1),
  fixed: z.array(LiverBingoItemSchema).default([]),
})
export type LiverBingoPackType = z.infer<typeof LiverBingoPackSchema>
