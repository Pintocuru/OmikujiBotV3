// src/common/MockUser/comments/commentThemes.ts

/**
 * テストコメント用の配信テーマ別コメント集
 * - テーマを足すときは COMMENT_THEMES に1項目足すだけ(UI の選択肢は自動で増える)
 */

export type CommentTheme = {
  label: string // 画面に出す名前
  comments: readonly string[]
}

// どのテーマでも混ぜる、あいさつ・相づち
export const COMMON_COMMENTS = [
  'こんにちはー！',
  'お疲れさまです！',
  'おはよー',
  'おはようございます',
  'こんばんはー',
  'ナイス！',
  '草',
  'ｗｗｗ',
  'わかる〜',
  '初見です！',
  '8888888',
] as const

export const COMMENT_THEMES = {
  chat: {
    label: '雑談',
    comments: [
      'そうなんですね',
      'それな',
      '大草原',
      'GG',
      'へぇー知らなかった',
      '今日も来ました',
      'ゆっくり聞いてます',
      'ラジオ感覚で聞いてる',
      '最近寒くなってきましたね',
      'お昼ご飯食べました？',
      'それ私もあります！',
      '仕事終わりに来ました〜',
      'また明日も来ます',
      'ちょっと聞いてほしいんだけど',
    ],
  },
  cooking: {
    label: '料理',
    comments: [
      '美味しそう！',
      'お腹空いてきた',
      '飯テロだ…',
      '味付けはどれくらいですか？',
      '火加減教えてください',
      '今日の晩ごはん決まりました',
      '調味料は何を使ってますか？',
      '包丁さばきすごい',
      'レシピ後で見返したい',
      'それ家でも作れそう',
      '焦げてない？ｗ',
      '出来上がり楽しみ',
      'ご飯が進むやつ',
      'いい匂いしてきそう',
    ],
  },
  game: {
    label: 'ゲーム',
    comments: [
      'ナイスプレイ！',
      'うまっ',
      'そこ右です！',
      'ああー惜しい',
      '今のどうやったの？',
      'ドンマイ！',
      'ガチャ引こう',
      'リセマラ何回目ですか？',
      'ボス強すぎない？',
      'その装備いいね',
      'GG！',
      '逆転きた！',
      'ラグくない？',
      '初見プレイ？',
      '一撃で草',
    ],
  },
  music: {
    label: '歌・音楽',
    comments: [
      '歌うまい！',
      'いい声…',
      'リクエストしてもいいですか？',
      'この曲好き',
      '鳥肌立った',
      'アンコール！',
      '懐かしい〜',
      'ギターかっこいい',
      '泣きそう',
      'もう一回聴きたい',
      '高音きれい',
      '次の曲も楽しみ',
      'サビで盛り上がった',
    ],
  },
  craft: {
    label: 'お絵描き・作業',
    comments: [
      '線きれい',
      '色使いが好き',
      'どうやって描いてるの？',
      'ブラシ何使ってますか？',
      '塗りが丁寧',
      '完成が楽しみ',
      '作業用BGMにしてます',
      'レイヤー構成気になる',
      'すごい集中力',
      '背景も描くの？',
      'タイムラプス見たい',
      'キャラかわいい',
    ],
  },
} as const satisfies Record<string, CommentTheme>

export type CommentThemeKey = keyof typeof COMMENT_THEMES

export const COMMENT_THEME_KEYS = Object.keys(COMMENT_THEMES) as CommentThemeKey[]

// 共通コメントを混ぜる割合
const COMMON_RATE = 0.25

const pick = <T>(list: readonly T[]): T => list[Math.floor(Math.random() * list.length)]

/**
 * テーマに沿ったコメントを1件選ぶ
 * - customComments が渡されたら、そちらだけから選ぶ(共通コメントも混ぜない)
 */
export function pickTestComment(theme: CommentThemeKey, customComments?: readonly string[]): string {
  if (customComments && customComments.length > 0) return pick(customComments)
  if (Math.random() < COMMON_RATE) return pick(COMMON_COMMENTS)
  return pick(COMMENT_THEMES[theme].comments)
}
