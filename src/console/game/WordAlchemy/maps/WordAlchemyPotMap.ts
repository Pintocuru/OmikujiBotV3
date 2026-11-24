// src/console/game/WordAlchemy/maps/WordAlchemyPotMap.ts
// 鍋の種類。鍋ごとに、許可する変換・性格 (受け付けないことば)・AI への指示文を持つ (並べ替え・結合・省略は全鍋で許可)
// 鍋の数と内容は未確定 (SPEC の「鍋の種類(案)」)

/** ことばの性格の判定。受け付けないことばの種類 */
export type PotRejectKind = 'digitsOnly' | 'symbolsOnly'

export type PotDefinition = {
  label: string
  /** AI への指示文 (固定) */
  instruction: string
  /** 短くまとめる: Mock が、材料の半分ほどに省略する (どの鍋も、材料の文字を使わなくてよい) */
  short: boolean
  /** かな変換: ひらがな ↔ カタカナ */
  kana: boolean
  /** 清濁変換: 清音 ↔ 濁音・半濁音 (か ↔ が など) */
  dakuten: boolean
  /** 受け付けない (鍋が投げ飛ばす) ことばの種類 */
  rejects: readonly PotRejectKind[]
}

export const potMap = {
  mizutaki: {
    label: '水炊き鍋',
    instruction: '水炊き鍋。材料の文字を並べ替え・結合して名前を作れ(不要な文字は省いてよい)',
    short: false,
    kana: false,
    dakuten: false,
    rejects: ['digitsOnly', 'symbolsOnly'],
  },
  pressure: {
    label: '圧力鍋',
    instruction: '圧力鍋。材料の文字を並べ替え・結合し、一部を省略して短くまとめた名前を作れ',
    short: true,
    kana: false,
    dakuten: false,
    rejects: ['digitsOnly', 'symbolsOnly'],
  },
  yami: {
    label: '闇鍋',
    instruction: '闇鍋。材料の文字を並べ替え・結合し、清音と濁音・半濁音を入れ替えてよい(か↔が など)',
    short: false,
    kana: false,
    dakuten: true,
    rejects: [],
  },
  kana: {
    label: 'カナ鍋',
    instruction: 'カナ鍋。材料の文字を並べ替え・結合し、ひらがなとカタカナを入れ替えてよい',
    short: false,
    kana: true,
    dakuten: false,
    rejects: ['symbolsOnly'],
  },
} as const satisfies Record<string, PotDefinition>

export type PotKey = keyof typeof potMap
export const POT_KEYS = Object.keys(potMap) as PotKey[]
export const DEFAULT_POT: PotKey = 'pressure'
