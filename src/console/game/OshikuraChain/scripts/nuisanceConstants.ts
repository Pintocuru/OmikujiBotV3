// src/console/game/OshikuraChain/scripts/nuisanceConstants.ts
// おしくらチェインの定数。マス目・時間の刻み・記録の名前は、ここだけを変える

// ---- マス目 (横長: 横 11 × 縦 8) ----
export const GRID_COLS = 11
export const GRID_ROWS = 7
/** 1マスの描画の大きさ (px。画面の大きさに合わせて、縮尺は自動で変わる) */
export const CELL_PX = 64

// ---- 時間 ----
/** シミュレーションの1刻み (秒)。1フレームの経過時間を、この刻みで進める */
export const STEP_SECONDS = 0.05
/** 1回の更新で進める刻みの上限 (安全装置。通常のフレームでは届かない) */
export const MAX_STEPS_PER_ADVANCE = 6000
/**
 * 1フレームで進めるゲーム内の時間の上限 (秒)。
 * ウィンドウが非表示の間は requestAnimationFrame が止まり、ゲームも止まる。再表示された最初のフレームで、
 * 止まっていた時間がまとめて進まないようにする (処理落ちしたときも同じ)
 */
export const MAX_FRAME_SECONDS = 0.25

/** 巨大化するユーザーの出現間隔 (秒) */
export const GIANT_INTERVAL_SECONDS = 120

// ---- タイムアタック ----
/** タイムアタックの目標 (獲得秒数の合計)。これに届くまでのタイムを競う (仮の値。プレイして調整する) */
export const TIME_ATTACK_TARGET_SECONDS = 3600

// ---- コメントオートモード (実コメントの代わりに、一定間隔で架空のコメントを入れる) ----
/** コメントを入れる間隔 (ゲーム内の時計の秒。きっちり、この間隔) */
export const AUTO_COMMENT_INTERVAL_SECONDS = 5
/** オートモードの投稿者のプールの人数 (テストコメントの「想定ユーザー数」と同じ考え方) */
export const AUTO_COMMENT_USER_COUNT = 50

// ---- 演出 ----
/** 大連鎖として祝う連鎖数 (連鎖がこの数以上で終わったとき、祝いの音を鳴らす。音階が 1 オクターブ上のドになる 8 連鎖を目安にした) */
export const BIG_CHAIN_MIN = 8

// ---- 主人公 ----
/** 1マス動く間隔 (秒)。キーを押し続けている間、この間隔で動く */
export const HERO_MOVE_INTERVAL_SECONDS = 0.14
/** 初見さんのコメントで倍率が戻ったことを、演出で知らせるのは、倍率がこの値を上回っていたとき (わずかな上がりでは知らせない) */
export const MULTIPLIER_RESET_NOTICE_ABOVE = 1.5
/** 画面の外へ押し出して得点したあと、次に動けるまでの間隔 (秒。クールダウン。得点のリズムになる) */
export const HERO_PUSH_INTERVAL_SECONDS = 0.5
/** 連鎖して押されるとき、1 つ後ろにつき動き出しを遅らせる秒数 (ウェーブ状に見せる。見た目だけで、位置は即座に変わる) */
export const PUSH_WAVE_DELAY_SECONDS = 0.15

// ---- アイコン (コメントした人) ----
/** アイコンが占めるマスの一辺の上限 (大きさの倍率を四捨五入して、1〜この値) */
export const MAX_FOOTPRINT = 3

// ---- コメントの文字 (ことば。ダメージなし・得点なし。押し出せて、時間が経つと消える) ----
/** 1 つの「ことば」に入れる文字数。コメントの文字数がこれを超えるごとに、1 つ増える */
export const WORD_CHARS_PER_ITEM = 5
/** 1 コメントから降ってくる「ことば」の上限 */
export const WORD_MAX_PER_COMMENT = 5
/** 同時に盤面にある「ことば」の上限。超えたら、古いものから (爆発させずに) 消す */
export const WORD_MAX = 30
/** 「ことば」が爆発するまでの時間 (秒)。この範囲でランダム (押されるたびに、最初の長さに戻る) */
export const WORD_SECONDS_MIN = 5
export const WORD_SECONDS_MAX = 20

// ---- ギフト効果 (ワード保護・倍率冷却) ----
/** 金額に応じたワード保護時間 (秒) */
export const GIFT_PROTECT_TIERS: readonly { minPrice: number; seconds: number }[] = [
  { minPrice: 10001, seconds: 60 },
  { minPrice: 5001, seconds: 40 },
  { minPrice: 2001, seconds: 30 },
  { minPrice: 1001, seconds: 20 },
  { minPrice: 501, seconds: 15 },
  { minPrice: 201, seconds: 10 },
  { minPrice: 1, seconds: 5 },
  { minPrice: 0, seconds: 0 },
]

/** ギフト金額による倍率引き下げ係数 (金額 / この値 だけ倍率を下げる。1000円で ×1.0 低下) */
export const GIFT_COOL_PRICE_UNIT = 1000

// ---- 記録 (GameLog) ----
/** ユーザーごとの貢献度 (その人のものが生んだ秒数) の eventKey。生存時間とは別のランキングにする */
export const CONTRIBUTION_EVENT_KEY = 'oshikuraChainSeconds'
/** ゲーム全体の生存時間の eventKey (貢献度とは別にして、ランキングを混ぜない) */
export const SURVIVAL_EVENT_KEY = 'oshikuraChainTime'
/** タイムアタックのクリアタイムの eventKey (生存時間とは別にして、ランキングを混ぜない。小さいほど良い記録) */
export const TIME_ATTACK_EVENT_KEY = 'oshikuraChainTimeAttack'
/** 生存時間の記録に使う、プレイヤー (配信者) の userId と表示名。ユーザーリストにはいない */
export const PLAYER_USER_ID = 'player'
export const PLAYER_USER_NAME = '配信者'

/** 設定をサーバーに保存するときの gameKey (ConsoleViewKey と同じ) */
export const CONFIG_GAME_KEY = 'oshikuraChain'
