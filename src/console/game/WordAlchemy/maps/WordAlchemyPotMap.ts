// src/console/game/WordAlchemy/maps/WordAlchemyPotMap.ts
// 鍋の種類。鍋は、名前の命名スタイル・加工方法を決める指示文のルールセット (SPEC の「鍋」)。
// 鍋の表示名は AI に送らず、instruction だけを送る。鍋が増えたら、ここに足す (闇鍋の抽選の候補にも自動で入る)
import { PRESSURE_POT_NAME_LENGTH } from '../scripts/wordAlchemyConstants'

/** 鍋の見た目 (同じ絵の色替え)。body: 鍋の胴 / liquid: 中身の水面。煮込み中は、どの鍋も緑に泡立つ */
export type PotLook = { body: string; liquid: string }

export type PotDefinition = {
  label: string
  look: PotLook
  /** AI への指示文 (固定。短く)。闇鍋は空で、煮込みごとに、ほかの鍋から 1 つ引く */
  instruction: string
  /** 短くまとめる: Mock が、材料の半分ほどに省略する (圧力鍋だけ) */
  short: boolean
  /** 闇鍋: 闇鍋自身を除く全ての鍋から、煮込みごとに 1 回だけ引く */
  random: boolean
}

export const potMap = {
  mizutaki: {
    look: { body: '#8a7d70', liquid: '#d8cfae' }, // 白濁した出汁の、素朴な鍋
    label: '水炊き鍋',
    instruction: '材料の文字を並べ替え・結合・省略して、材料とのつながりが分かる素直な名前にする',
    short: false,
    random: false,
  },
  pressure: {
    look: { body: '#5b6670', liquid: '#9fb2c0' }, // 鋼の色
    label: '圧力鍋',
    instruction: `材料を大胆に省略・圧縮して、${PRESSURE_POT_NAME_LENGTH}文字以内の短く凝縮した名前にする`,
    short: true,
    random: false,
  },
  bistro: {
    look: { body: '#a33a3a', liquid: '#e0b890' }, // 赤いホーロー
    label: 'ビストロ鍋',
    instruction:
      'フランス料理・洋菓子・香水・雑貨のような洒落た響きの名前にする。材料の音や意味を残し、フランス語風の綴り・語尾に変形してよい(文字の追加も可)',
    short: false,
    random: false,
  },
  chuka: {
    look: { body: '#2b2b30', liquid: '#c8892a' }, // 黒い鉄、飴色の油
    label: '中華鍋',
    instruction: '材料の読みや意味を漢字に変換し、中華料理・武術の技名・四字熟語のような名前にする',
    short: false,
    random: false,
  },
  witch: {
    look: { body: '#3b2a55', liquid: '#9b6bd8' }, // 紫の釜
    label: '魔女の釜',
    instruction:
      '呪文・魔法薬・魔物・魔法アイテムのような名前にする。カタカナ中心で、濁音・長音で怪しさを出す(文字の変形・追加も可)',
    short: false,
    random: false,
  },
  hitech: {
    look: { body: '#d9dee6', liquid: '#4aa3e8' }, // 白い本体、青い光
    label: 'ハイテク炊飯器',
    instruction:
      'SF・ロボット・装置・製品名のような名前にする。材料の音や意味を機械の名称・機能名に変換し、型番・英数字・記号を含めてもよい',
    short: false,
    random: false,
  },
  washi: {
    look: { body: '#8a5a3a', liquid: '#d9b68a' }, // 茶色の土鍋
    label: '和風土鍋',
    instruction:
      '和菓子・妖怪・妖術・伝説の道具のような和風の名前にする。材料の読みや意味を活かし、漢字・当て字を使ってよい',
    short: false,
    random: false,
  },
  yami: {
    look: { body: '#17151a', liquid: '#3a3540' }, // 色を変えず、何が出るか分からないまま
    label: '闇鍋',
    instruction: '',
    short: false,
    random: true,
  },
} as const satisfies Record<string, PotDefinition>

export type PotKey = keyof typeof potMap
export const POT_KEYS = Object.keys(potMap) as PotKey[]
export const DEFAULT_POT: PotKey = 'mizutaki'
